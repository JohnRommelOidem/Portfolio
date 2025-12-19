import { useEffect, useRef, useLayoutEffect } from "react"
import { getTransMatrix, getDomain } from "./MandelUtils";
import styles from "./Mandelbrot.module.css"
import * as glUtils from "../../webglUtils";
import * as d3 from 'd3';

export default function MandelbrotSvg({innerRef, uniforms, collapse, c_0}:{innerRef:React.RefObject<SVGSVGElement | null>, uniforms:glUtils.UniformRefObject, collapse:string, c_0:number[]}){
    const cursorRef = useRef(null);
    const scales = useRef<{x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>}>({
        x:d3.scaleLinear()
            .domain(getDomain(innerRef.current!, uniforms.current.u_mandelTransform.value as number[], 2.75, [0.75, 0])[0])
            .range([0, innerRef.current!.clientWidth]),
        y:d3.scaleLinear()
            .domain(getDomain(innerRef.current!, uniforms.current.u_mandelTransform.value as number[], 2.75, [0.75, 0])[1])
            .range([innerRef.current!.clientHeight, 0])
    })

    useLayoutEffect(()=>{
        if (!cursorRef.current) return;
        d3.select<SVGGElement, unknown>(cursorRef.current!)
            .attr("transform", ()=>{
                return `translate(${scales.current.x((uniforms.current.u_c0.value as [number, number])[0])}, ${scales.current.y((uniforms.current.u_c0.value as [number, number])[1])})`
            })
    }, [collapse])
    useEffect(()=>{
        if (!cursorRef.current) return;
        const mandelSvg = innerRef.current!;
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
            .data([uniforms.current.u_c0.value as [number, number]])
            .each(function(){
                const group = d3.select(this);
                group.append("circle").attr("class", styles["outer-cursor"])
                group.append("circle").attr("class", styles["cursor-center"])
            })
        .call(drag)
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 2e5])
            .translateExtent([[0, 0], [mandelSvg.clientWidth, mandelSvg.clientHeight]])
            .on("zoom", (e)=>{
                const newTransMatrix = getTransMatrix(mandelSvg, e.transform)
                uniforms.current.u_mandelTransform.value = newTransMatrix
                scales.current.x.domain(getDomain(mandelSvg, newTransMatrix, 2.75, [0.75, 0])[0])
                scales.current.y.domain(getDomain(mandelSvg, newTransMatrix, 2.75, [0.75, 0])[1])
                d3.select<SVGGElement, [number, number]>(cursorRef.current!)
                    .attr("transform", (d)=>{
                        return `translate(${scales.current.x(d[0])}, ${scales.current.y(d[1])})`
                    })
            })
        const svgSelection = d3.select<SVGSVGElement, unknown>(mandelSvg)
        zoom.transform(svgSelection, d3.zoomIdentity)
        svgSelection.call(zoom).on("dblclick.zoom", null)
    }, [collapse, c_0])
    return (
        <svg ref={innerRef}>
            {collapse===""&&<g ref={cursorRef}></g>}
        </svg>
    )
} 