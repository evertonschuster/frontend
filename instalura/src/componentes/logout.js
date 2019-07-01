import React, {Component} from "react";


export default class logout extends Component{

    componentWillMount(){
        localStorage.removeItem("auth-token");
        this.props.history.push("/");
    }

    render(){
        return <div></div>;
    }
}