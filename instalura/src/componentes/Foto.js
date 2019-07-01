import React, { Component } from "react";
import { Link } from "react-router-dom";
import PubSub from "pubsub-js"
import { request } from "https";

class FotoHeader extends Component {

    render() {
        return (
            <header className="foto-header">
                <figure className="foto-usuario">
                    <img src={this.props.foto.urlPerfil} alt="foto do usuario"></img>
                    <figcaption className="foto-usuario">
                        <Link to={`/timeline/${this.props.foto.loginUsuario}`}>
                            {this.props.foto.loginUsuario}
                        </Link>
                    </figcaption>
                </figure>
                <time className="foto-data">{this.props.foto.horario}</time>
            </header>
        );
    }
}

class FotoInfo extends Component {

    constructor(props) {
        super(props);
        console.log(this);


        this.state = {
            likers: this.props.foto.likers,
            comentarios: this.props.foto.comentarios
        };
    }

    componentWillMount() {
        PubSub.subscribe("atualiza-liker", function (topico, infoLiker) {

            if (this.props.foto.id === infoLiker.fotoId) {
                const possivelLike = this.state.likers.find(liker => liker.login === infoLiker.liker.login)

                if (possivelLike === undefined) {

                    const novosLikers = this.state.likers.concat(infoLiker.liker);
                    this.setState({ likers: novosLikers });

                } else {

                    const novosLikers = this.state.likers.filter(liker => liker.login !== infoLiker.liker.login);
                    this.setState({ likers: novosLikers });

                }

            }
        }.bind(this))


        PubSub.subscribe("novos-comentarios", function (topico, infoComentario) {
            if (this.props.foto.id === infoComentario.fotoId) {
                const novoComentario = this.state.comentarios.concat(infoComentario.novoComentario);

                this.setState({ comentarios: novoComentario });
            }
        }.bind(this));
    }

    render() {
        return (
            <div className="foto-info">
                <div className="foto-info-likes">
                    {
                        this.state.likers.map(likes => {
                            return (
                                <Link to={`/timeLine/${likes.login}`} key={likes.login}>{likes.login}, </Link>
                            );
                        })
                    }

                    curtiram

                </div>

                <p className="foto-info-legenda">
                    <Link to={`/timeLine/${this.props.foto.loginUsuario}`} className="foto-info-autor">autor </Link>
                    {this.props.foto.comentario}
                </p>

                <ul className="foto-info-comentarios">
                    {
                        this.state.comentarios.map(comentario => {
                            return (
                                <li className="comentario" key={comentario.id}>
                                    <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                                    {comentario.texto}
                                </li>
                            );
                        })
                    }

                </ul>
            </div>
        );
    }
}

class FotoAtualizacoes extends Component {

    constructor(props) {
        super(props);

        this.state = { likeada: this.props.foto.likeada };
    }

    like(event) {
        event.preventDefault();

        fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem("auth-token")}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error("Não foi possivel dar like na foto");
                }
            })
            .then(liker => {
                this.setState({ likeada: !this.state.likeada });

                PubSub.publish("atualiza-liker", { fotoId: this.props.foto.id, liker });
            })
    }

    comenta(event) {
        event.preventDefault();

        const requestInfo = {
            method: "POST",
            body: JSON.stringify({
                texto: this.comentario.value
            }),
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
        fetch(`https://instalura-api.herokuapp.com/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem("auth-token")}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error("Não foi possivel comentar");
                }
            })
            .then(novoComentario => {
                PubSub.publish("novos-comentarios", {
                    fotoId: this.props.foto.id,
                    novoComentario
                })
            })

    }

    render() {
        return (
            <section className="fotoAtualizacoes">
                <a onClick={this.like.bind(this)} className={this.state.likeada ? "fotoAtualizacoes-like-ativo" : "fotoAtualizacoes-like"}>Likar</a>
                <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
                    <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comentario = input}></input>
                    <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit"></input>
                </form>

            </section>
        );
    }
}

export default class FotoItem extends Component {

    render() {
        return (
            <div className="foto">

                <FotoHeader foto={this.props.foto}></FotoHeader>

                <img alt="foto" className="foto-src" src={this.props.foto.urlFoto}></img>

                <FotoInfo foto={this.props.foto} ></FotoInfo>

                <FotoAtualizacoes foto={this.props.foto}></FotoAtualizacoes>

            </div>
        );
    }
}