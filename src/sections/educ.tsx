interface EducData {
    degree: string;
    university: string;
    year: string;
    more: string[];
}

function EducCard({data}:{data:EducData}){
    return (
        <div className="card">
            <h2>{data.degree}</h2>
            <h3>{data.university}</h3>
            <p>{data.year}</p>
            <ul>
                {data.more.map((item, index)=>
                    <li key={index}>{item}</li>
                )}
            </ul>
        </div>
    )
}

export default function Educ(){
    return (
        <section id="education">
            <h1 className="title">Education</h1>
            <div className="content">
                <EducCard data={{
                    degree:"Master of Science in Physics",
                    university:"University of the Philippines Diliman",
                    year:"2022-2024",
                    more:[
                        "GWA: 1.18/1.00",
                        "Excellence in Graduate Studies",
                        "Thesis: Chaos and Escapes of Charged Particles Orbiting Uniformly Magnetized Gravitational Centers"
                    ]
                }}/>
                <EducCard data={{
                    degree:"Bachelor of Science in Physics",
                    university:"University of the Philippines Diliman",
                    year:"2018-2022",
                    more:[
                        "GWA: 1.31/1.00",
                        "Magna Cum Laude",
                        "Thesis: Charged Particle Dynamics Around a Uniformly Magnetized Newtonian Center"
                    ]
                }}/>
            </div>
        </section>
    )
}