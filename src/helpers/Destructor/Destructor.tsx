import React, { ReactNode, useEffect, useState, useRef, useLayoutEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import jsxProps from "./jsxProps.min";
import { Tween } from "../Tween";
import { ProgressPlugin } from "webpack";


const lifecyclestates = {
  MOUNTING: "MOUNTING",
  MOUNTED: "MOUNTING",
  UNMOUNTING: "UNMOUNTING",
  UNMOUNTED: "UNMOUNTED"
} 

const Destructor = (props:{children?: ReactNode, className?:string}) => {
  const [cachedNode, setCachedNode] = useState<any>();
  const [lifecycleState, setLifeCycleState] = useState<keyof typeof lifecyclestates>("UNMOUNTED");
  
  const animation:{[key:string]:any} = {
    "MOUNTING": { from : {opacity: 0, transform:"translate3d(0,100px,0)"}, duration: 5000, onEnd:() => { console.log(props.className,"mounted"); setLifeCycleState("MOUNTED") }},
    "UNMOUNTING": { to : {opacity: 0, transform:"translate3d(0,100px,0)"}, duration: 5000, onEnd:() => { console.log(props.className,"unmounted"); setLifeCycleState("UNMOUNTED")} } 
  }

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

  const renderContainer = useRef(document.createDocumentFragment());

  useLayoutEffect(()=>{ 
   
    const updateLifeCycle = () => { 
      if(renderContainer.current.childNodes.length > 0) { 
        setCachedNode(reactNodeFromNodeList(renderContainer.current.childNodes));
        if(!['MOUNTING', 'MOUNTED'].includes(lifecycleState)) { setLifeCycleState("MOUNTING") };
      } else {
        if(!['UNMOUNTING','UNMOUNTED'].includes(lifecycleState)) { setLifeCycleState("UNMOUNTING") };
      }
    }

    const observer = new MutationObserver(updateLifeCycle)
    observer.observe(renderContainer.current,{ childList:true, characterData:true,  subtree: true });

    updateLifeCycle();

    return () => observer.disconnect();
  },[lifecycleState,renderContainer.current]);

  const [content,setContent] = useState<typeof props.children>();
  useEffect(()=> { const MemoizedComponent = (props:{children:any}) => props.children;
  const Memo = React.memo(MemoizedComponent); 
  setContent(<Memo>{props.children}</Memo>)},[props.children]);


  

  return <>{ReactDOM.createPortal(content, renderContainer.current as any)}
       {['MOUNTING', 'UNMOUNTING'].includes(lifecycleState) ? 
          <Tween
            key={lifecycleState} 
            from={animation[lifecycleState].from} 
            to={animation[lifecycleState].to} 
            duration={animation[lifecycleState].duration} 
            onEnd={animation[lifecycleState].onEnd}>
              {cachedNode}
          </Tween> : 
          lifecycleState == "MOUNTED" ? content : null}</>
        ;
};

export { Destructor }