import React, { Component } from "react";
import "./Login.css";
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
export default class ForgotPW extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            inPogress: false,
            message: [],
            redirect: false,
            visible: false,
            succes: false,
        }
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value })
    }

    onShowAlert = () => {
        this.setState({ visible: true });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/admin/dashboard' />
        }
    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ inPogress: !this.state.inPogress, erreur: false, message: [] })
        // const url = 'login';
        const data = {
            email: this.state.email,
        }
        console.log(data);
        if (data.email === "") {
            let { message } = this.state;
            message.push('Entrez tous les champs');
            this.setState({ message: message, inPogress: false, succes: true });
            this.onShowAlert();

        } else {
            axios.post("http://51.38.32.179:801/api/resetPasswordTransporter", data)
                .then(response => {
                    console.log(response);
                    this.setState({
                        inPogress: !this.state.inPogress,
                        email: '',
                        redirect: true,
                    })
                    // sessionStorage.setItem("token", response.data.token);
                    // sessionStorage.setItem("user_id", response.data.user._id)
                    // sessionStorage.setItem("user", JSON.stringify(response.data.user))
                    let { message } = this.state;
                    message.push('Mot de passe defaut envoyer, Veuillez verifier votre email');
                    this.setState({ message: message, succes: true });
                    this.onShowAlert();
                }).catch(error => {
                    this.setState({
                        inPogress: !this.state.inPogress,
                        succes: true,
                    })
                    console.log(error.message);
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.data);
                    // let { message } = this.state;
                    // if (error.response) {
                    //     console.log(error.response.status);
                    //     console.log(error.response.data);
                    //     var verif = error.response.data;
                    //     if (error.response.status === 401) {
                    //         if (error.response.data.error === "Votre compte est inactif") {
                    //             message.push("Votre compte n'est pas encore activé")
                    //             this.setState({ message });
                    //         } else {
                    //             message.push('Email ou mot de passe invalid');
                    //             this.setState({ message });
                    //         }
                    //     } else if (error.response.status === 422) {
                    //         if (verif.errors.password !== undefined) {
                    //             message.push('Le mot de passe doit contenir au moins 5 caractères.');
                    //             this.setState({ message });
                    //         }
                    //         if (verif.errors.email !== undefined) {
                    //             message.push('L\'email n\'est pas valide');
                    //             this.setState({ message });
                    //         }

                    //     } else if (error.request) {
                    //         message.push('Problème d\'envoie des données. Veuillez réessayer plus tard');
                    //         this.setState({ message });
                    //     } else {
                    //         console.log(error.message);
                    //     }
                    //     this.onShowAlert();
                    // }
                });
        }

    }
    render() {
        return (

            <div className="auth-wrapper">
                {/* {this.renderRedirect()} */}
                <div className="auth-inner">
                    <form>
                        <h3>MAP ACTION</h3>
                        {
                            this.state.succes ? this.state.message.map((message, i) => {
                                return (<div className="alert alert-succes" key={i}>{message}</div>)
                            }) : null
                        }
                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                name="email"
                                onChange={this.onChange} />
                        </div>

                        {!this.state.inPogress ?
                            <button type="submit"
                                className="btn btn-primary btn-block"
                                onClick={this.handleSubmit}>Envoyer
                            </button>
                            :
                            <button
                                className="btn btn-primary btn-block">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </button>
                        }
                        <p className="back">
                            {/* <div className=""> */}
                            <Link className="custom-control-label" to='/'>Retour au page connexion</Link>
                            {/* </div> */}
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}
