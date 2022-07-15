import React from "react";

const useAnimationFrame = (callback:(time:number)=>void) => {
    const requestRef = React.useRef(0);
    const previousTimeRef = React.useRef<any>();
    const runningRef = React.useRef(true);
    
    const animate = (time:number) => {
      if(runningRef.current) {
        if (previousTimeRef.current != undefined) {
          const deltaTime = time - previousTimeRef.current;
          callback(deltaTime)
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
      }
    }
    
    React.useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, []);

    return () => runningRef.current = false;
  }

export { useAnimationFrame }