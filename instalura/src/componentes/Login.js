import React, { Component } from "react";
import { browserHistory } from 'react-router-dom';
export default class Login extends Component {


    constructor() {
        super();

        this.state = { msg: "" };

        this.envia = this.envia.bind(this);
    }

    envia(event) {
        event.preventDefault();

        const resquetInfo = {
            method: "Post",
            body: JSON.stringify({ login: this.login.value, senha: this.senha.value }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch("https://instalura-api.herokuapp.com/api/public/login", resquetInfo)
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error("Não foi possível fazer o login");
                }

            })
            .then(token => {
                console.log(token);
                localStorage.setItem("auth-token", token);

                this.props.history.push("/timeline");
            })
            .catch(error => {
                this.setState({ msg: error.message })
            })
    }


    render() {
        return (
            <div className="login-box">
                <h1 className="header-logo">Instalura</h1>
                <span>{this.state.msg}</span>
                <form onSubmit={this.envia}>

                    <input type="text" ref={(input) => this.login = input} />
                    <input type="text" ref={(input) => this.senha = input} />
                    <input type="submit" value="login" />

                </form>
            </div>
        );
    }
}