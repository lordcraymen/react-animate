
import { Icon } from './atoms/Icon';
import React, { ClassicComponent, ClassicComponentClass, FunctionComponent, useState, useEffect, ReactNode, Fragment, Children, ReactElement, createRef, ReactChild, useRef, useCallback, useMemo } from "react";
import ReactDOM, { render } from 'react-dom';
import './visual/_global.scss';
import { AddHook } from './helpers/AddHook';
import { LifeCycle } from './helpers/LifeCycle';
import { Destructor } from './helpers/Destructor';
import { DelayRender, DelayRenderClass, DelayRenderClassSpread } from './helpers/DelayRender'
import styles from './App.module.scss';
import { Sortable } from "./helpers/Sortable";
import { Metronome } from "./helpers/Metronome";
import { Animator } from "./helpers/Animator";
import { useMutationObserver } from "./helpers/useMutationObserver";

declare namespace JSX {
  interface IntrinsicElements {
      "td.animation": (props:{children:ReactNode}) => ReactNode
  }
}

const cn = (list:any) => Array.from(list).join(" ");

let me = (timestamp:number) => { console.log("timer1: ", timestamp) };
let mo = me;

const RenderTest = (props: {children:any}) => {

  const [timer, setTimer] = useState(0);

  useEffect(()=> { const interval = setInterval(()=>{ setTimer((time) => time + 1)},200); 
    return () => { clearInterval(interval) }},[]);
  

  return <>{props.children}{timer}</>
}

const PropMaker = (props:any) => {
  const newprops = {...props }; delete newprops.children;
  
  const extendElement = (element:React.ReactElement,props:{}):React.ReactElement | null => {  
    return React.isValidElement(element) ? 
        React.cloneElement(element,{ ...props }) : 
        (String(element) !== "null" ) ? React.createElement("span",{...newprops}, String(element)) : null;
  }

  return React.Children.map(props.children, child => extendElement(child,newprops));
}

const UpdateTest = (props:{ onUpdate?:(element:React.ReactElement) => void, onUnMount?:(element:React.ReactElement) => void, children?:any }):null => {
  useEffect(() => {
    props.onUpdate?.(props.children); 
    return () => { props.onUnMount?.(React.cloneElement(props.children)) }
   }
,[]);
return null
}

const withHocFunction = (element:any) => element; 

const TestComponent = (props:{children:any,visible:boolean}) => { 
  console.log("rerenderd testcomponent");
  const renderContainer = useRef(document.createDocumentFragment() as any);
  const targetContainer = useRef(document.getElementsByTagName("body")[0]);
  const [container, setContainer] = useState(renderContainer);



  useEffect(() => {setContainer(props.visible ? targetContainer : renderContainer)}, [container,props.visible])
  
return <>{ ReactDOM.createPortal(props.children, container.current as any)}</> 
}

type AnimPropMaker = {
  children?:React.ReactNode;
}

type AnimState = {
  isMounting: boolean;
  isLive: boolean;
  isUnMounting: boolean;
  clonedNode: React.ReactElement | null;
}

class AnimationWrapper extends React.Component<AnimPropMaker,AnimState> {
  private clonedNode: any;
  
  constructor(props:any) {
    super(props);
    this.state = { isMounting: false, isLive: false, isUnMounting: false, clonedNode: React.cloneElement((this.props.children as React.ReactElement)) };
    this.renderElement.bind(this);
  }
  
  createReactFromHTMLElement = (element:any):any => {
    const recurse = (element:any):any => {
      if(element.innerHTML == element.innerText) {
        return element.innerText;
      } else return React.createElement(element.nodeName.toLowerCase(),{},[element.innerText]);
    }

    return [Array.from(element).map((child)=>recurse(child))];
  }

  renderElement = (elem:any) => {
    let renderedOutput:NodeList;
    let tempContainer = document.createDocumentFragment();
    
    ReactDOM.render(
      <div ref={ 
            (output:HTMLDivElement) => renderedOutput = output.childNodes
          }>
      { elem }
      </div>
      ,tempContainer,
      () => { 
        this.setState({clonedNode : this.createReactFromHTMLElement(renderedOutput)});
        tempContainer.parentElement?.removeChild(tempContainer);
      } 
    );
  }

  unmount = (elem:any) => {
    console.log("unmounting",elem)
    this.renderElement(elem)
  }

  render() {
    return this.props.children ?
     <>
        { /* This tests the livecyle of the children and updates the state (isMountin, isLive, isunMountin) */}
        <LifeCycle
            onUpdate={ (element) => 
            { this.renderElement(element); 
              this.setState({ isMounting: true, isLive: false, isUnMounting: false}) 
            }}
            onUnMount={ (element) => 
              { this.unmount(element) 
                this.setState({ isMounting: false, isLive: false, isUnMounting: true}) 
              }}
        >
          {this.props.children}
        </LifeCycle>

        {/* child component mounted for the first time and are animated in 
          unless animation is cancled midway by children unmount */
        this.state.isMounting && <>
        <PropMaker className={ styles.fadeIn }>{ this.state.clonedNode }<div>updating</div></PropMaker>
         </>}

        {/* child component is "live" and will be passed through "as is" to parent */
         this.state.isLive &&
         <div>live</div> }

        {/* child component mounted for the first time and are animated in 
          unless animation is cancled midway by children unmount */
         this.state.isUnMounting &&
         <PropMaker className={ styles.fadeIn }>{ this.state.clonedNode }<div>unmounting</div></PropMaker>
        }

      </> : <div>unmounted</div>;
  }
}


