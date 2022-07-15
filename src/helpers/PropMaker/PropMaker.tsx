import React from "react";

const PropMaker = React.forwardRef((props:any, ref) => {
    const newprops = {...props, ref }; delete newprops.children;
    
    const extendElement = (element:React.ReactElement,props:{}):React.ReactElement | null => {  
      return React.isValidElement(element) ? 
          React.cloneElement(element,{ ...props }) : 
          (String(element) !== "null" ) ? React.createElement("span",{...newprops}, String(element)) : null;
    }
  
    return React.Children.map(props.children, child => extendElement(child,newprops));
  });

  export {PropMaker}