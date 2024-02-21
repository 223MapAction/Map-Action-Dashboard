import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Form,
  Checkbox,
  Alert,
  DropdownButton,
  MenuItem,
} from "react-bootstrap";
import Card from "components/Card/Card.jsx";
import { btnStyle } from "variables/Variables.jsx";
import axios from "axios";
import "assets/css/global.css";
import {
  FormLabel,
  FormControl,
  ListItemText,
  InputLabel,
  FormControlLabel,
  TextField,
  Input,
} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { Map, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CSVLink, CSVDownload } from "react-csv";
import { Redirect } from "react-router";
import swal from "sweetalert";
import Select from "react-select";
import { Player } from "video-react";
import "video-react/dist/video-react.css"; // import css
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default class Incidents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      inProgress: false,
      newIncident: {
        title: "",
        zone: "",
        description: "",
        photo: "",
        video: "",
        audio: "",
        lattitude: "",
        longitude: "",
        user_id: "",
        indicateur_id: "",
        category_ids: [],
        etat: "",
      },
      newIncidentModal: false,
      showIncidentModal: false,
      visible: false,
      error: false,
      message: [],
      newIncidentModal: false,
      users: [],
      categories: [],
      indicateurs: [],
      dateFilterChecked: false,
      zones: [],
      ChangeState: false,
      changeIndicateur: false,
      changeCategory: false,
      dataReady: false,
    };
    // this.export2csv = this.export2csv.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleIndicateurChange = this.handleIndicateurChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
  }

  handleSelectZoneChange = (selectedOption) => {
    console.log(selectedOption.label);
    let { newIncident } = this.state;
    newIncident.zone = selectedOption.label;
    this.setState({ newIncident });
  };

  componentDidMount = () => {
    this._getIncidents();
    this._getcategorys();
    this._getIndicateurs();
    this._getZones();
  };

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false, message: [] });
      }, 5000);
    });
  };
  onShowIncident = (item) => {
    this.setState({
      inProgress: false,
      showIncidentModal: !this.state.showIncidentModal,
    });
    if (item) {
      console.log("element à afficher ", item);
      this.state.newIncident = item;
    }
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
  handleShowIncidentModal = () => {
    this.setState((prevState) => {
      return { showIncidentModal: !prevState.showIncidentModal };
    });
    if (this.state.showIncidentModal === false) {
      this.setState({
        newIncident: {
          title: "",
          zone: "",
          description: "",
          photo: "",
          video: "",
          audio: "",
          lattitude: "",
          longitude: "",
          user_id: "",
        },
      });
    }
  };

  _getIncidents = async () => {
    //var url = global.config.url + "api/incident/";
    var url = global.config.url + "/MapApi/incident/";
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
      //  let data = res.data;
      this.setState({ dataReady: true, data: data, users: data.user_id });
    } catch (error) {
      console.log(error.message);
    }
  };

  onDeleteIncident = (item) => {
    if (item) {
      console.log("element à supprimer ", item);
      this.setState({ newIncident: item });
    }
    this.setState({ show: true });
  };

  deleteIncident = (e) => {
    this.setState({ inProgress: true });
    e.preventDefault();
    console.log(this.state.newIncident.id);
    //var url = global.config.url + "api/incident/";
    var url = global.config.url + "/MapApi/incident/";
    axios
      .delete(url + this.state.newIncident.id)
      .then((response) => {
        this.setState({ inProgress: !this.state.inProgress });
        this.setState({ show: false });
        swal("Succes", "Incident Supprime", "Warning");
        this._getIncidents();
        console.log(response);
        this.setState({
          newIncident: {
            title: "",
            zone: "",
            description: "",
            photo: "",
            video: "",
            audio: "",
            lattitude: "",
            longitude: "",
            user_id: "",
          },
        });
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal("Erreur", "Veuillez reessayer", "error");
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
        } else {
          console.log(error.message);
        }
      });
  };

  onRowClick = (rowData, rowMeta) => {
    console.log("----RowClick");
    console.log("rowData: ", rowData);
    console.log("rowMeta: ", rowMeta);
  };

  formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  formatEtat(etat) {
    if (etat === "resolved") {
      return <label className="admin-s"> Résolu</label>;
    } else if (etat === "declared") {
      return <label className="reporter-s">Déclare</label>;
    } else if (etat === "in_progress") {
      return <label className="business-s">En cours</label>;
    } else if (etat === "taken_into_account") {
      return <label className="encharge-s">Pris en compte</label>;
    }
  }

  getIndicateurById(id) {
    let name = "";
    for (let index = 0; index < this.state.indicateurs.length; index++) {
      const element = this.state.indicateurs[index];
      if (element.id === id) {
        name = element.name;
      }
    }
    return name;
  }

  getCategoryById(ids) {
    let name = "";
    let names = [];
    if (ids != undefined) {
      ids.map((cat_id, id) => {
        for (let index = 0; index < this.state.categories.length; index++) {
          const element = this.state.categories[index];
          if (element.id === cat_id) {
            names.push(element.name + " ");
          }
        }
      });
    }

    return names;
  }

  handleMultiChange = (selectedOption) => {
    let idcat = [];
    selectedOption.map((inc, id) => {
      idcat.push(inc.value);
    });
    console.log(idcat);
    this.state.newIncident.category_ids = idcat;
  };

  handleOneChange = (selectedOption) => {
    let idcat = [];
    this.state.newIncident.indicateur_id = selectedOption.value;
    console.log(selectedOption);
  };

  handleSelectChange = (selectedOption) => {
    console.log(selectedOption.value);
    let { newIncident } = this.state;
    newIncident.etat = selectedOption.value;
    // newIncident.zone =sessionStorage.zone
    this.setState({ newIncident });
    console.log(this.state.newIncident);
    var new_data = new FormData();
    new_data.append("etat", this.state.newIncident.etat);
    new_data.append("zone", this.state.newIncident.zone);
    var url =
      //global.config.url + "api/incident/" + this.state.newIncident.id + "/";
       global.config.url + "/MapApi/incident/" + this.state.newIncident.id + "/";
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response);
        this.setState({ changeState: !this.state.changeState });
        swal("Succès", " Statut modifié avec succès.", "success");
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        this.setState({ changeState: !this.state.changeState });
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

  handleIndicateurChange = (selectedOption) => {
    console.log(selectedOption.value);
    let { newIncident } = this.state;
    newIncident.indicateur_id = selectedOption.value;
    this.setState({ newIncident });
    console.log(this.state.newIncident);
    var new_data = new FormData();
    new_data.append("indicateur_id", this.state.newIncident.indicateur_id);
    new_data.append("etat", this.state.newIncident.etat);
    new_data.append("zone", this.state.newIncident.zone);
    console.log(new_data);
    var url =
      //global.config.url + "api/incident/" + this.state.newIncident.id + "/";
       global.config.url + "/MapApi/incident/" + this.state.newIncident.id + "/";
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response);
        this.setState({ changeIndicateur: !this.state.changeIndicateur });
        swal("Succes", " Indicateur modifie", "success");
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        this.setState({ changeIndicateur: !this.state.changeIndicateur });
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

  handleCategoryChange = (selectedOption) => {
    this.setState({ inProgress: !this.state.inProgress });
    console.log(this.state.newIncident.category_ids.length);
    var new_data = new FormData();
    for (var i = 0; i < this.state.newIncident.category_ids.length; i++) {
      new_data.append("category_ids", this.state.newIncident.category_ids[i]);
    }
    new_data.append("etat", this.state.newIncident.etat);
    new_data.append("zone", this.state.newIncident.zone);
    console.log(new_data);
    var url =
      //global.config.url + "api/incident/" + this.state.newIncident.id + "/";
      global.config.url + "/MapApi/incident/" + this.state.newIncident.id + "/";
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response);
        this.setState({
          inProgress: !this.state.inProgress,
          changeCategory: !this.state.changeCategory,
        });
        swal("Succes", " Categories ajoutees", "success");
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        this.setState({ changeCategory: !this.state.changeCategory });
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

  _getcategorys = async () => {
    let user = sessionStorage.user_id;
    //var url = global.config.url + "api/category/";
    var url = global.config.url + "/MapApi/category/";
    try {
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      });
      console.log(res.data);
      let data = res.data.results;
      this.setState({ categories: data });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  _getIndicateurs = async () => {
    let user = sessionStorage.user_id;
    //var url = global.config.url + "api/indicateur/";
    var url = global.config.url + "/MapApi/indicator/";
    try {
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      });
      console.log(res.data);
      let data = res.data.results;
      this.setState({ indicateurs: data });
    } catch (error) {
      console.log(error.message);
    }
  };

  handleModalOpen = () => {
    this.setState({ newIncidentModal: !this.state.newIncidentModal });
  };
  addIncident = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    var new_data = new FormData();
    new_data.append("title", this.state.newIncident.title);
    new_data.append("zone", this.state.newIncident.zone);
    new_data.append("description", this.state.newIncident.description);
    new_data.append("photo", this.state.newIncident.photo);
    new_data.append("video", this.state.newIncident.video);
    new_data.append("audio", this.state.newIncident.audio);
    new_data.append("lattitude", this.state.newIncident.lattitude);
    new_data.append("longitude", this.state.newIncident.longitude);
    new_data.append("user_id", sessionStorage.user_id);
    new_data.append("category_ids", this.state.newIncident.category_ids);
    new_data.append("indicateur_id", this.state.newIncident.indicateur_id);

    // var url = global.config.url + "api/incident/";
    var url = global.config.url + "/MapApi/incident/";
    // new_data.append('file', this.state.newIncident.photo)
    axios
      .post(url, new_data)
      .then((response) => {
        let { data } = this.state;
        data.push(new_data);
        console.log("new_data", this.state.newIncident);

        this.setState({
          inProgress: !this.state.inProgress,
          newEluModal: false,
          newIncidentModal: false,
        });
        this._getIncidents();
        swal("Succes", "Incident ajoute avec succes", "success");
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal("erreur", "Reessayer", "error");
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          swal("erreur", "Reessayer", "error");
          console.log(error.request.data);
        } else {
          swal("erreur", "Reessayer", "error");
          console.log(error.message);
        }
      });
  };

  onChangeState = (item) => {
    this.setState({ changeState: !this.state.changeState, EditIncident: item });
  };

  onChangeIndicateur = (item) => {
    this.setState({
      changeIndicateur: !this.state.changeIndicateur,
      EditIncident: item,
    });
  };

  onChangeCategory = (item) => {
    this.setState({
      changeCategory: !this.state.changeCategory,
      EditIncident: item,
    });
  };

  _getZones = async () => {
    //var url = global.config.url + "api/zone/";
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
      this.setState({ zones: data });
    } catch (error) {
      console.log(error.message);
    }
  };

  renderShowIncident = () => {
    var url = global.config.url;
    let imgUrl = this.state.newIncident.photo;
    let imgIncident = url + `${imgUrl}`;
    let audioUrl = this.state.newIncident.audio;
    let audioIncident = url + `${audioUrl}`;
    let video = this.state.newIncident.video;

    if (video != null) {
      let ex_video = video.substr(video.length - 3);

      if (ex_video == "mov") {
        video = video.slice(0, -3) + "mp4";
      }
    }

    let videoIncident = url + `${video}`;
    const Loader = () => {
      return (
        <div className="loader">
          <h2>Loading video...</h2>
        </div>
      );
    };
    const lattitude = this.state.newIncident.lattitude;
    const longitude = this.state.newIncident.longitude;
    const position = [lattitude, longitude];

    return (
      <div className="modal fade">
        <Modal
          show={this.state.showIncidentModal}
          onHide={this.handleShowIncidentModal}
        >
          <ModalHeader closeButton className="map-color fs-20 t-center">
            Details Incident
            <button className="pull-right" style={{ border: 0 }}>
              <DropdownButton
                title="Modifier"
                id="dropdownEdit"
                className="btn btn-primary"
              >
                <MenuItem
                  onClick={() => this.onChangeState(this.state.newIncident)}
                >
                  Statut
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    this.onChangeIndicateur(this.state.newIncident)
                  }
                >
                  Indicateur
                </MenuItem>
                <MenuItem
                  onClick={() => this.onChangeCategory(this.state.newIncident)}
                >
                  Categories
                </MenuItem>
              </DropdownButton>
            </button>
          </ModalHeader>

          <ModalBody className="col-sm-12">
            <div className="row mb-4 container-infos-modal-incident">
              <div className="col-sm-6 pb-1">
                <label htmlFor="code" className="map-color fs-18">
                  Titre:
                </label>
                <p>{this.state.newIncident.title}</p>
              </div>
              <div className="col-sm-6 pb-1">
                <label htmlFor="code" className="map-color fs-18">
                  Zone:
                </label>
                <p>{this.state.newIncident.zone}</p>
              </div>
              <div className="col-sm-6 pb-1">
                <label htmlFor="code" className="map-color fs-18">
                  Statut:
                </label>
                {this.state.newIncident.etat === "declared" ? (
                  <p>Déclaré</p>
                ) : (
                  <></>
                )}
                {this.state.newIncident.etat === "resolved" ? (
                  <p>Résolu</p>
                ) : (
                  <></>
                )}
                {this.state.newIncident.etat === "in_progress" ? (
                  <p>En cours</p>
                ) : (
                  <></>
                )}
                {this.state.newIncident.etat === "taken_into_account" ? (
                  <p>Pris en compte</p>
                ) : (
                  <></>
                )}
              </div>
              <div className="col-sm-6 pb-1">
                <label htmlFor="code" className="map-color fs-18">
                  Auteur:
                </label>
                <p>
                  {this.state.newIncident?.user_id ? this.state.newIncident?.user_id?.first_name +
                    " " +
                    this.state.newIncident?.user_id?.last_name : null}
                </p>
              </div>
            </div>

            <hr className="py-3" />
            <div className="col-sm-12 pb-3">
              {lattitude !== null && longitude !== null && !isNaN(longitude) && !isNaN(lattitude) ? (
                <Map center={position} zoom={13}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>{this.state.newIncident.title}</Popup>
                    <Circle center={position} radius={500} color="red"></Circle>
                  </Marker>
                </Map>
              ) : (
                <p className="danger">Coordonnees non renseignées ou invalide </p>
              )}
            </div>
            <div className="col-sm-12 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Description:
              </label>
              <p>{this.state.newIncident.description}</p>
            </div>

            <div className="col-sm-12 pb-3">
              <label className="map-color fs-18">Image:</label>
              <img src={imgIncident} alt="image" />
              {/* <img src={`https://image.tmdb.org/t/p/w300/${this.state.newIncident.photo}`} alt=""/> */}
            </div>
            <div className="col-sm-12 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Video:
              </label>
              <div className="video">
                <Player fluid={false} width={537} height={400}>
                  <source src={videoIncident} />
                </Player>
                {this.state.videoIsLoading ? <Loader /> : null}
              </div>
            </div>
            <div className="col-sm-6">
              <label htmlFor="code" className="map-color fs-18">
                Category:
              </label>
              <p>{this.state.newIncident.category_ids}</p>
            </div>
            <div className="col-sm-6">
              <label htmlFor="code" className="map-color fs-18">
                Indicateur:
              </label>
              <p>
                {this.getIndicateurById(this.state.newIncident.indicateur_id)}
              </p>
            </div>
            <div className="col-sm-12 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Audio:{" "}
              </label>
              <br />
              <audio controls src={audioIncident}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
    );
  };

  render() {
    let optionscat = this.state.categories.map(function (category) {
      return {
        value: category.id,
        label: category.name,
        key: category.id + "unique-key",
      };
    });
    const optionsZone = this.state.zones.map(function (zone) {
      return { value: zone.id, label: zone.name, key: zone.id + "unique-key" };
    });
    let optionsIndic = this.state.indicateurs.map(function (ind) {
      return { value: ind.id, label: ind.name, key: ind.id + "unique-key" };
    });
    const optionstype = [
      { label: "Déclaré", value: "declared" },
      { label: "Pris en compte", value: "taken_into_account" },
      { label: "En cours de résoluton", value: "in_progress" },
      { label: "Résolu", value: "resolved" },
    ];

    let defaultVal = {};

    if (this.state.newIncident.etat == "declared") {
      defaultVal = { label: "Déclaré", value: "declared" };
    }
    if (this.state.newIncident.etat == "in_progress") {
      defaultVal = {
        label: "En cours de résoluton",
        value: "En cours de résoluton",
      };
    }
    if (this.state.newIncident.etat == "taken_into_account") {
      defaultVal = { label: "Pris en compte", value: "Pris en compte" };
    }
    if (this.state.newIncident.etat == "resolved") {
      defaultVal = { label: "Résolu", value: "Résolu" };
    }

    let changeStateModal = (
      <div className="modal fade">
        <Modal
          size="sm"
          show={this.state.changeState}
          onHide={this.onChangeState}
        >
          <ModalHeader closeButton>Status Incident</ModalHeader>
          <ModalBody className="col-sm-12">
            <Form encType="multipart/form-data">
              <FormGroup className="col-sm-6">
                <label htmlFor="etat">
                  Statut Incident: {this.state.newIncident.etat}
                </label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={defaultVal}
                  // defaultValue={optionstype[0]}
                  name="etat"
                  options={optionstype}
                  onChange={this.handleSelectChange}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
    );

    let changeIndicateurModal = (
      <div className="modal fade">
        <Modal
          size="sm"
          show={this.state.changeIndicateur}
          onHide={this.onChangeIndicateur}
        >
          <ModalHeader closeButton>Indicateur</ModalHeader>
          <ModalBody className="col-sm-12">
            <Form encType="multipart/form-data">
              <FormGroup className="col-sm-6">
                <label htmlFor="from">Indicateurs:</label>
                <Select
                  // components={makeAnimated()}
                  defaultValue={{
                    label: this.getIndicateurById(
                      this.state.newIncident.indicateur_id
                    ),
                    value: this.state.newIncident.indicateur_id,
                  }}
                  name="indicateurs"
                  options={optionsIndic}
                  className="basic-single map-color"
                  onChange={this.handleIndicateurChange}
                  classNamePrefix="select"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
    );

    let changeCategoryModal = (
      <div className="modal fade">
        <Modal
          size="sm"
          show={this.state.changeCategory}
          onHide={this.onChangeCategory}
        >
          <ModalHeader closeButton>Categories :</ModalHeader>
          <ModalBody className="col-sm-12">
            <Form encType="multipart/form-data">
              <FormGroup className="col-sm-6">
                <label htmlFor="from">
                  Categories:
                  <div>
                    {this.getCategoryById(
                      this.state.newIncident.category_ids
                    ).map((item, i) => {
                      {
                        return <span> {item}</span>;
                      }
                    })}
                  </div>
                </label>
                <Select
                  // className="mt-4 col-md-6 col-offset-4"
                  // components={makeAnimated()}
                  isMulti
                  name="categories"
                  options={optionscat}
                  className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                  onChange={this.handleMultiChange}
                  classNamePrefix="select"
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button
                className="btn btn-primary"
                onClick={this.handleCategoryChange}
              >
                Ajouter
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{" "}
            <Button className="btn btn-danger" onClick={this.onChangeCategory}>
              Annuler
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );

    let newIncidentModal = (
      <Modal show={this.state.newIncidentModal} onHide={this.handleModalOpen}>
        <ModalHeader closeButton>Nouveau Incident</ModalHeader>
        <Form encType="multipart/form-data">
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="title">Titre:</label>
              <input
                className="form-control"
                type="text"
                id="title"
                name="title"
                value={this.state.newIncident.title}
                onChange={(e) => {
                  let { newIncident } = this.state;
                  newIncident.title = e.target.value;
                  this.setState({ newIncident });
                }}
              />
            </FormGroup>

            <FormGroup className="col-sm-6">
              <label htmlFor="zone">Zone:</label>

              <Select
                // className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="zone"
                options={optionsZone}
                className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                onChange={this.handleSelectZoneChange}
                classNamePrefix="select"
              />
            </FormGroup>
            <FormGroup className="col-sm-12">
              <label htmlFor="from">Description:</label>
              <textarea
                className="form-control"
                type="text"
                id="desc"
                name="description"
                value={this.state.newIncident.description}
                onChange={(e) => {
                  let { newIncident } = this.state;
                  newIncident.description = e.target.value;
                  this.setState({ newIncident });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Categories:</label>
              <Select
                //className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                isMulti
                name="categories"
                options={optionscat}
                className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                onChange={this.handleMultiChange}
                classNamePrefix="select"
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Indicateurs:</label>
              <Select
                // className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="indicateurs"
                options={optionsIndic}
                className="basic-multi-select map-color mt-4 col-md-6 col-offset-4"
                onChange={this.handleOneChange}
                classNamePrefix="select"
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
                  let { newIncident } = this.state;
                  newIncident.photo = e.target.files[0];
                  this.setState({ newIncident });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="video_inc">Video:</label>
              <input
                className="form-control"
                type="file"
                id="video_inc"
                name="video"
                onChange={(e) => {
                  let { newIncident } = this.state;
                  newIncident.video = e.target.files[0];
                  this.setState({ newIncident });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="lat">Lattitude:</label>
              <input
                className="form-control"
                type="text"
                id="lat"
                name="lattitude"
                value={this.state.newIncident.lattitude}
                onChange={(e) => {
                  let { newIncident } = this.state;
                  newIncident.lattitude = e.target.value;
                  this.setState({ newIncident });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="aud">Audio:</label>
              <input
                className="form-control"
                type="file"
                id="aud"
                name="audio"
                // value={this.state.newIncident.audio}
                onChange={(e) => {
                  let { newIncident } = this.state;
                  newIncident.audio = e.target.files[0];
                  this.setState({ newIncident });
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="long">Longitude:</label>
              <input
                className="form-control"
                type="text"
                id="long"
                name="longitude"
                value={this.state.newIncident.longitude}
                onChange={(e) => {
                  let { newIncident } = this.state;
                  newIncident.longitude = e.target.value;
                  this.setState({ newIncident }, console.log(this.state));
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.addIncident}>
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

    if (this.state.show) {
      return (
        <Alert
          bsStyle="danger"
          onDismiss={(e) => this.setState({ show: false })}
        >
          <h4>Suppresion</h4>
          <p>Voulez vous vraiment supprimer cet incident</p>
          <p>
            {!this.state.inProgress ? (
              <Button bsStyle="danger" onClick={this.deleteIncident}>
                Supprimer
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}

            <span> or </span>
            <Button onClick={(e) => this.setState({ show: false })}>
              Annuler
            </Button>
          </p>
        </Alert>
      );
    }
    const csvheaders = [
      { label: "Titre", key: "title" },
      { label: "Description", key: "description" },
      { label: "Zone", key: "zone" },
      { label: "Lattitude", key: "lattitude" },
      { label: "Longitude", key: "longitude" },
      { label: "Etat", key: "etat" },
      { label: "Utilisateur", key: "user_id" },
      { label: "Indicateur", key: "indicateur_id" },
      { label: "Categorie", key: "category_id" },
    ];
    const csvdata = this.state.data;
    const columns = [
      {
        name: "title",
        label: "Titre",
        options: {
          filter: true,
          filterType: "dropdown",
          sort: true,
        },
      },
      {
        name: "zone",
        label: "Zone",
        options: {
          filter: true,
          filterType: "dropdown",
          sort: false,
        },
      },
      {
        name: "description",
        label: "Description",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "user_id",
        label: "Utilisateur",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "categories",
        label: "Categorie",
        options: {
          filter: true,
          filterType: "dropdown",
          sort: true,
        },
      },
      {
        name: "indicateur",
        label: "Indicateur",
        options: {
          filter: true,
          filterType: "dropdown",
          sort: true,
        },
      },
      {
        name: "status",
        label: "Etat",
        options: {
          filter: true,
          filterType: "custom",
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) =>
            value === "resolved" ? (
              <label className="admin-s"> Résolu</label>
            ) : value === "declared" ? (
              <label className="reporter-s">Déclare</label>
            ) : value === "in_progress" ? (
              <label className="business-s">En cours</label>
            ) : value === "taken_into_account" ? (
              <label className="encharge-s">Pris en compte</label>
            ) : null,
          customFilterListOptions: {
            render: (v) => v,
            update: (filterList, filterPos, index) => {
              //console.log(filterList, filterPos, index)
              filterList[index] = [];
              /// console.log('update', filterList)
              return filterList;
            },
          },
          filterOptions: {
            logic: (etat, filters, row) => {
              //console.log('etat', etat, filters, row)
              if (filters.length && filters.length > 1)
                return !filters.includes(etat);
              return false;
            },
            display: (filterList, onChange, index, column) => {
              //console.log('object', filterList, column)

              const etatstype = [
                { label: "Déclaré", value: "declared" },
                { label: "Pris en compte", value: "taken_into_account" },
                { label: "En cours de résoluton", value: "in_progress" },
                { label: "Résolu", value: "resolved" },
              ];
              return (
                <div className="form-group pos-relative mb-4">
                  <label className="label-state" htmlFor="etat">
                    Etat
                  </label>
                  <select
                    className="form-control select-state"
                    name="etat"
                    id="etat"
                    multiple={false}
                    value={filterList[index] || []}
                    onChange={(event) => {
                      filterList[index] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                  >
                    <option value="">All</option>
                    {etatstype.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            },
          },
        },
      },
      {
        name: "created_at",
        label: "Date Creation",
        options: {
          sort: true,
          filter: true,
          filterType: "dropdown",
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
      let us = "";
      {
        item.user_id != null
          ? (us = item.user_id.first_name + " " + item.user_id.last_name)
          : (us = "indefini");
      }

      return [
        item.title,
        item.zone,
        item.description,
        us,
        this.getCategoryById(item.category_ids),
        this.getIndicateurById(item.indicateur_id),
        item.etat,
        this.formatDate(item.created_at),
        <div className="btn-group">
          <a
            onClick={(e) => this.onShowIncident(item)}
            className="btn btn-default btn-xs map-color nb"
            data-id={item.id}
          >
            <i className="fas fa-eye fa-x"></i>
          </a>
          <Button
            className="btn btn-danger btn-xs red-color nb"
            onClick={(e) => {
              this.onDeleteIncident(item);
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
      search: true,

      hasIndex: true /* <-- use numbers for rows*/,
      emptyTable: "No data available in table",
    };

    return (
      <div className="content">
        {/* <button onClick={this.export2csv}>Export array to csv file</button> */}
        <Button className="pull-right" style={btnStyle}>
          <CSVLink
            filename="incidents.csv"
            data={csvdata}
            headers={csvheaders}
            className="pull-right"
          >
            <i className="fa fa-download"></i>
            Export CSV
          </CSVLink>
        </Button>
        <Button
          style={btnStyle}
          onClick={this.handleModalOpen}
          className="pull-right"
        >
          <i className="fa fa-plus"></i>Nouveau
        </Button>
        {this.state.dataReady ? (
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Liste des Incidents"}
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
        {this.renderShowIncident()}
        {newIncidentModal}
        {changeStateModal}
        {changeIndicateurModal}
        {changeCategoryModal}
      </div>
    );
  }
}
