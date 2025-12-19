import { HashLink } from 'react-router-hash-link'
import './components.css'
import { useRef } from 'react';

interface OffsetHashLinkProps extends React.ComponentProps<typeof HashLink>{
    navRef: React.RefObject<HTMLElement|null>;
    to:string;
    children:React.ReactNode;
}

function OffsetHashLink({navRef, to, children}:OffsetHashLinkProps){
    return (
        <HashLink
            to={to}
            scroll ={(el:HTMLElement)=>{
                if (el && navRef.current){
                    window.scrollTo({
                        top:el.offsetTop - navRef.current.offsetHeight,
                        behavior: 'smooth'
                    })
                }
            }}
        >
            <button type="button">{children}</button>
        </HashLink>
    )
}

export default function Navbar(){
    const ref = useRef<HTMLElement>(null);
    return (
        <nav ref={ref} className={'navbar'}>
            <ul className="navbar-links">
                <li><OffsetHashLink navRef={ref} to="#home">Home</OffsetHashLink></li>
                <li><OffsetHashLink navRef={ref} to="#skills">Skills</OffsetHashLink></li>
                <li><OffsetHashLink navRef={ref} to="#education">Education</OffsetHashLink></li>
                <li><OffsetHashLink navRef={ref} to="#work">Work</OffsetHashLink></li>
                <li><OffsetHashLink navRef={ref} to="#contact">Contact</OffsetHashLink></li>
                <li><OffsetHashLink navRef={ref} to="#projects">Projects</OffsetHashLink></li>
            </ul>
        </nav>
    )
}