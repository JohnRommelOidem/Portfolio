interface WorkData {
    title: string;
    company: string;
    year: string;
    more: string[];
}


function WorkCard({data}:{data:WorkData}){
    return (
        <div className="card">
            <h2>{data.title}</h2>
            <h3>{data.company}</h3>
            <p>{data.year}</p>
            <ul>
                {data.more.map((item, index)=>
                    <li key={index}>{item}</li>
                )}
            </ul>
        </div>
    )
}

export default function Work(){
    return (
        <section id="work">
            <h1 className="title">Work</h1>
            <div className="content">
                <WorkCard data={{
                    title:"Graduate Researcher",
                    company:"University of the Philippines Diliman, National Institute of Physics",
                    year:"2022-2024",
                    more:[
                        "Part of the GANAP research group, under the Gravity Subgroup.",
                        "Worked on Dynamical Systems Modeling and Chaotic Dynamics for a Relativistic system.",
                        "Developed and optimized numerical simulations in Python improved by Numba JIT-compilation and GPU-accelerated parallel programming with CUDA.",
                        "Presented findings with the use of matplotlib, LaTeX, and Manim."
                    ]
                }}/>
                <WorkCard data={{
                    title:"Teaching Associate",
                    company:"University of the Philippines Diliman, National Institute of Physics",
                    year:"2022-2024",
                    more:[
                        "Lectured undergraduate Physics (Newtonian Mechanics, Electromagnetism, Optics, Special Relativity, Quantum Mechanics, and Thermodynamics).",
                        "Supervised physics laboratory classes on circuits, magnetism and optics, integrating data processing, analysis and visualization.",
                        "Co-developed several exams and analytical methods for student grade processing pipelines. Developing algorithms to provide students with grade projections."
                    ]
                }}/>
            </div>
        </section>
    )
}