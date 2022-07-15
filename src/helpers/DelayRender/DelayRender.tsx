import React, { useState, useEffect } from "react";

const DelayRender = (props:{ beforeMount?: number, beforeUnMount?: number, children:React.ReactNode } = { beforeMount:0, beforeUnMount:0, children:null }):any => {

    const [renderChild, setRenderChild] = useState(null as any);
    const [childDisplay, setChildDisplay] = useState(false);
    
    useEffect(
      () => { 
        let timer:any;
        if(props.children) {
          if(!childDisplay) {
            const mountTimer = setTimeout(() => {setChildDisplay(true)},props.beforeMount);
          }
          if(childDisplay) {
            setRenderChild(React.cloneElement(props.children as React.ReactElement)); 
          }
        } else { 
          if(childDisplay) {
            const unmountTimer = setTimeout(() => {setChildDisplay(false)},props.beforeUnMount);
          }
          if(!childDisplay) {
            setRenderChild(null);
          }
        }
        return () => { clearTimeout(timer) };
      },
      [props.children, childDisplay]
    );
    return renderChild;
}

class DelayRenderClass extends React.Component<{beforeMount?: number, beforeUnMount?: number, children:React.ReactNode}> {

    renderChild = null as any;
    childDisplay = false;
    timer:any 

    update = () => {
        if(this.props.children) {
            if(!this.childDisplay) {
              this.timer = setTimeout(() => {this.childDisplay =true },this.props.beforeMount);
            }
            if(this.childDisplay) {
              this.renderChild = React.cloneElement(this.props.children as React.ReactElement); 
            }
        } else { 
            if(this.childDisplay) {
              this.timer = setTimeout(() => {this.childDisplay = false},this.props.beforeUnMount);
            }
            if(!this.childDisplay) {
              this.renderChild = null;
            }
        }
    }

    componentDidMount() {
        this.update()
    }

    componentDidUpdate() {
        this.update();
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        return this.renderChild;
    }

}


class DelayRenderClassSpread extends React.Component {
     render() {
        return React.Children.map(this.props.children,(child) => <DelayRender beforeMount={1500} beforeUnMount={1500} >{child}</DelayRender>)
     }
}

const TestSetState = (props:any) => {
    const [renderChild, setRenderChild] = useState(props.children);

    return renderChild
}


export { DelayRender, DelayRenderClass, DelayRenderClassSpread }