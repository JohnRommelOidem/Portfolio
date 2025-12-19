import { Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './components/Homepage'
import MandelbrotProject from './projects/Mandelbrot/MandelbrotProject'
import NewtonFractalProject from './projects/Newton\'s Fractal/NewtonProject'

function App() {
    return (
    <>
        <div className="page">
            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/mandel" element={<MandelbrotProject/>}/>
                <Route path="/newton" element={<NewtonFractalProject/>}/>
            </Routes>
        </div>
    </>
    )
}

export default App
