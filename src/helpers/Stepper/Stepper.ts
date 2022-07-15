const Stepper = (options:{ duration: number, onStart?:() => void, onStep?:(time:number,duration:number)=>void,onEnd?:(time:number) => void}) => {
    let start = 0;
    let animation = 0;
    let running = true;

    const cancel = () => { running = false; }
    
    const step = (timestamp:number) => {
        if(running) { 
            let elapsed = timestamp - start;
  
            if (elapsed < options.duration) {
                options.onStep?.(elapsed, options.duration)
                animation = window.requestAnimationFrame(step);
            } else {
                window.cancelAnimationFrame(animation);
                options.onEnd?.(options.duration);
            }
        } else {
            window.cancelAnimationFrame(animation);
        }
    }

    window.requestAnimationFrame(step);
    options.onStart?.();
    return cancel;
  }

  export { Stepper }