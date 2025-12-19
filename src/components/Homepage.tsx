import './components.css'
import Background from './Background'
import Navbar from './Navbar'
import Home from '../sections/home'
import Skills from '../sections/skills'
import Educ from '../sections/educ'
import Work from '../sections/work'
import Contact from '../sections/contact'
import Project from '../sections/projects'

export default function Homepage(){
    return (
        <>
            <Navbar/>
            <Background/>
            <Home/>
            <Skills/>
            <Educ/>
            <Work/>
            <Contact/>
            <Project/>
        </>
    )
}