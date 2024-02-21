import React, { Component } from "react";
import "./Login.css";
import axios from 'axios';
import { Redirect } from 'react-router-dom';

// const regexName = RegExp("(([a-zA-Z0-9 ]+){2,10})");

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            user_type:'',
            // confirm_password: '',
            erreur: [],
            visible: false,
            inPogress: false,
            redirect: false,
            succes: false,
            successfully:false,
            message_success:''
            
        }
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
    }

    onChange = (e) => {
        let { name, value } = e.target;
        this.setState({ [name]: value })
    }


    onShowAlert = () => {
        this.setState({ visible: true });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
             inPogress: !this.state.inPogress, succes: false, erreur: [],
            message_success: '', successfully: false,
            })

        // var url = "https://cors-anywhere.herokuapp.com/http://api.sira.diab6582.odns.fr/public/api/register";
        var url ="http://mapaction.withvolkeno.com//api/user";
        const data = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            password: this.state.password,
            email: this.state.email,
            user_type: this.state.user_type,
            // confirm_password: this.state.confirm_password,
        }
        console.log(data);
        axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                "access-control-allow-origin": "*"
            }
        }).then(response => {
            console.log(response);
            let{message_success}=this.state
            message_success ='Inscription avec succés.Veuillez contacter votre l\'administrateur pour l\'activation du votre compte.'
            this.setState({
                inPogress: !this.state.inPogress,
                first_name: '',
                last_name: '',
                password: '',
                email: '',
                user_type: '',             
                redirect: true,
                successfully:true,
                message_success:message_success                
            })
            console.log(response.data);          
        }
        ).catch(error => {
            // console.log(error.message);
            this.setState({
                inPogress: !this.state.inPogress,
                redirect: false,
                succes: true,
            });
            console.log(error.response);
            let { erreur } = this.state;
            if (error.response){
                console.log(error.response.status);
                console.log(error.response.data);
                if (error.response.status === 400) {
                    erreur.push("Veuillez remplir tous les champs");
                    this.setState({ erreur }); 
                } else if (error.response.status === 500 && error.response.data.message!==''){
                    // console.log(error.response.data.message);
                    erreur.push('Ce email existe deja veuillez en choisir un autre ');
                    this.setState({ erreur });
                }else{
                    erreur.push('Problème d\'envoie des données. Veuillez réessayer plus tard');
                    this.setState({ erreur });
                }
            }else if(error.request){
                erreur.push('Problème d\'envoie des données. Veuillez réessayer plus tard');
                this.setState({ erreur });
            }else{
                console.log(error.message);
            }           
            this.onShowAlert();
        });
    }
    render() {                       
        return (
            <div className="auth-wrapper">
                {/* {this.renderRedirect()} */}

                <div className="auth-inner">
                    <form>
                        <h3>Inscription</h3>

                        {this.state.succes &&
                            <div className="alert alert-danger">{this.state.erreur}</div>
                        }
                        {this.state.successfully &&
                            <div className="alert alert-success">{this.state.message_success}</div>
                        }
                        <div className="form-group">
                            <label>Prénom</label>
                            <input
                                type="text"
                                className="form-control"
                                name="first_name"
                                placeholder="First name"
                                onChange={this.onChange} />
                        </div>

                        <div className="form-group">
                            <label>Nom</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last name"
                                name="last_name"
                                onChange={this.onChange} />
                        </div>
                        <div className="form-group">
                            <label>Type Utilisateur:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type de l'utilisateur"
                                name="user_type"
                                onChange={this.onChange} />
                        </div>

                        <div className="form-group">
                            <label>Email address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email"
                                onChange={this.onChange} />
                        </div>

                        <div className="form-group">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                onChange={this.onChange} />
                        </div>
                        {/* <div className="form-group">
                            <label>Confirmer mot de passe</label>
                            <input
                                type="password"
                                name="confirm_password"
                                className="form-control"
                                placeholder="Enter password"
                                onChange={this.onChange} />
                        </div> */}


                        {!this.state.inPogress ?
                            <button
                                className="btn btn-primary btn-block"
                                onClick={this.handleSubmit}>S'inscrire
                            </button>
                            :
                            <button
                                className="btn btn-primary btn-block">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </button>
                        }
                        <p className="forgot-password text-right">
                            Déjà membre <a href="/">Se connecter ?</a>
                        </p>
                    </form>
                </div>
            </div>

        );
    }
}
