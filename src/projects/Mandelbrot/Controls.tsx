import styles from "./Mandelbrot.module.css"
import { useState } from "react"
import * as glUtils from "../../webglUtils";

interface SliderData {
    uniform:string,
    min:string,
    max:string,
    step:string
}

function SliderRow({label, uniforms, data}:{label:string, uniforms:glUtils.UniformRefObject, data:SliderData}){
    const [localValue, setLocalValue] = useState(uniforms.current[data.uniform].value)
    function handleSliderInput(e:React.ChangeEvent<HTMLInputElement>){
        const newValue = parseFloat(e.target.value)
        uniforms.current[data.uniform].value = newValue
        setLocalValue(newValue)
    }
    function handleOutput(){
        const clampedValue = Math.min(Number(data.max), Math.max(Number(data.min), Number(localValue)))
        setLocalValue(clampedValue)
        uniforms.current[data.uniform].value = clampedValue
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

function ButtonRow({label, func}:{label:string,func:()=>void}){
    return(
        <button onClick={func} className={styles["button-row"]}>{label}</button>
    )
}

export default function Controls({uniforms, setZ_0, setC_0}:{uniforms:glUtils.UniformRefObject, setZ_0:React.Dispatch<React.SetStateAction<number[]>>, setC_0:React.Dispatch<React.SetStateAction<number[]>>}){
    return (
        <div className={styles["control-content"]}>
            <SliderRow label={"Iterations"} uniforms={uniforms} data={{
                uniform:"u_iterations",
                min:"5",
                max:"2000",
                step:"1"
            }}/>
            <ButtonRow
                label={"Reset"}
                func={()=>{
                    const defaultZ_0 = [0, 0]
                    const defaultC_0 = [-0.75, 0]
                    uniforms.current.u_z0.value = defaultZ_0;
                    setZ_0(defaultZ_0)
                    uniforms.current.u_c0.value = defaultC_0;
                    setC_0(defaultC_0)
                }}
            />
        </div>
    )
}