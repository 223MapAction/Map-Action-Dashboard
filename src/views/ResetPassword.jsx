import React, { Component } from "react";
import {
  Grid,
  Col,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Form,
  ControlLabel,
  FormControl,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "assets/css/global.css";
import Background from "assets/img/map-bg-1.jpg";
import logo from "assets/logo.png";
import swal from "sweetalert";

var sectionStyle = {
  backgroundImage: `url(${Background})`,
  backgroundSize: "cover",
};

export default class resetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailpwd: "",
      isValidForm: "",
      email_empty: false,
      password_empty: false,
      isPending: false,
      isRequestError: false,
      errors: {},
      inProgress: false,
      showPwdModal: false,
      changepwd: false,
      url_reset: global.config.url + "api/request-password-reset/",
      show_reset: "/request-password",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  handleShowPwdModal = () => {
    this.setState((prevState) => {
      return { showPwdModal: !prevState.showPwdModal };
    });
  };

  handleModalOpen = (e) => {
    e.preventDefault();
    this.setState({ changepwd: true });
  };

  handleShowPwdModal = (e) => {
    e.preventDefault();
    this.setState({ changepwd: false });
  };
  handleChangePassword = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    if (this.state.confirm_pwd !== this.state.new_password) {
      swal("erreur", "les 2 mots de pass doivent etre identiques", "error");
    } else {
      const new_pwd = {
        old_password: this.state.old_password,
        new_password: this.state.new_password,
      };
      var url = global.config.url + "api/changepassword/";
      // var url = global.config.url+'api/user/'+this.state.user.id+'/';
      console.log(new_pwd);
      console.log(sessionStorage.token);
      axios
        .put(url, new_pwd, {
          headers: { Authorization: `Bearer ${sessionStorage.token}` },
        })
        .then((response) => {
          console.log(response);
          swal("Succes", " Mot de passe modifié avec succès", "success");
          this.setState({ inProgress: false, changepwd: false });
          this.setState({
            old_password: "",
            new_password: "",
            confirm_pwd: "",
          });
          this.props.history.push("/elu/dashboard");
        })
        .catch((error) => {
          this.setState({ inProgress: false });
          this.setState({ changepwd: false });
          this.setState({
            old_password: "",
            new_password: "",
          });
          if (error.response) {
            console.log(error.response.status);
            if (error.response.data.old_password) {
              swal("Erreur", error.response.data.old_password[0], "error");
            } else {
              swal("Erreur", "Veuillez reessayer", "error");
            }
          } else if (error.request) {
            console.log(error.request.data);
            swal("erreur", "Veuillez reessayer", "error");
          } else {
            swal("erreur", "Veuillez reessayer", "error");
            console.log(error.message);
          }
        });
    }
  };
  validateLoginForm() {
    let email = this.state.email;
    let isValidForm = true;
    let errors = {};

    if (!email) {
      this.setState({
        isPending: false,
      });
      isValidForm = false;
      this.state.email_empty = true;
      this.handleShowAndHideAlert("email");
      errors["email"] = "Le champ email est obligatoire";
    }

    this.setState({
      errors: errors,
    });
    return isValidForm;
  }

  handleShowAndHideAlert(input) {
    setTimeout(() => {
      if (input == "credential_error") {
        this.setState({
          isValidUser: true,
        });
      }
      if (input == "email") {
        this.setState({
          email_empty: false,
        });
      }
      if (input == "password") {
        this.setState({
          password_empty: false,
        });
      }
      if (input == "requestError") {
        this.setState({
          isRequestError: false,
        });
      }
    }, 5000);
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.validateLoginForm()) {
      this.setState({
        isPending: false,
        inProgress: true,
      });
    }


    var data = new FormData()
    data.append('email', this.state.email)

    axios
      .post(global.config.url + "api/request-password-reset/", data, {
        headers: {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      })
      .then((response) => {
        this.setState({
          isPending: true,
          inProgress: false,
        });
        console.log(response.data);

        if (response.data.status == "success") {
          swal("Succes", " Veillez utiliser le code envoyer par email pour réinitialiser votre mot de pas .", "success");
        }

        window.location = "/request-password-view";

      })
      .catch((err) => {
        this.setState({
          isPending: true,
          inProgress: false,
        });
        swal(
          "Erreur",
          "Email incorrect! Veuillez reessayer",
          "error"
        );
        console.log(err);
      });
  }

  onSend(e) {
    e.preventDefault();
    this.setState({
      inProgress: true,
    });
    let email = this.state.emailpwd;
    if (email) {
      axios
        .post(global.config.url + "api/password_reset/", email, {
          headers: {
            credentials: "include",
            method: "POST",
            headers: { "Content-Type": "application/json" },
          },
        })
        .then((response) => {
          this.setState({
            inProgress: false,
          });
          console.log(response);
        })
        .catch((err) => {
          this.setState({
            isPending: true,
            inProgress: false,
          });
        });
    }
  }

  render() {
    let changePassword = (
      <Modal show={this.state.changepwd} onHide={this.handleShowPwdModal}>
        <ModalHeader closeButton>
          Veuillez changer votre mot de passe avant de continuer
        </ModalHeader>
        <Form encType="multipart/form-data">
          <ModalBody className="col-sm-12">
            <div className="row">
              <div className="form-group col-md-8">
                <label>Mot de passe</label>
                <input
                  type="password"
                  name="old_password"
                  className="form-control"
                  placeholder="Password"
                  value={this.state.old_password}
                  onChange={(e) => {
                    this.setState({ old_password: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-8">
                <label>Nouveau Mot de passe</label>
                <input
                  type="password"
                  name="new_password"
                  className="form-control"
                  placeholder="New password"
                  value={this.state.new_password}
                  onChange={(e) => {
                    this.setState({ new_password: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-8">
                <label>Confirmation Mot de passe</label>
                <input
                  type="password"
                  name="confirm_password"
                  className="form-control"
                  placeholder="Confirm password"
                  value={this.state.confirm_pwd}
                  onChange={(e) => {
                    this.setState({ confirm_pwd: e.target.value });
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button
                className="btn btn-primary"
                onClick={this.handleChangePassword}
              >
                Modifier
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{" "}
            <Button
              className="btn btn-danger"
              onClick={this.handleShowPwdModal}
            >
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
    return (
      <div className="auth-wrapper" style={sectionStyle}>
        {changePassword}
        {/* Modal */}
        <div className="modal fade">
          <Modal
            show={this.state.showPwdModal}
            onHide={this.handleShowPwdModal}
          >
            <ModalHeader closeButton className="map-color t-center">
              <div className="row">
                <div className="col-md-7">Mot de Passe oublié</div>
              </div>
            </ModalHeader>

            <ModalBody className="col-sm-12">
              <form
                noValidate
                onSubmit={(e) => this.onSend(e)}
                className="map-color"
              >
                <div className="form-group">
                  <label htmlFor="email"> Adresse Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailpwd"
                    placeholder="Entrez votre email"
                    value={this.state.emailpwd}
                    onChange={this.onChange}
                  />
                </div>
                {!this.state.inProgress ? (
                  <button className="btn button--round-l button--text-thick ">
                    Envoyer
                  </button>
                ) : (
                  <Button className="btn">
                    Loading...
                    <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                  </Button>
                )}
              </form>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
        </div>
        {/* {this.renderRedirect()} */}
        <div className="auth-inner">
          <form
            noValidate
            onSubmit={(e) => this.onSubmit(e)}
            className="map-color"
          >
            <h3>
              <img className="logo-front" src={logo}></img>
            </h3>
            {this.state.succes
              ? this.state.message.map((erreur, i) => {
                return (
                  <div className="alert alert-danger" key={i}>
                    {erreur}
                  </div>
                );
              })
              : null}
            <div className="form-group">
              <label htmlFor="email"> Adresse Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Entrez votre email"
                value={this.state.email}
                onChange={this.onChange}
              />
            </div>
            {this.state.email_empty && (
              <div className="errorMsg">{this.state.errors.email}</div>
            )}



            {this.state.email_empty && (
              <div className="errorMsg">{this.state.errors.password}</div>
            )}
            {!this.state.inProgress ? (
              <button className="button  button--round-l button--text-thick button--text-upper">
                Envoyer
              </button>
            ) : (
              <Button className="button  button--round-l button--text-thick button--text-upper">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}

            <a href="/">
              Se connecter
            </a>

          </form>
        </div>
      </div>
    );
  }
}
