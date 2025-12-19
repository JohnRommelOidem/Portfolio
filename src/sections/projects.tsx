import { Link } from 'react-router-dom'

interface ProjectData {
    name: string;
    description: string;
    tech:string;
    link:string;
    image:string;
}

function ProjectCard({data}:{data:ProjectData}){
    return (
        <Link to={data.link}>
            <div className="card project-card">
                <img src={`/thumbnails/${data.image}.webp`} alt={`${data.name} thumbnail`} />
                <h2>{data.name}</h2>
                <p>{data.description}</p>
                <p className="tech"><strong>Tech:</strong>{data.tech}</p>
            </div>
        </Link>
    )
}

export default function Project(){
    return (
        <section id="projects">
            <h1 className="title">Projects</h1>
            <div className="content">
                <ProjectCard data={{
                    name:"Mandelbrot & Julia Set Visualizer",
                    description:"A GPU-accelerated interactive visualization of fractals from the Mandelbrot and Julia sets.",
                    tech:"React, Typescript, D3, WebGL",
                    link:"/mandel",
                    image:"Mandelbrot"
                }}/>
                <ProjectCard data={{
                    name:"Newton Fractal Visualizer",
                    description:"A GPU-accelerated interactive visualization of fractals from the Mandelbrot and Julia sets.",
                    tech:"React, Typescript, D3, WebGL",
                    link:"/newton",
                    image:"Newton"
                }}/>
            </div>
        </section>
    )
}