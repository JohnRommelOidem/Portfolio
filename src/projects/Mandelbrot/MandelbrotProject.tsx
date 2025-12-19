import ProjectPage from "../ProjectPage";
import styles from "./Mandelbrot.module.css"
import MandelbrotCanvas from "./MandelbrotCanvas";
import JuliaCanvas from "./JuliaCanvas";
import MandelbrotSvg from "./MandelbrotSvg";
import JuliaSvg from "./JuliaSvg"
import Controls from "./Controls";
import { useState, useRef, useLayoutEffect } from "react";
import * as glUtils from '../../webglUtils';
import { getTransMatrix } from "./MandelUtils";

export default function MandelbrotProject(){
    const mandelCanvasRef = useRef<HTMLCanvasElement>(null);
    const juliaCanvasRef = useRef<HTMLCanvasElement>(null);
    const mandelSvgRef = useRef<SVGSVGElement>(null);
    const juliaSvgRef = useRef<SVGSVGElement>(null);
    const [z_0, setZ_0] = useState([0, 0]);
    const [c_0, setC_0] = useState([-0.75, 0]);
    const uniforms = useRef<Record<string, glUtils.Uniform>>({
        u_iterations: glUtils.createUniform(500, "1i"),
        u_c0: glUtils.createUniform(c_0, "2f"),
        u_z0: glUtils.createUniform(z_0, "2f"),
        u_power: glUtils.createUniform(2, "1f"),
        u_mandelTransform: glUtils.createUniform([1, 0, 0, 0, 1, 0, 0, 0, 1], "matrix3"),
        u_juliaTransform: glUtils.createUniform([1, 0, 0, 0, 1, 0, 0, 0, 1], "matrix3")
    })
    const [canvasReady, setCanvasReady] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [collapse, setCollapse] = useState("");

    useLayoutEffect(()=>{
        const mandelCanvas = mandelCanvasRef.current!;
        const juliaCanvas = juliaCanvasRef.current!;
        mandelCanvas.width = mandelCanvas.clientWidth;
        mandelCanvas.height = mandelCanvas.clientHeight;

        juliaCanvas.width = juliaCanvas.clientWidth;
        juliaCanvas.height = juliaCanvas.clientHeight;

        const mandelMatrix = getTransMatrix(mandelCanvas);
        const juliaMatrix = getTransMatrix(juliaCanvas);
        uniforms.current.u_mandelTransform = glUtils.createUniform(mandelMatrix, "matrix3");
        uniforms.current.u_juliaTransform = glUtils.createUniform(juliaMatrix, "matrix3");
        setCanvasReady(true)
    }, [collapse])
    return (
        <ProjectPage 
            title="Mandelbrot & Julia Set Visualizer"
            description={"mandelbrot/description.md"}
        >
        <div className={styles["project-content"]}>
          <div id="mandelbrot" className={`${styles["content-half"]} ${styles[collapse]}`}>
            {canvasReady?<>
                <MandelbrotCanvas
                    innerRef={mandelCanvasRef}
                    uniforms={uniforms}
                    collapse={collapse}
                />
                <MandelbrotSvg
                    innerRef={mandelSvgRef}
                    uniforms={uniforms}
                    collapse={collapse}
                    c_0={c_0}
                />
            </>:<><canvas ref={mandelCanvasRef}/><svg ref={mandelSvgRef}></svg></>}
            
          </div>
          <div id="julia" className={`${styles["content-half"]} ${styles[collapse]}`}>
            {canvasReady?<>
                <JuliaCanvas
                    innerRef={juliaCanvasRef}
                    uniforms={uniforms}
                    collapse={collapse}
                />
                <JuliaSvg
                    innerRef={juliaSvgRef}
                    uniforms={uniforms}
                    collapse={collapse}
                    z_0={z_0}
                />
            </>:<><canvas ref={juliaCanvasRef}/><svg ref={juliaSvgRef}></svg></>}
          </div>
          <div className={`${styles["collapse-buttons"]} ${styles[collapse]}`}>
            <button id="julia-btn" onClick={()=>(collapse==="right"?setCollapse(""):setCollapse("left"))}>&lt;</button>
            <button id="mandel-btn" onClick={()=>(collapse==="left"?setCollapse(""):setCollapse("right"))}>&gt;</button>
          </div>
          <div className={`${styles["control-container"]} ${!showControls&&styles["control-minimized"]}`}>
            {showControls&&<Controls uniforms={uniforms} setZ_0={setZ_0} setC_0={setC_0}/>}
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