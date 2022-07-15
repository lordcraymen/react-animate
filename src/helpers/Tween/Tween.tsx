import React, { ReactElement, useEffect, useLayoutEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import { objectToCssString } from "../cssTools";
import { useAnimationFrame } from "../useAnimationFrame";

const Tween = (props:{children?: ReactElement, className?:string, duration: number, from?:CSS, to:CSS, onStart?:()=>void, onEnd?:()=>void}) => {
    
    const [offset,setOffset] = useState(0);
    const animID = useRef(Math.floor(Math.random()*1000000));

    const nodeRef = useRef();

    useLayoutEffect(()=>{ 
        let test = window.getComputedStyle(nodeRef.current as any); 
        console.log("useLayout", nodeRef.current, test.getPropertyValue('color')); 
    },[])

    const stopAnimation = useAnimationFrame((delta)=> setOffset((time) => { 
            const newtime = time + delta;
            if (newtime >= props.duration) { stopAnimation(); return props.duration }
            return newtime;
    }));

    useEffect(()=>{ if(offset == props.duration) props.onEnd?.() },[offset]);

    const animClassName = props.className ? props.className : "testanimation_" + animID.current;

    const animationCSS = 
    <>
    <>
        {"."+animClassName} 
        {"{"} animation-name: {animClassName + "_anim;"}
            animation-play-state: paused; 
            animation-fill-mode: forwards; 
            animation-duration: {+props.duration+"ms;"} 
            transform-origin:0 0; {"}"}
    </>
        <>
            {"@keyframes " +animClassName + "_anim"} {"{"} from {"{"} {objectToCssString(props.from)} {"}"} to {"{"} {objectToCssString(props.to)} {"}}"} 
        </>
    </>
    
    return <>{ ReactDOM.createPortal(
        <><style key={animID.current}>{ animationCSS }</style>
        <style key={animID.current+"_anim"}><>{`.${animClassName}`}</> <>{`{animation-delay:${-offset}ms}`}</></style></>,
        document.getElementsByTagName("head")[0]
      )}{React.Children.map(props.children,(child) => React.cloneElement(child as ReactElement,{ref: nodeRef, className: child?.props.className + " " +animClassName}))}</>
}

export { Tween }