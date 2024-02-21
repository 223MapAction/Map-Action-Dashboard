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
import Card from "components/Card/Card.jsx";
import { btnStyle } from "variables/Variables.jsx";
import axios from "axios";
import swal from "sweetalert";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Select from "react-select";
import "assets/css/global.css";

export default class Zone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // token: window.sessionStorage.getItem('token'),
      data: [],
      inProgress: false,
      newZone: {
        name: "",
        lattitude: "",
        longitude: "",
        photo: "",
      },
      newZoneModal: false,
      editZoneModal: false,
      visible: false,
      error: false,
      message: [],
      // show: false,
    };
  }

  componentDidMount = () => {
    this._getZones();
  };

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
      console.log(res.data);
      let data = res.data["results"];
      console.log(data);
      this.setState({ data: data });
    } catch (error) {
      console.log(error.message);
    }
  };

  __addZone = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    var new_data = new FormData();
    new_data.append("name", this.state.newZone.name);
    new_data.append("lattitude", this.state.newZone.lattitude);
    new_data.append("longitude", this.state.newZone.longitude);
    new_data.append("photo", this.state.newZone.photo);
    // var url = global.config.url + "api/zone/";
    var url = global.config.url + "/MapApi/zone/";
    console.log(new_data);
    axios
      .post(url, new_data)
      .then((response) => {
        console.log(response);
        let { data } = this.state;
        data.push(new_data);
        this.setState({
          inProgress: !this.state.inProgress,
          newZoneModal: false,
        });
        swal("Succes", "Zone ajoute avec succes", "success");
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal("Erreur Ajout", error.response.data, "error");
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
          swal("erreur", error.request.data, "error");
        } else {
          swal("erreur", error.message, "error");
          console.log(error.message);
        }
      });
  };

  onUpdateZone = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    // const new_data = this.state.newZone;
    var new_data = new FormData();
    new_data.append("name", this.state.newZone.name);
    new_data.append("lattitude", this.state.newZone.lattitude);
    new_data.append("longitude", this.state.newZone.longitude);
    if (this.state.newZone.photo) {
      new_data.append("photo", this.state.newZone.photo);
    }

    // var url = global.config.url + "api/zone/";
    var url = global.config.url + "/MapApi/zone/";
    console.log(new_data);
    // var url = global.config.url + "api/zone/" + this.state.newZone.id + "/";
    var url = global.config.url + "/MapApi/zone/" + this.state.newZone.id + "/";
    console.log(new_data);
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response);
        this.setState({
          inProgress: !this.state.inProgress,
          newZone: {
            name: "",
            lattitude: "",
            longitude: "",
          },
          newZoneModal: false,
          editZoneModal: false,
        });
        swal("Succes", "Zone mise a jour avec succes", "success");
        this._getZones();
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal("Erreur", "Veuillez reessayer", "error");
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

  onEditZone = (item) => {
    console.log(item);
    delete item.photo;
    this.setState({ editZoneModal: !this.state.editZoneModal, newZone: item });
  };

  onDeleteZone = (item) => {
    swal({
      title: "Etes vous sure?",
      text: "La suppression est definitive",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // var url = global.config.url + "api/zone/" + item.id + "/";
        var url = global.config.url + "/MapApi/zone/" + item.id + "/";
        console.log(item);
        axios
          .delete(url, item)
          .then((response) => {
            console.log(response);

            swal("Zone Supprimee!", {
              icon: "success",
            });
            this._getZones();
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

  handleEditModal = () => {
    this.setState({
      editZoneModal: !this.state.editZoneModal,
      newZone: {
        name: "",
        lattitude: "",
        longitude: "",
      },
    });
  };

  handleModalOpen = () => {
    this.setState({ newZoneModal: !this.state.newZoneModal });
  };

  render() {
    const columns = [
      {
        name: "Name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "photo",
        label: "Photo",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "lattitude",
        label: "Lattitude",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "longitude",
        label: "Longitude",
        options: {
          filter: true,
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
      //var url = "http://137.74.196.127:8000";
      var url = global.config.url.slice(0, -1);
      let imgUrl = item.photo;
      let imgZone = url + `${imgUrl}`;
      return [
        item.name,
        // imgZone,
        <img src={imgZone} alt="" className="width-half" />,
        item.lattitude,
        item.longitude,
        <div className="btn-group">
          <a
            onClick={(e) => this.onEditZone(item)}
            className="btn btn-default btn-xs map-color nb"
            data-id={item.id}
          >
            <i className="fas fa-edit fa-x"></i>
          </a>
          <Button
            className="btn btn-danger btn-xs red-color nb"
            onClick={(e) => {
              this.onDeleteZone(item);
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

    let newZoneModal = (
      <Modal show={this.state.newZoneModal} onHide={this.handleModalOpen}>
        <ModalHeader closeButton>Nouvelle Zone</ModalHeader>
        <Form encType="multipart/form-data">
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Nom:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="first_name"
                value={this.state.newZone.name}
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.name = e.target.value;
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Lattitude:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="last_name"
                value={this.state.newZone.lattitude}
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.lattitude = e.target.value;
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Longitude:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="last_name"
                value={this.state.newZone.longitude}
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.longitude = e.target.value;
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="photo_inc">Photo:</label>
              <input
                className="form-control"
                type="file"
                id="photo_inc"
                name="photo"
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.photo = e.target.files[0];
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.__addZone}>
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

    let editZoneModal = (
      <Modal show={this.state.editZoneModal} onHide={this.handleEditModal}>
        <ModalHeader closeButton>Modifier Zone</ModalHeader>
        <Form encType="multipart/form-data">
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Nom:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="first_name"
                value={this.state.newZone.name}
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.name = e.target.value;
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Lattitude:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="last_name"
                value={this.state.newZone.lattitude}
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.lattitude = e.target.value;
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Longitude:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="last_name"
                value={this.state.newZone.longitude}
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.longitude = e.target.value;
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="photo_inc">Photo:</label>
              <input
                className="form-control"
                type="file"
                id="photo_inc"
                name="photo"
                onChange={(e) => {
                  let { newZone } = this.state;
                  newZone.photo = e.target.files[0];
                  this.setState({ newZone });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.onUpdateZone}>
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

    return (
      <div className="content">
        {newZoneModal}
        {editZoneModal}
        <Button
          className="pull-right"
          style={btnStyle}
          onClick={this.handleModalOpen}
        >
          <i className="fa fa-plus"></i>
          Nouvelle Zone
        </Button>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={"Liste des Zones"}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
