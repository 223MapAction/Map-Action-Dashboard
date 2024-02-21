import React, { Component } from 'react';
import wave from "assets/img/wave.png";
import bg from "assets/img/bg.svg";
import avatar from "assets/img/avatar.svg";
import "assets/css/style.css";

class Register extends Component {
    render() {
        return (
            <React.Fragment>
                <img className="wave" src={wave} />
                <div className="content">
                    <div className="img">
                        <img src={bg} />
                    </div>
                    <div className="login-content">
                        <form>
                            <img src={avatar} />
                            <h2 className="title">Bienvenue</h2>
                            <div className="input-div two">
                                <div className="i">
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="div">
                                    <h5>FullName</h5>
                                    <input type="text" className="input" />
                                </div>
                            </div>
                            <div className="input-div one">
                                <div className="i">
                                    <i className="fas fa-envelope"></i>
                                </div>
                                <div className="div">
                                    <h5>Email</h5>
                                    <input type="text" className="input" />
                                </div>
                            </div>
                            <div className="input-div pass">
                                <div className="i">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="div">
                                    <h5>Password</h5>
                                    <input type="password" className="input" />
                                </div>
                            </div>
                            <div className="input-div pass">
                                <div className="i">
                                    <i className="fas fa-lock"></i>
                                </div>
                                <div className="div">
                                    <h5>Confirm Password</h5>
                                    <input type="password" className="input" />
                                </div>
                            </div>
                            <a href="#">Forgot Password?</a>
                            <a href="#">Pas encore membre <i className="fas fa-hand-point-right fa-lg"></i> S'inscrire ici </a>

                            <input type="submit" className="btn" value="Register" />
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default Register;
