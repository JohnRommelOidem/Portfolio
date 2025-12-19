import { useEffect, useRef } from "react"
import * as glUtils from "../../webglUtils";


export default function MandelbrotCanvas({innerRef, uniforms, collapse}:{innerRef:React.RefObject<HTMLCanvasElement | null>, uniforms:glUtils.UniformRefObject, collapse:string}){
    const animationRef = useRef<number|null>(null);
    useEffect(()=>{
        const canvas = innerRef.current as HTMLCanvasElement;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        const glContext = glUtils.initGLContext(canvas);
        const {gl} = glContext;
        gl.viewport(0, 0, canvas.width, canvas.height);
        const fragmentShaderSources = {
            renderShaderSource:"mandelbrot/mandelFragmentShader.glsl"
        }
        const vertexShaderSources = {
            renderShaderSource:"quadShader.glsl"
        };
        (async ()=>{
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
    }, [collapse])
    return (
        <canvas ref={innerRef}></canvas>
    )
} 