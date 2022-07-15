import React from "react";
import ReactDOM from 'react-dom';

interface IWrapper {
    ref?:any;
    //children?: any;
}

class Wrapper extends React.Component<IWrapper> {
    render() {
        return this.props.children
    }
}

interface ILifeCycleProps {
    onMount?: (childComponent:React.ReactNode| null) => void
    onUpdate?: (childComponent:React.ReactNode|null) => void
    onUnMount?: (childComponent:React.ReactNode| null) => void
    children: React.ReactNode;
}

class LifeCycle extends React.Component<ILifeCycleProps> {

    private onMount = (childComponent:React.ReactNode| null) => {}
    private onUpdate = (childComponent:React.ReactNode|null) => {}
    private onUnMount = (childComponent:React.ReactNode|null) => {}

    constructor(props:ILifeCycleProps){
        super(props);
        if(props.onMount) this.onMount = props.onMount.bind(this);
        if(props.onUpdate) this.onUpdate = props.onUpdate.bind(this);
        if(props.onUnMount) this.onUnMount = props.onUnMount.bind(this);
    }

    componentDidMount() {
        this.onMount(React.cloneElement((this.props.children as React.ReactElement)));
    }

    componentDidUpdate() {
        this.onUpdate(React.cloneElement((this.props.children as React.ReactElement)));
    }

    componentWillUnmount() {
        this.onUnMount(React.cloneElement((this.props.children as React.ReactElement)));
    }

     render() {
        return null;
    }
}


export { LifeCycle }