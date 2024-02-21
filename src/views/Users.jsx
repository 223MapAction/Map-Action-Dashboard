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
import swal from "sweetalert";
import Card from "components/Card/Card.jsx";
import { btnStyle } from "variables/Variables.jsx";
import axios from "axios";
import Select from "react-select";
import "assets/css/global.css";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      inProgress: false,
      newUserModal: false,
      editUserModal: false,
      newUser: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        adress: "",
        user_type: "",
        password: "",
      },
      dataReady: false,
    };
  }
  componentDidMount = () => {
    this._getUsers();
  };

  _getUsers = async () => {
    // var url = global.config.url + "api/user/";
    var url = global.config.url + "/MapApi/user/";
    try {
      let res = await axios.get(url, {
        headers: { Authorization: `Bearer${sessionStorage.token}` },
      });

      this.setState({ dataReady: true, data: res.data.results });
      console.log(this.state.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  __addUser = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    const new_data = {
      first_name: this.state.newUser.first_name,
      last_name: this.state.newUser.last_name,
      email: this.state.newUser.email,
      phone: this.state.newUser.phone,
      adress: this.state.newUser.adress,
      user_type: this.state.newUser.user_type,
      password: "mapaction2020",
    };
    // var url = global.config.url + "api/user/";
    var url = global.config.url + "/MapApi/user/";
    console.log(new_data);
    axios
      .post(url, new_data)
      .then((response) => {
        console.log(response);
        let { data } = this.state;
        data.push(new_data);
        this.setState({
          inProgress: !this.state.inProgress,
          newUserModal: false,
          newUser: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            adress: "",
            user_type: "",
            password: "",
          },
        });
        swal("Succes", "Utilisateur ajoute avec succes", "success");
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal("Erreur Ajout", "Veuillez reessayer", "error");
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
          swal("erreur", "Veuillez reessayer", "error");
        } else {
          swal("erreur", "Veuillez reessayer", "error");
          console.log(error.message);
        }
      });
  };

  onUpdateUser = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    const new_data = {
      first_name: this.state.newUser.first_name,
      last_name: this.state.newUser.last_name,
      email: this.state.newUser.email,
      phone: this.state.newUser.phone,
      adress: this.state.newUser.adress,
      user_type: this.state.newUser.user_type,
      password: "mapaction2020",
    };

    // var url = global.config.url + "api/user/" + this.state.newUser.id + "/";
    var url = global.config.url + "/MapApi/user/" + this.state.newUser.id + "/";
    console.log(new_data);
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response);
        this.setState({
          inProgress: !this.state.inProgress,
          newUserModal: false,
          editUserModal: false,
          newUser: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            adress: "",
            user_type: "",
            password: "",
          },
        });
        swal("Succès", "Utilisateur mis à jour avec succès", "success");
        this._getUsers();
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal(
            "Oupsss! Une erreur est survenue",
            "Veuillez réessayer plus tard.",
            "error"
          );
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
          swal(
            "Oupsss! Une erreur est survenue",
            "Veuillez réessayer plus tard.",
            "error"
          );
        } else {
          swal(
            "Oupsss! Une erreur est survenue",
            "Veuillez réessayer plus tard.",
            "error"
          );
          console.log(error.message);
        }
      });
  };

  onEditUser = (item) => {
    console.log(item);
    this.setState({ editUserModal: !this.state.editUserModal, newUser: item });
  };

  onDeleteUser = (item) => {
    swal({
      title: "Etes vous sure?",
      text: "La suppression est definitive",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // var url = global.config.url + "api/user/" + item.id + "/";
        var url = global.config.url + "/MapApi/user/" + item.id + "/";
        console.log(item);
        axios
          .delete(url, item)
          .then((response) => {
            console.log(response);

            swal("Utilisateur Supprime!", {
              icon: "success",
            });
            this._getUsers();
          })
          .catch((error) => {
            this.setState({ inProgress: !this.state.inProgress });
            if (error.response) {
              swal("Erreur Suppression", "Veuillez reessayer", "error");
              console.log(error.response.status);
              console.log(error.response.data);
            } else if (error.request) {
              console.log(error.request.data);
              swal("erreur", "Veuillez reessayer", "error");
            } else {
              swal("erreur", "Veuillez reessayer", "error");
              console.log(error.message);
            }
          });
      } else {
        swal("Suppression annulee!");
      }
    });
  };

  formatType(type) {
    if (type === "admin") {
      return <label className="admin-s">{type}</label>;
    } else if (type === "elu") {
      return <label className="elu-s">{type}</label>;
    } else if (type === "business") {
      return <label className="business-s">{type}</label>;
    } else if (type === "reporter") {
      return <label className="reporter-s">{type}</label>;
    } else if (type === "citizen") {
      return <label className="citizen-s">{type}</label>;
    } else {
      return <label className="visitor-s">{type}</label>;
    }
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTypography: {
          h6: {
            fontSize: "1.5rem",
          },
        },
        MUIDataTableHeadCell: {
          root: {
            fontSize: "16px",
            color: "#38A0DB",
          },
        },
        MUIDataTableBodyCell: {
          root: {
            fontSize: "13px",
          },
        },
        MuiInputLabel: {
          animated: {
            fontSize: "21px",
          },
        },
        MuiTablePagination: {
          caption: {
            fontSize: '15px',
          },
        },
        MuiMenuItem: {
          root: {
            fontSize: "15px",
          },
        },
        MUIDataTableToolbar: {
          iconActive: {
            color: "#38A0DB",
          },
        },
      },
    });

  handleModalOpen = () => {
    this.setState({ newUserModal: !this.state.newUserModal });
  };
  handleEditModal = () => {
    this.setState({ editUserModal: !this.state.editUserModal });
  };

  handleSelectChange = (selectedOption) => {
    console.log(selectedOption.value);
    let { newUser } = this.state;
    newUser.user_type = selectedOption.value;
    this.setState({ newUser });
  };
  render() {
    const optionstype = [
      { value: "admin", label: "Admin" },
      { value: "visitor", label: "Visitor" },
      { value: "reporter", label: "Reporter" },
      { value: "citizen", label: "Citizen" },
      { value: "business", label: "Business" },
      { value: "elu", label: "Organisation" },
    ];
    let newUserModal = (
      <Modal show={this.state.newUserModal} onHide={this.handleModalOpen}>
        <ModalHeader closeButton>Nouveau Utilisateur</ModalHeader>
        <Form>
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Prenom:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="first_name"
                value={this.state.newUser.first_name}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.first_name = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Nom:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="last_name"
                value={this.state.newUser.last_name}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.last_name = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="email">Email:</label>
              <input
                className="form-control"
                type="text"
                id="email"
                name="email"
                value={this.state.newUser.email}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.email = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="phone">Telephone:</label>
              <input
                className="form-control"
                type="text"
                id="phone"
                name="phone"
                value={this.state.newUser.phone}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.phone = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="adress">Adresse:</label>
              <input
                className="form-control"
                type="text"
                id=" adress"
                name=" adress"
                value={this.state.newUser.adress}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.adress = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>

            <FormGroup className="col-sm-6">
              <label htmlFor="user_type">Type Utilisateur:</label>
              <Select
                // className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="incidents_rapport"
                options={optionstype}
                className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                onChange={this.handleSelectChange}
                classNamePrefix="select"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.__addUser}>
                Ajouter
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{" "}
            <Button className="btn btn-danger" onClick={this.handleModalOpen}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );

    let editUserModal = (
      <Modal show={this.state.editUserModal} onHide={this.handleEditModal}>
        <ModalHeader closeButton>Modification</ModalHeader>
        <Form>
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Prenom:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="first_name"
                value={this.state.newUser.first_name}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.first_name = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Nom:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="last_name"
                value={this.state.newUser.last_name}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.last_name = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="email">Email:</label>
              <input
                className="form-control"
                type="text"
                id="email"
                name="email"
                value={this.state.newUser.email}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.email = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="phone">Telephone:</label>
              <input
                className="form-control"
                type="text"
                id="phone"
                name="phone"
                value={this.state.newUser.phone}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.phone = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="adress">Adresse:</label>
              <input
                className="form-control"
                type="text"
                id=" adress"
                name=" adress"
                value={this.state.newUser.adress}
                onChange={(e) => {
                  let { newUser } = this.state;
                  newUser.adress = e.target.value;
                  this.setState({ newUser });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="user_type">Type Utilisateur:</label>
              <Select
                // className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="incidents_rapport"
                options={optionstype}
                className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                onChange={this.handleSelectChange}
                classNamePrefix="select"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.onUpdateUser}>
                Modifier
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{" "}
            <Button className="btn btn-danger" onClick={this.handleEditModal}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
    const columns = [
      {
        name: "first_name",
        label: "Prenom",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "last_name",
        label: "Nom",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "phone",
        label: "Telephone",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "user_type",
        label: "Type",
        options: {
          filter: true,
          sort: false,
          display: false,
        },
      },
      {
        name: "user_type",
        label: "Type",
        options: {
          filter: false,
          sort: false,
        },
      },

      {
        name: "actions",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          export: false,
        },
      },
    ];

    const data = this.state.data.map((item, i) => {
      return [
        item.first_name,
        item.last_name,
        item.email,
        item.phone,
        item.user_type,
        this.formatType(item.user_type),
        <div className="btn-group">
          <a
            onClick={(e) => this.onEditUser(item)}
            className="btn btn-default btn-xs map-color nb"
            data-id={item.id}
          >
            <i className="fas fa-edit fa-x"></i>
          </a>
          <Button
            className="btn btn-danger btn-xs red-color nb"
            onClick={(e) => {
              this.onDeleteUser(item);
              this.setState({ inProgress: false });
            }}
          >
            <i className="fas fa-trash fa-x"></i>
          </Button>
        </div>,
      ];
    });
    // this.state.data;

    const options = {
      filter: true,
      filterType: "dropdown",
      responsive: "stacked",
      hasIndex: true /* <-- use numbers for rows*/,
    };
    return (
      <div className="content">
        <Button
          className="pull-right"
          style={btnStyle}
          onClick={this.handleModalOpen}
        >
          <i className="fa fa-download"></i>
          Nouveau Utilisateur
        </Button>
        {this.state.dataReady ? (
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Liste des Utilisateurs"}
              data={data}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        ) : (
          <Loader
            type="Audio"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        )}
        {newUserModal}
        {editUserModal}
      </div>
    );
  }
}
