import React, { CSSProperties } from "react";
import { SVGImage } from "../SVGImage/SVGImage";
import style from "./Icon.module.scss";
import starIcon from "../../images/icons/star.svg";
import trashIcon from "../../images/icons/trash.svg";

const IconNames = {
    STAR: starIcon.id,
    TRASH: trashIcon.id
}

const Intensities = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH"
}

interface IconProps {
    children?: null;
    iconName: keyof typeof IconNames;
    intensity?: keyof typeof Intensities,
    className?: string;
}
 
const Icon = (props: IconProps): JSX.Element | null => {
    let width, height;
    
    switch(props.intensity){
        case Intensities.HIGH: height = width = "48px"; break;
        case Intensities.LOW: height = width = "24px"; break;
        case Intensities.MEDIUM: 
        default: height = width = "32px"; break;
    }
    
    return (
        props.iconName?
        <SVGImage url={IconNames[props.iconName]} height={height} width={width} className={[style.Icon, props.className].join(' ')}/>
        : null
    );
}

export { Icon };