type State = {
  isVisible: boolean,
  time: number
}

const CheckProp =(props:{check:string; children:any}) => {
  if(props.children?.[String(props.check)]) { console.log("found!")}
  return props.children;
}


class CachedMap extends React.Component<{},{}> {
  //cache: {[index: string]: React.ReactElement} = {};
  //currentList?:ReactNode
  //myRef:any;
  childCache = new Map();
  currentChildren = new Map();
  renderList:React.ReactChild[] = [];
  shouldrender = false;

  constructor(props:any) {
    super(props);
    
    React.Children.forEach(this.props.children,(child) => { 
        if(React.isValidElement(child) && child.key) { 
          this.childCache.set(child.key,{ original: child, animator: <DelayRender>{child}</DelayRender>})
        }
    });

    this.renderList = Array.from(this.createMap(this.props.children).values());
  }

  createMap(collection:React.ReactNode):Map<string,ReactChild> {
      const childMap = new Map();
      React.Children.forEach(collection,(element) => { 
        if(React.isValidElement(element) && element.key) { 
          childMap.set(element.key,element);
        }
      });
      return childMap;
  }



  componentDidUpdate() {
    this.currentChildren = this.createMap(this.props.children);
    for (var [key, value] of this.currentChildren) {
      //console.log(key,value);
    }
    this.renderList = Array.from(this.createMap(this.props.children).values());
  }

  componentDidMount() {
    this.currentChildren = this.createMap(this.props.children);
    for (var [key, value] of this.currentChildren) {
      //console.log(key,value);
    }
    this.renderList = Array.from(this.createMap(this.props.children).values());
  }

  /*
  renderChildren = (NodeList:React.ReactNode|React.ReactNode[]):React.ReactNode|React.ReactNode[] => {
    React.Children.map(this.props.children,(child:any) => { this.cache[child.key] = <DelayRender key={child.key} beforeMount={1000} beforeUnMount={1000}>{child}</DelayRender>});
    return Object.values(this.childCache);
  }
  */

  render() {
    return <><UpdateTest onUpdate={(element) => {console.log("updated", this.renderList = element as any)}}>{this.props.children}</UpdateTest>{ this.renderList }</>;
  }
}

type childMap = {[index:string]:{[index:string]:any}}

const TestSetState = (props:{children:React.ReactNode}):any => {
  
  const createMap = (collection:React.ReactNode,wrapper?:React.ReactElement):childMap => {
    const childCache:childMap = {} ;
    React.Children.forEach(collection,(element) => { 
      if(React.isValidElement(element) && element.key) { 
        if(wrapper) {
          childCache[element.key] = { original: element, wrapped: React.cloneElement(wrapper,{key:element.key},element) };
        } else {
          childCache[element.key] = { original: element};
        }
      }
    });
    return childCache;
  }

  let me = props.children;

  const [renderCache, setRenderCache] = useState({} as childMap);
  const [renderChildren, setRenderChild] = useState({});

  useEffect(() => { setRenderCache(createMap(props.children,<DelayRender beforeMount={1000} beforeUnMount={1000}>{null}</DelayRender>)) },[]);

  useEffect(
    () => { 
      let currentChildren = createMap(props.children);
      for(let key in renderCache) {
        if(currentChildren[key]) {
          if(renderCache[key] !== currentChildren[key]) {
            let updatedChild = renderCache[key]
            updatedChild["wrapped"] = React.cloneElement(updatedChild["wrapped"],{},[currentChildren[key]]);
          }
        }
      }
      setRenderChild(createMap(props.children));
    },
    [props.children]
  );

  console.log(renderChildren);

  return Object.values(renderChildren);
}

const Saved = (props:{children?:any, show:boolean} = {show:true}) => {
  const saved = useMemo(() => props.children,[]);
  return props.show && saved
}

class App extends React.Component<{},State> {
  private countdown:any;
  constructor(props:any) {
    super(props);
    this.state = {
      isVisible: true,
      time: 0
    };
  }

  toggle = () => {
    this.setState ({
      isVisible: !this.state.isVisible,
    });
  }

  update = () => {
    this.setState ({
      time: this.state.time + 1
    });
  }

  timer = () => {
    this.setState({time: this.state.time+1});
  }

  componentDidMount() {
    //this.countdown = setInterval(this.timer, 60);
  }

  componentWillUnmount() {
    clearInterval(this.countdown);
  }

  filterTagProps = (node:Node) => {
    return { tabIndex: -1 }
  }
  
  render() {
    return (
      <div className="App">
        <h1 className={[styles.testanimation, styles.testanimation2].join(" ")}>
          This is a Demo showing several ways to implement Conditional Rendering in React.
        </h1>
        <button onClick={this.toggle}>Toggle</button>
        <button onClick={this.update}>Change</button>
        <br /> 
        <ul>
          <Animator container="li" className={styles.td}>{ this.state.time }</Animator>
        </ul>
      </div>
    );
  }
}



export default withHocFunction(App);
