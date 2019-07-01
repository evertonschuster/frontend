import React, { Component } from "react";
import FotoItem from "./Foto"
import PubSub from "pubsub-js";
import { CSSTransitionGroup } from 'react-transition-group' // ES6


export default class TimeLine extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fotos: []
        };
    }

    carregarFotos(props) {
        let urlPerfil;

        if (props.login === undefined) {
            urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem("auth-token")}`;
        } else {
            urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${props.login}`;
        }

        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => {
                this.setState({ fotos: fotos })
            })
    }

    componentDidMount() {
        this.carregarFotos(this.props);

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.login !== undefined) {
            this.carregarFotos(nextProps);
        }
    }

    componentWillMount() {
        PubSub.subscribe("timeline", (topico, fotos) => {
            this.setState({ fotos: fotos });
        })
    }

    render() {
        return (
            <div className="fotos container">

                {
                    this.state.fotos.map(foto =>

                        <CSSTransitionGroup
                            transitionName="timeline"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={300}>
                            
                            <FotoItem foto={foto} key={foto.id} ></FotoItem>
                        </CSSTransitionGroup>
                    )
                }


            </div>
        )
    }
}