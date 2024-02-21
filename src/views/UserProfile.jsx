/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "react-bootstrap";
import swal from "sweetalert";
import { btnStyle } from "variables/Variables.jsx";
import axios from "axios";
import { Card } from "components/Card/Card.jsx";
// import { FormInputs } from "components/FormInputs/FormInputs.jsx";
// import { UserCard } from "components/UserCard/UserCard.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import Select from "react-select";

import avatar from "assets/img/faces/face-0.jpg";
import UserCard from "components/UserCard/UserCard";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      //  newUser:{
      //   first_name:'',
      //   last_name: '',
      //   email: '',
      //   phone: '',
      //   adress: '',
      //   user_type: '',
      //  },
      inProgress: false,
      changepwd: false,
      old_password: "",
      new_password: "",
      confirm_pwd: "",
      zones: [],
    };
    this.handleModalOpen = this.handleModalOpen.bind(this);
  }

  componentDidMount = () => {
    this.getUser()
    this._getZones()
  }

  getUser = async () => {
    // const url = global.config.url + 'api/me/'
    const url = global.config.url + '/MapApi/me/'

    const config = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    }

    await axios
      .get(url, config)
      .then((user) => {
        console.log('user', user)
        this.setState({ user: user.data.data })
      })
      .catch((e) => {
        console.log('e', e)
      })
  }

  onUpdateUser = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    console.log(this.state.user);
    const new_data = {
      first_name: this.state.user.first_name,
      last_name: this.state.user.last_name,
      email: this.state.user.email,
      phone: this.state.user.phone,
      adress: this.state.user.adress,
      user_type: this.state.user.user_type,
      zones: this.state.user.zones,
      // password: this.state.user.password,
    };

    // var url = global.config.url + "api/user/" + this.state.user.id + "/";
    var url = global.config.url + "/MapApi/user/" + this.state.user.id + "/";
    console.log(new_data);
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response.data);
        console.log(this.state.user);
        this.setState({
          inProgress: !this.state.inProgress,
        });
        sessionStorage.setItem("user", JSON.stringify(response.data));

        swal(
          "Succès",
          "Utilisateur mis à jour avec succès. Vos modifications seront prises en compte lors de la prochaine connexion",
          "success"
        );
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal("Erreur Ajout", "Veuillez reessayer", "error");
          console.log(error.response.status);
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request.data);
          swal("erreur", "Veuillez reessayer", "error");
        } else {
          swal("erreur", "Veuillez reessayer", "error");
          console.log(error.message);
        }
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
      // var url = global.config.url + "api/changepassword/";
      var url = global.config.url + "/MapApi/change_password/";
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

  _getZones = async () => {
    // var url = global.config.url + "api/zone/";
    var url = global.config.url + "/MapApi/zone/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("zones=>", res.data);
      let data = res.data["results"];
      console.log(data);
      this.setState({ zones: data });
    } catch (error) {
      console.log(error.message);
    }
  };

  onSelectChange = (e, choice) => {
    // console.log("test=>", choice);
    let { user } = this.state;
    if (choice.action === "select-option") {
      let index = user.zones.findIndex((f) => f === choice.option.id);
      // console.log("index=>", index);
      // console.log("int", String(choice.option.id));
      if (index === -1) {
        user.zones.push(String(choice.option.id));
      }
    }
    if (choice.action === 'remove-value') {
      // console.log("choice=>", user.zones,  choice.removedValue.id);
      let index = user.zones.findIndex(
        (f) => parseInt(f) === choice.removedValue.id,
      )
      if (index !== -1) {
        user.zones.splice(index)
      }
      // console.log("choice=>", user.zones);
    }
    if (choice.action === "clear") {
      //console.log('choice=>')
      user.zones = [];
    }
    // console.log('user.zones=>', user['zones'])
    this.setState({ user })
  }

  render() {
    const optionsZone = this.state.zones.map(function (zone) {
      return {
        value: zone.id,
        label: zone.name,
        key: zone.id + "unique-key",
        id: zone.id,
      };
    });

    let filterData = []
    if (this.state.user && this.state.user.zones !== undefined) {
      if (this.state.user.zones.length && optionsZone.length) {
        for (let i = 0; i < optionsZone.length; i++) {
          const element = optionsZone[i]
          for (let j = 0; j < this.state.user.zones.length; j++) {
            const elt = this.state.user.zones[j]
            // console.log(elt, element)
            if (parseInt(elt) === parseInt(element.value)) {
              filterData.push(element)
            }
          }
        }
      }
    }

    let changePassword = (
      <Modal show={this.state.changepwd} onHide={this.handleShowPwdModal}>
        <ModalHeader closeButton>Modifer Mot de passe</ModalHeader>
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
    )
    // console.log('filter', filterData)
    return (
      <div className="content">
        {changePassword}
        <Grid fluid>
          <Row>
            <Col md={8}>
              <Card
                title="Modifier Profil"
                content={
                  <Form>
                    <FormGroup className="col-sm-6">
                      <label htmlFor="prenom">Prenom:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={this.state.user.first_name}
                        onChange={(e) => {
                          let { user } = this.state;
                          user.first_name = e.target.value;
                          this.setState({ user });
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="col-sm-3">
                      <label htmlFor="long">Nom:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="long"
                        name="last_name"
                        value={this.state.user.last_name}
                        onChange={(e) => {
                          let { user } = this.state;
                          user.last_name = e.target.value;
                          this.setState({ user });
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="col-sm-3">
                      <label>Adresse Email:</label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        value={this.state.user.email}
                        onChange={(e) => {
                          let { user } = this.state;
                          user.email = e.target.value;
                          this.setState({ user });
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                      <label htmlFor="long">Adresse:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="long"
                        name="email"
                        value={this.state.user.adress}
                        onChange={(e) => {
                          let { user } = this.state;
                          user.adress = e.target.value;
                          this.setState({ user });
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="col-sm-6">
                      <label htmlFor="long">Telephone:</label>
                      <input
                        className="form-control"
                        type="text"
                        id="long"
                        name="email"
                        value={this.state.user.phone}
                        onChange={(e) => {
                          let { user } = this.state;
                          user.phone = e.target.value;
                          this.setState({ user });
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="col-sm-12">
                      <label htmlFor="zone">Zone(s):</label>

                      <Select
                        className="mt-4 col-md-6 col-offset-4"
                        name="zones"
                        options={optionsZone}
                        value={filterData}
                        className="basic-multi-select map-color"
                        isMulti
                        onChange={(e, choice) => this.onSelectChange(e, choice)}
                        classNamePrefix="select"
                      />
                      {/* {this.state.is_empty_adress === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {" "}
                  {this.state.errors.adress}{" "}
                </div>
              )} */}
                      {/* <ul style={{ listStyle: "none" }}>
                {this.state.zones.map((z, index) => {
                  return (
                    <React.Fragment key={index}>
                      <li>{z.name}</li>
                    </React.Fragment>
                  );
                })}
              </ul> */}
                    </FormGroup>

                    {!this.state.inProgress ? (
                      <Button
                        bsStyle="info"
                        pullRight
                        fill
                        onClick={this.onUpdateUser}
                        type="submit"
                      >
                        Mettre à jour
                      </Button>
                    ) : (
                      <Button bsStyle="info" pullRight fill>
                        Loading...
                        <i
                          className="fa fa-spin fa-spinner"
                          aria-hidden="true"
                        ></i>
                      </Button>
                    )}

                    <div className="clearfix" />
                  </Form>
                }
              />
              <Button
                className="btn-modal-change-password btn-fill btn btn-warning"
                bsStyle="warning"
                onClick={this.handleModalOpen}
                pullLeft
                fill
              >
                Modifier votre mot de passe
              </Button>
            </Col>
            <Col md={4}>
              <UserCard
                bgImage="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
                avatar={avatar}
                name={this.state.user.first_name}
                userName={this.state.user.email}
                description={
                  <span>
                    {this.state.user.user_type}
                    <br />
                    {this.state.user.adress}
                    <br />
                    {this.state.user.phone}
                  </span>
                }
                socials={
                  <div>
                    <Button simple>
                      <i className="fa fa-facebook-square" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-twitter" />
                    </Button>
                    <Button simple>
                      <i className="fa fa-google-plus-square" />
                    </Button>
                  </div>
                }
              />
            </Col>
            {/* <Col md={8}>
              <Card
                title="Modifier mot de pass"
                content={
                  <form>
                    <FormInputs
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Ancien mot de pass",
                          type: "password",
                          bsClass: "form-control",
                          placeholder: "old password",
                        }]} />
                        <FormInputs
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Nouveau mot de pass",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "new password",
                        }
                      ]}
                      />
                    <FormInputs
                      ncols={["col-md-12"]}
                      properties={[
                        {
                          label: "Mot de Pass",
                          type: "password",
                          bsClass: "form-control",
                          placeholder: "Mot de passe",
                        }
                      ]}
                    />
        
    
                    {!this.state.inProgress ?
                             <Button bsStyle="info" pullRight fill 
                             onClick={this.onUpdateUser}
                           type="submit">
                             Modifier
                           </Button>
                            :
                            <Button
                            bsStyle="info" pullRight fill >Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col> */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default UserProfile;
