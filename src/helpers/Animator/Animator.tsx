import React, { useState, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { Tween } from "../Tween";
import jsxProps from "../jsxProps.min";
import style from "./Animator.module.scss";

const lifecyclestates = {
    MOUNTING: "MOUNTING",
    MOUNTED: "MOUNTING",
    UNMOUNTING: "UNMOUNTING",
    UNMOUNTED: "UNMOUNTED"
}

const getstyleFromCssSelector = (selector:string) => 
  selector.trim() == "" ? {} : Array.from(document.styleSheets).map((styleSheet) => styleSheet.cssRules);

const reactAttributesFromNode = (node:Element):{[index:string]:string | boolean}  => {
    const attributeList:{[index:string]:string | boolean} = {};
    for (let a of node.attributes) {
      attributeList[jsxProps[a.name] || a.name] = (a.value || true);
    }
    return attributeList;  
  }

  const reactNodeFromNodeList = (nodeList:NodeList):React.ReactNode => {  
    return nodeList ? Array.from(nodeList).map((node, i) => {
      if(node.nodeType == 1) {
        const nodeAttributes = reactAttributesFromNode(node as Element);
        return React.createElement(
          node.nodeName.toLowerCase(),
          { ...nodeAttributes, key: "_" + i},
          node.childNodes.length > 0 ? reactNodeFromNodeList(node.childNodes) : null) 
        } else { return node.nodeValue }
      }
    ) : null
  }

const Animator = (props:{container: string, className?:string, children?:any, ref?:any}) =>  {
    
    const {container, children, ...animProps} = {...props};
    const [cachedNode, setCachedNode] = useState<any>();
    const [lifecycleState, setLifeCycleState] = useState<keyof typeof lifecyclestates>("UNMOUNTED");

    const containerRef = useRef<HTMLElement>();

    const animation:{[key:string]:any} = {
      "UNMOUNTED" : {},
      "MOUNTING": { from : { opacity: 0, transform: "translate3d(0,100px,0)"}, duration: 5000, onEnd:() => { console.log(props.className,"mounted"); setLifeCycleState("MOUNTED") }},
      "UNMOUNTING": { to : { opacity: 0, transform: "translate3d(0,100px,0)"}, duration: 5000, onEnd:() => { console.log(props.className,"unmounted"); setLifeCycleState("UNMOUNTED")} } 
    }

    props.className && console.log(props.className, getstyleFromCssSelector(props.className));

    useLayoutEffect(()=>{ 
   
      console.log("container",containerRef.current);
      const updateLifeCycle = () => { 
        console.log("updateLifeCycle", containerRef?.current?.childNodes)
        if(containerRef.current && containerRef.current.childNodes.length > 0) { 
          setCachedNode(reactNodeFromNodeList(containerRef.current.childNodes));
          if(!['MOUNTING', 'MOUNTED'].includes(lifecycleState)) { setLifeCycleState("MOUNTING") };
        } else {
          if(!['UNMOUNTING','UNMOUNTED'].includes(lifecycleState)) { setLifeCycleState("UNMOUNTING") };
        }
      }
  
      const observer = new MutationObserver(updateLifeCycle)
      containerRef.current && observer.observe(containerRef.current,{ childList:true, characterData:true,  subtree: true });
  
      updateLifeCycle();
  
      return () => observer.disconnect();
    },[lifecycleState,containerRef.current]);
    
    
    return (  
    <Tween
      key={lifecycleState} 
      from={animation[lifecycleState].from}
      to={animation[lifecycleState].to} 
      duration={animation[lifecycleState].duration} 
      onEnd={animation[lifecycleState].onEnd}>
      { React.createElement(container,{...animProps, ref: containerRef},children) }
    </Tween>);
}

export { Animator }