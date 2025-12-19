import * as glUtils from "../../webglUtils";
import { useRef, useEffect } from "react";

export default function NewtonCanvas({innerRef, uniforms}:{innerRef:React.RefObject<HTMLCanvasElement | null>, uniforms:React.RefObject<Record<string, glUtils.Uniform>>}){
    const animationRef = useRef<number|null>(null);
    useEffect(()=>{
        const canvas = innerRef.current as HTMLCanvasElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const glContext = glUtils.initGLContext(canvas);
        const {gl} = glContext;
        gl.viewport(0, 0, canvas.width, canvas.height)
        const fragmentShaderSources = {
            renderShaderSource:"newton/fragmentShader.glsl"
        };
        const vertexShaderSources = {
            renderShaderSource:"quadShader.glsl"
        };
        (async()=>{
            const {renderProgram} = await glUtils.shaderToProgramUniform(glContext, vertexShaderSources, fragmentShaderSources, uniforms.current);
            function render(){
                glUtils.renderFrameBuffer(gl, renderProgram, uniforms.current);
            };
            function loop(){
                render();
                animationRef.current = requestAnimationFrame(loop)
            }
            loop();
        })()
        return(()=>{
            if (animationRef.current!==null) cancelAnimationFrame(animationRef.current);
            glUtils.clearResources(glContext);
        })
    }, [])
    return(
        <canvas ref={innerRef}/>
    )
}