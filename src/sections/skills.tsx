function SkillCard({title, children}:{title:string, children:string}){
    return (
        <div className="card skill-card">
            <h2>{title}</h2>
            <p>{children}</p>
        </div>
    )
}

export default function Skills(){
    return (
        <section id="skills">
            <h1 className="title">Skills</h1>
            <div className="content">
                <SkillCard title="Data">
                    SQL, Python(NumPy, Pandas, SciPy, Scikit-learn, Matplotlib, Seaborn)
                </SkillCard>
                <SkillCard title="GPU Programming">
                    Python(numba, numba CUDA), Javascript(WebGL, GPU.js)
                </SkillCard>
                <SkillCard title="Web">
                    HTML, CSS, Javascript, React, D3, Webgl
                </SkillCard>
                <SkillCard title="Research">
                    Numerical Simulations, General Relativity, Chaotic Dynamics, Dynamical System Modeling
                </SkillCard>
                <SkillCard title="Teaching">
                    Classical Mechanics, Electromagnetism, Optics, Special Relativity, Quantum Mechanics, Thermodynamics, Calculus, Linear Algebra, Statistics
                </SkillCard>
                <SkillCard title="Software">
                    Excel, Word, Powerpoint, Google Colab, Mathematica
                </SkillCard>
            </div>
        </section>
    )
}