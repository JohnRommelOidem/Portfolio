import * as glUtils from "../../webglUtils";
import { useRef, useEffect } from "react";
import { getTransMatrix, getDomain } from "./NewtonUtils";
import * as d3 from 'd3';
import styles from "./Newton.module.css"

export default function NewtonSvg({innerRef, uniforms, numRoots}:{innerRef:React.RefObject<SVGSVGElement | null>, uniforms:React.RefObject<Record<string, glUtils.Uniform>>, numRoots:number}){
    const cursorRef = useRef(null);
    const scales = useRef<{x: d3.ScaleLinear<number, number>, y: d3.ScaleLinear<number, number>}>({
        x:d3.scaleLinear()
            .domain(getDomain(innerRef.current!, uniforms.current.u_transform.value as number[], 3, [0, 0])[0])
            .range([0, innerRef.current!.clientWidth]),
        y:d3.scaleLinear()
            .domain(getDomain(innerRef.current!, uniforms.current.u_transform.value as number[], 3, [0, 0])[1])
            .range([innerRef.current!.clientHeight, 0])
    })
    useEffect(()=>{
        const svg = innerRef.current!;
        const cursorSelection = d3.select<SVGGElement, unknown>(cursorRef.current!)
        const colors = [
            "#ff0000",
            "#00f000",
            "#0000ff",
            "#ff00ff",
            "#ffff00",
            "#ffa000"
        ]
        cursorSelection.selectAll<SVGGElement, [number, number]>("g.cursor-group")
            .data(uniforms.current.u_roots.value as number[][], (_, i)=>i)
            .join("g")
            .attr("class", "cursor-group")
            .each(function(){
                const group = d3.select(this);
                group.append("circle").attr("class", styles["outer-cursor"])
                group.append("circle").attr("class", styles["cursor-center"])
            })
            .attr("transform", (d)=>{
                return `translate(${scales.current.x(d[0])}, ${scales.current.y(d[1])})`
            })
            .attr("fill", (_, i)=>{
                return colors[i]
            })
        const drag = d3.drag<SVGGElement, [number, number]>().on("drag", function(e, d){
            const x = e.x
            const y = e.y
            d[0] = scales.current.x.invert(x)
            d[1] = scales.current.y.invert(y)
            d3.select<SVGGElement, [number, number]>(this)
                .attr("transform", (d)=>{
                    return `translate(${scales.current.x(d[0])}, ${scales.current.y(d[1])})`
                })
                .raise();
        }).on("start", function(){
            d3.select(this).raise();
        })
        cursorSelection.selectAll<SVGGElement, [number, number]>("g.cursor-group").call(drag);

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([-Infinity, 1e2])
            .on("zoom", (e)=>{
                const newTransMatrix = getTransMatrix(svg, e.transform)
                uniforms.current.u_transform.value = newTransMatrix
                scales.current.x.domain(getDomain(svg, newTransMatrix, 3, [0, 0])[0])
                scales.current.y.domain(getDomain(svg, newTransMatrix, 3, [0, 0])[1])
                if (cursorRef.current != null){
                    cursorSelection
                        .selectAll<SVGGElement, [number, number]>("g.cursor-group")
                        .attr("transform", (d)=>{
                            return `translate(${scales.current.x(d[0])}, ${scales.current.y(d[1])})`
                        })
                }
            })
        const svgSelection = d3.select<SVGSVGElement, unknown>(svg)
        zoom.transform(svgSelection, d3.zoomIdentity)
        svgSelection.call(zoom).on("dblclick.zoom", null)
    }, [numRoots])
    return(
        <svg ref={innerRef}>
            <g ref={cursorRef} className={styles["cursor-layer"]}>
            </g>
        </svg>
    )
}