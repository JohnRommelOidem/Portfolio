import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import './ProjectPage.css'
import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';

export default function ProjectPage({title, description, children}: {title:string, description:string, children:React.ReactNode}){
    const [collapsed, setCollapsed] = useState(true);
    const [descriptionText, setDescriptionText] = useState("");
    useEffect(()=>{
        fetch(`markdown/${description}`)
            .then(response=>{
                if (!response.ok){
                    throw new Error(`Failed to load markdown: ${response.status}`)
                }
                return response.text();
            }).then(async (markdownText)=>{
                marked.use(markedKatex())
                const html = await marked.parse(markdownText);
                setDescriptionText(html);
            })
    }, [])
    return (
        <div className="project-page">
            <div className="content-container">
                {children}
            </div>
            <div className="title-container">
                <div className="title-row"><h2 className="project-title">{title}</h2>
                <Link to="/"><button className="back-button"><i className='fa-solid fa-house fa-sm'/></button></Link>
                </div>
                <div className="description-row">
                    <div className={`project-description ${collapsed? "collapsed":""}`} onClick={()=>setCollapsed(()=>false)}>
                        <div className="description-content" dangerouslySetInnerHTML={{__html: descriptionText}}/>
                        {
                            collapsed? 
                            <div className="more-description">...more</div>:
                            <button onClick={(e)=>{
                                e.stopPropagation();
                                setCollapsed(()=>true);
                            }}>Show Less</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}