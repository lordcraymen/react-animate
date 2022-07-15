import React, { CSSProperties } from "react"; 

interface SVGImageProps {
    children?: null;
    url: string;
    width?: string | 0;
    height?: string | 0;
    className?: string;
    style?: CSSProperties;
}
 
const SVGImage = (props: SVGImageProps):JSX.Element | null => {
    const width = props.width;
    const height = props.height ? props.height : props.width;

    return ( 
        props.url ?
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            xlinkHref="http://www.w3.org/1999/xlink"
            width={width}
            height={height}
            className={props.className}
            style={props.style}
        >
            <use xlinkHref={"#"+props.url} />       
        </svg>: null
    );
}

export { SVGImage };