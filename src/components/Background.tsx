import './components.css'
import { useRef, useEffect } from 'react';
import * as glUtils from '../webglUtils';

function generateWeights(sigma:number=3, radius:number=4){
    const weights = Array.from({length:radius}, (_,i)=>Math.exp(-1*i**2/(2*sigma**2)));
    let sum = weights[0] + 2*weights.slice(1).reduce((a,b)=>a+b,0);
    return weights.map(w=>w/sum);
}

export default function Background(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    useEffect(()=>{

        const PARTICLE_COUNT = 50;
        const INITIAL_CONDITIONS = new Float32Array(PARTICLE_COUNT * 6);
        for (let i=0;i<PARTICLE_COUNT;i++){
            INITIAL_CONDITIONS[i*6+0] = (Math.random())*0.1+1.2;
            INITIAL_CONDITIONS[i*6+1] = Math.PI*(Math.random()*2-1)*0.1;
            INITIAL_CONDITIONS[i*6+2] = (Math.random()*2-1)*0.1+4;
            INITIAL_CONDITIONS[i*6+3] = 0;
            INITIAL_CONDITIONS[i*6+4] = 1;
            INITIAL_CONDITIONS[i*6+5] = 0;
        }
        const canvas = canvasRef.current as HTMLCanvasElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const glContext = glUtils.initGLContext(canvas);
        const {gl} = glContext;

        gl.getExtension('EXT_color_buffer_float');
        gl.viewport(0, 0, canvas.width, canvas.height);
        const fragmentShaderSources = {
            renderShaderSource: "background/fragmentShader.glsl",
            fadeShaderSource: "background/filters/fadeShader.glsl",
            copyShaderSource: "background/copyShader.glsl",
            brightShaderSource: "background/filters/brightShader.glsl",
            blurShaderSource: "background/filters/blurShader.glsl",
            compositeShaderSource: "background/filters/compositeShader.glsl"
        };
        const vertexShaderSources = {
            renderShaderSource: "background/vertexShader.glsl",
            fadeShaderSource: "quadShader.glsl",
            copyShaderSource: "quadShader.glsl",
            brightShaderSource: "quadShader.glsl",
            blurShaderSource: "quadShader.glsl",
            compositeShaderSource: "quadShader.glsl"
        };
        const updateFragmentShaderSources = {
            updateShaderSource: "background/emptyFragmentShader.glsl"
        };
        const updateVertexShaderSources = {
            updateShaderSource: "background/updateShader.glsl"
        };
        const uniforms = {
            u_scene:glUtils.createUniform(0, "1i"),
            u_prevScene:glUtils.createUniform(1, "1i"),
            u_horizontal:glUtils.createUniform(1, "1i"),
            u_texSize:glUtils.createUniform([canvas.width, canvas.height], "2f"),
            u_weights:glUtils.createUniform(generateWeights(), "1fv"),
            u_weightLength:glUtils.createUniform(4, "1i")
        };
        const attributes = {
            a_position: 3,
            a_momentum:3
        };
        (async ()=>{
            const {renderProgram, fadeProgram, brightProgram, copyProgram, blurProgram, compositeProgram} = await glUtils.shaderToProgramUniform(glContext, vertexShaderSources, fragmentShaderSources, uniforms, attributes);
            const {updateProgram} = await glUtils.shaderToTFProgramUniform(glContext, updateVertexShaderSources, updateFragmentShaderSources, ["tf_position", "tf_momentum"],  attributes);
            gl.clearColor(0, 0, 0, 1);
            let read = glUtils.createParticleBuffer(glContext, INITIAL_CONDITIONS, attributes, updateProgram.attributes);
            let write = glUtils.createParticleBuffer(glContext, INITIAL_CONDITIONS, attributes, updateProgram.attributes);
            function update(){
                gl.useProgram(updateProgram.program);
                gl.bindVertexArray(read.vao);

                gl.enable(gl.RASTERIZER_DISCARD);
                gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, write.tf);

                gl.beginTransformFeedback(gl.POINTS);
                gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
                gl.endTransformFeedback();
                
                gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, null);
                gl.disable(gl.RASTERIZER_DISCARD);
                [read, write] = [write, read];
            }
            let readFB = glUtils.createFrameBuffer(glContext, canvas.width, canvas.height);
            let writeFB = glUtils.createFrameBuffer(glContext, canvas.width, canvas.height);
            const rawFB = glUtils.createFrameBuffer(glContext, canvas.width, canvas.height);
            const brightFB = glUtils.createFrameBuffer(glContext, canvas.width, canvas.height);
            const blur1FB = glUtils.createFrameBuffer(glContext, canvas.width, canvas.height);
            const blur2FB = glUtils.createFrameBuffer(glContext, canvas.width, canvas.height);

            const bloom = true;
            function render(){
                gl.useProgram(renderProgram.program);
                gl.bindFramebuffer(gl.FRAMEBUFFER, rawFB.fbo);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.bindVertexArray(read.vao);
                gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT);
                glUtils.renderFrameBuffer(gl, fadeProgram, uniforms, writeFB.fbo, [rawFB.tex, readFB.tex]);
                [readFB, writeFB] = [writeFB, readFB];
                if (bloom){
                    glUtils.renderFrameBuffer(gl, brightProgram, uniforms, brightFB.fbo, [readFB.tex], gl.TEXTURE1);
                } else {
                    glUtils.renderFrameBuffer(gl, copyProgram, uniforms, null, [readFB.tex], gl.TEXTURE1);
                    return;
                }

                uniforms.u_horizontal.value = 1;
                glUtils.renderFrameBuffer(gl, blurProgram, uniforms, blur1FB.fbo, [brightFB.tex])
                uniforms.u_horizontal.value = 0;
                glUtils.renderFrameBuffer(gl, blurProgram, uniforms, blur2FB.fbo, [blur1FB.tex])
                glUtils.renderFrameBuffer(gl, compositeProgram, uniforms, null, [blur2FB.tex])
            }
            function loop(){
                render();
                update();
                animRef.current = requestAnimationFrame(loop);
            }
            loop();
        })();
        return ()=>{
            if(animRef.current !== null) cancelAnimationFrame(animRef.current)
            glUtils.clearResources(glContext);
        }
    }, [])
    return (
        <canvas ref={canvasRef} className="background"/>
    )
}