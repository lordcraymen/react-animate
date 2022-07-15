import React, {useState, useEffect} from "react";
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IAddHook {
    onMount?: (props:any) => void
    onUpdate?: (props:any) => void
    onUnMount?: (props:any) => void
    children?: null
}

const AddHook = React.forwardRef((props:IAddHook, ref:any):any  => {
    let isMounting = true;

    useEffect(() => {
        if(isMounting){ props.onMount?.(props); isMounting = false; }
        else { props.onUpdate?.(props); }
        return () => { props.onUnMount?.(props); }
    },[props.children]);
    
    return props.children;
});

//https://stackoverflow.com/questions/54095994/react-useeffect-comparing-objects/54096391#54096391

export { AddHook };