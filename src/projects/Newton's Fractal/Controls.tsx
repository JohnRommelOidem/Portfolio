import styles from "./Newton.module.css"
import { useState } from "react"
import { circleComplex } from "./NewtonUtils";
import * as glUtils from "../../webglUtils";
interface SliderData {
    uniform:string,
    min:string,
    max:string,
    step:string,
    func:(()=>void)|((arg0:number)=>void)
}

function SliderRow({label, uniforms, data}:{label:string, uniforms:glUtils.UniformRefObject, data:SliderData}){
    const [localValue, setLocalValue] = useState(uniforms.current[data.uniform].value)
    function handleSliderInput(e:React.ChangeEvent<HTMLInputElement>){
        const newValue = parseFloat(e.target.value)
        uniforms.current[data.uniform].value = newValue
        setLocalValue(newValue)
        data.func(newValue);
    }
    function handleOutput(){
        const clampedValue = Math.min(Number(data.max), Math.max(Number(data.min), Number(localValue)))
        setLocalValue(clampedValue)
        uniforms.current[data.uniform].value = clampedValue
        data.func(clampedValue);
    }
    function handleTypeInput(e:React.ChangeEvent<HTMLInputElement>){
        const newValue = Number(e.target.value)
        if (!isNaN(newValue)) setLocalValue(newValue)
    }

    return(
        <div className={styles["slider-row"]}>
            <div className={styles["slider-label-row"]}>
                <label htmlFor={`slider-${label}`}>{label+":"}</label>
                <input
                    className={styles["slider-input"]} 
                    id={`slider-${label}`}
                    value={localValue as number}
                    onKeyDown={(e)=>{e.key==="Enter" && handleOutput()}}
                    onChange={handleTypeInput}
                    onBlur={handleOutput}
                />
            </div>
            <input
                type="range" 
                className={styles["slider-row-slider"]}
                min={data.min}
                max={data.max}
                step={data.step}
                value={uniforms.current[data.uniform].value as number}
                onChange={handleSliderInput}
            />
        </div>
    )
}

export default function Controls({uniforms, setNumRoots}:{uniforms:glUtils.UniformRefObject, setNumRoots:React.Dispatch<React.SetStateAction<number>>}){
    return (
        <div className={styles["control-content"]}>
            <SliderRow label={"Iterations"} uniforms={uniforms} data={{
                uniform:"u_iterations",
                min:"0",
                max:"100",
                step:"1",
                func:()=>{}
            }}/>
            <SliderRow label={"Roots"} uniforms={uniforms} data={{
                uniform:"u_numRoots",
                min:"2",
                max:"6",
                step:"1",
                func:(numRoot:number)=>{
                    setNumRoots(numRoot)
                    uniforms.current.u_roots.value = Array.from({length:numRoot}, (_, i)=>circleComplex(numRoot, i));
                }
            }}/>
        </div>
    )
}