import React, { Component } from "react";
import PubSub from "pubsub-js";

export default class Header extends Component {

    pesquisa(event){

        event.preventDefault();

        fetch(`https://instalura-api.herokuapp.com/api/public/fotos/${this.loginPesquisa.value}`)
        .then(response => response.json())
        .then(fotos => {
            PubSub.publish("timeline",fotos)
        });
    }


    render() {
        return (
            <header className="header container">
                <h1 className="header-logo">
                    Instalura
                </h1>

                <form className="header-busca" onSubmit={this.pesquisa.bind(this)} >
                    <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.loginPesquisa = input}></input>
                    <input type="submit" value="Buscar" className="header-busca-submit"></input>
                </form>


                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <a href="#">
                                ♡
                  {/* <!--                 ♥-->
                  <!--Quem deu like nas minhas fotos?--> */}
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }
}