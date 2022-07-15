import React, { useRef, useEffect } from "react";

const useMutationObserver = (
    targetNode:any, 
    callback:(mutations:MutationRecord[])=>void,
    config?:MutationObserverInit
):()=>void => {

    const observer = useRef(new MutationObserver(callback));

    useEffect(()=> {
        console.log("updated")
        observer.current.observe(targetNode, config);
        return () => { observer.current?.disconnect(); }
    },[targetNode])

    return () => observer.current.disconnect();
}

export { useMutationObserver }
