import ProjectPage from "../ProjectPage";
import { useState, useRef, useLayoutEffect } from "react";
import { circleComplex } from "./NewtonUtils";
import NewtonCanvas from "./NewtonCanvas";
import styles from "./Newton.module.css"
import NewtonSvg from "./NewtonSvg";
import Controls from "./Controls";
import * as glUtils from "../../webglUtils";

function getTransMatrix(canvas:HTMLCanvasElement|SVGSVGElement, transform: {k: number, x: number, y: number} = {k:1, x:0, y:0}):number[]{
    const {k, x, y} = transform;
    const minDimension = Math.min(canvas.clientWidth, canvas.clientHeight);
    return [
        1/(k*minDimension), 0, 0,
        0, 1/(k*minDimension), 0,
        (-x-k*canvas.clientWidth/2)/(k*minDimension), (y-canvas.clientHeight+k*canvas.clientHeight/2)/(k*minDimension), 1
    ]
}

export default function NewtonFractalProject(){
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [canvasReady, setCanvasReady] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [numRoots, setNumRoots] = useState(4);
    const uniforms = useRef<Record<string, glUtils.Uniform>>({
        u_iterations: glUtils.createUniform(20, "1i"),
        u_transform: glUtils.createUniform([1, 0, 0, 0, 1, 0, 0, 0, 1], "matrix3"),
        u_roots: glUtils.createUniform(Array.from({length:numRoots}, (_, i)=>circleComplex(numRoots, i)), "2fv"),
        u_numRoots: glUtils.createUniform(numRoots, "1i"),
        u_colors: glUtils.createUniform([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 1],
            [1, 1, 0],
            [1, 0.6, 0]
        ], "3fv"),
    })
    useLayoutEffect(()=>{
        const canvas = canvasRef.current!;
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        uniforms.current.u_transform.value = getTransMatrix(canvas)
        
        setCanvasReady(true);
    }, [])
    return (
        <ProjectPage
            title="Newton's Fractal Visualizer"
            description={"newton-fractal/description.md"}
        >
            <div className={styles["project-content"]}>
                {canvasReady?<>
                    <NewtonCanvas innerRef={canvasRef} uniforms={uniforms}/>
                    <NewtonSvg innerRef={svgRef} uniforms={uniforms} numRoots={numRoots}/>
                </>:<>
                    <canvas ref={canvasRef}/>
                    <svg ref={svgRef}></svg>
                </>}
                <div className={`${styles["control-container"]} ${!showControls&&styles["control-minimized"]}`}>
                    {showControls&&<Controls uniforms={uniforms} setNumRoots={setNumRoots}/>}
                    <button className={styles["control-min"]} onClick={()=>{
                        setShowControls(prev=>!prev)
                    }}>
                        <i className={`fa-solid fa-lg ${showControls?"fa-x":"fa-gear"}`}/>
                    </button>
                </div>
            </div>
        </ProjectPage>
    )
}