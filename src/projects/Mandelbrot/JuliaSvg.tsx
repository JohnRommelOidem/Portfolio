import { useEffect, useRef, useLayoutEffect } from "react"
import { getTransMatrix, getDomain } from "./MandelUtils";
import styles from "./Mandelbrot.module.css"
import * as glUtils from "../../webglUtils";
import * as d3 from 'd3';

export default function JuliaSvg({innerRef, uniforms, collapse, z_0}:{innerRef:React.RefObject<SVGSVGElement | null>, uniforms:glUtils.UniformRefObject, collapse:string, z_0:number[]}){
    const cursorRef = useRef(null);
    const scales = useRef<{x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>}>({
        x:d3.scaleLinear()
            .domain(getDomain(innerRef.current!, uniforms.current.u_juliaTransform.value as number[], 3.5, [0, 0])[0])
            .range([0, innerRef.current!.clientWidth]),
        y:d3.scaleLinear()
            .domain(getDomain(innerRef.current!, uniforms.current.u_juliaTransform.value as number[], 3.5, [0, 0])[1])
            .range([innerRef.current!.clientHeight, 0])
    })
    useLayoutEffect(()=>{
        if (!cursorRef.current) return;
        d3.select<SVGGElement, unknown>(cursorRef.current)
            .attr("transform", ()=>{
                return `translate(${scales.current.x((uniforms.current.u_z0.value as [number, number])[0])}, ${scales.current.y((uniforms.current.u_z0.value as [number, number])[1])})`
            })
    }, [collapse])
    useEffect(()=>{
        if (!cursorRef.current) return;
        const juliaSvg = innerRef.current!;
        
        const drag = d3.drag<SVGGElement, [number, number]>().on("drag", function(e, d){
            const x = e.x
            const y = e.y
            d[0] = scales.current.x.invert(x)
            d[1] = scales.current.y.invert(y)
            d3.select(this)
                .attr("transform", ()=>{
                    return `translate(${x}, ${y})`
                })
        })
        d3.select<SVGGElement, [number, number]>(cursorRef.current!)
            .each(function(){
                const group = d3.select(this);
                group.append("circle").attr("class", styles["outer-cursor"])
                group.append("circle").attr("class", styles["cursor-center"])
            })
            .data([uniforms.current.u_z0.value as [number, number]]).call(drag)
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 2e5])
            .translateExtent([[0, 0], [juliaSvg.clientWidth, juliaSvg.clientHeight]])
            .on("zoom", (e)=>{
                const newTransMatrix = getTransMatrix(juliaSvg, e.transform);
                uniforms.current.u_juliaTransform.value = newTransMatrix
                scales.current.x.domain(getDomain(juliaSvg, newTransMatrix, 3.5, [0, 0])[0])
                scales.current.y.domain(getDomain(juliaSvg, newTransMatrix, 3.5, [0, 0])[1])
                if (cursorRef.current != null){
                    d3.select<SVGGElement, [number, number]>(cursorRef.current)
                        .attr("transform", (d)=>{
                            return `translate(${scales.current.x(d[0])}, ${scales.current.y(d[1])})`
                        })
                }
            })
        const svgSelection = d3.select<SVGSVGElement, unknown>(juliaSvg)
        zoom.transform(svgSelection, d3.zoomIdentity)
        svgSelection.call(zoom).on("dblclick.zoom", null)
    }, [collapse, z_0])
    return (
        <svg ref={innerRef}>
            {collapse===""&&<g ref={cursorRef}></g>}
        </svg>
    )
} 