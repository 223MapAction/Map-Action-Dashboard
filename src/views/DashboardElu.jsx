import React, { Component } from "react";
import ChartistGraph from "react-chartist";
import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import axios from "axios";
import ReactDOMServer from 'react-dom/server';

import {
  dataPie,
  legendPie,
  optionsPie,
  responsiveOptionsCircle,
  optionsCircle,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  responsivePie,
  legendBar,
} from "variables/Variables.jsx";
import Login from "components/Login";

import {
  Grid,
  Col,
  Button,
  Row,
  Table,
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
import "assets/css/global.css";
import { Map, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import L from "leaflet";
import swal from "sweetalert";
import { Player } from 'video-react';

// import { Button } from "@material-ui/core";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

var _isMounted = false;

L.Icon.Default.mergeOptions({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count_incidents: "",
      count_reports: "",
      resolus: [],
      enCours: [],
      indicateurs: [],
      incident: [],
      data: [],
      incidentsByMonth: [],
      incidentsByWeek: [],
      incidentsByMonthNR: "",
      showRapportModal: false,
      showIncidentModal: false,
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
      },
      newReport: {
        details: "",
        zone: "",
        incident_id: "",
        date_livraison: "",
      },
      userType: sessionStorage.getItem("user_type"),
      list_zones: [],
      user: JSON.parse(sessionStorage.user),
      zones: []
    };
  }

  componentDidMount = () => {
    console.log("userType", this.state.userType);
    if (this.state.userType != "elu") {
      return <Login />;
    } else {
      //this.getIncidents();
      this._getRapports();
      this._getIncidentsResolved();
      this._getIncidentsNotResolved();
      this.getIncidentsByMonth();
      this.getIncidentsByWeek();
      this.getIndicateur();
      this.getZones()
    }
  };

  renderShowIncident = () => {
    // var url = "http://137.74.196.127:8000";
    var url = global.config.url.slice(0, -1)
    let imgUrl = this.state.incident.photo
    let imgIncident = url + `${imgUrl}`
    let audioUrl = this.state.incident.audio
    let audioIncident = url + `${audioUrl}`
    let video = this.state.incident.video
    let videoIncident = url + `${video}`
    const Loader = () => {
      return (
        <div className="loader">
          <h2>Loading video...</h2>
        </div>
      )
    }
    const lattitude = this.state.incident.lattitude
    const longitude = this.state.incident.longitude
    const position = [lattitude, longitude]

    return (
      <div className="modal fade">
        <Modal
          show={this.state.showIncidentModal}
          onHide={this.handleShowIncidentModal}
        >
          <ModalHeader closeButton className="map-color fs-20 t-center">
            Details Incident
          </ModalHeader>

          <ModalBody className="col-sm-12">
            <div className="col-sm-6 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Titre:
              </label>
              <p>{this.state.incident.title}</p>
            </div>
            <div className="col-sm-6">
              <label htmlFor="code" className="map-color fs-18">
                Zone:
              </label>
              <p>{this.state.incident.zone}</p>
            </div>
            <hr />
            <div className="col-sm-12 pb-3">
              {lattitude !== null && longitude !== null ? (
                <Map center={position} zoom={13}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>{this.state.incident.title}</Popup>
                    <Circle center={position} radius={500} color="red"></Circle>
                  </Marker>
                </Map>
              ) : (
                <p className="danger">Coordonnees non renseignees</p>
              )}
            </div>
            <div className="col-sm-12 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Description:
              </label>
              <p>{this.state.incident.description}</p>
            </div>

            <div className="col-sm-12 pb-3">
              <label className="map-color fs-18">Image:</label>
              <img src={imgIncident} alt="" />{' '}
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
            <div className="col-sm-12 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Audio:{' '}
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
    )
  }

  getIncidents = async () => {
    let elu_zone = sessionStorage.zone;
    // var url = global.config.url + "api/incidentbyzone/" + elu_zone + "/";
    var url = global.config.url + "/MapApi/incidentByZone/" + elu_zone + "/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });

      // let data =  []
      // for (let i = 0; i < res.data.length; i++) {
      //   const element = res.data[i];
      //   if (element.lattitude !== null &&
      //   element.longitude !== null && element.lattitude.match(
      //     /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/
      //   ) &&
      //   element.longitude.match(
      //     /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/
      //   )) {
      //     data.push(element)
      //   }
      // }
      //console.log('incident by zone', data)
      //this.setState({ count_incidents: res.data.length });
      this.setState({ data: res.data, count_incidents: res.data.length });
    } catch (error) {
      console.log(error.message);
    }
  };

  getZones = async () => {
    // var url = global.config.url + 'api/zone/'
    var url = global.config.url + '/MapApi/zone/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log('zones=>', res.data)
      let data = res.data['results']
      let user = this.state.user
      //user.customZone = []
      let zones = []
      await data.forEach((element) => {
        user.zones.forEach((user) => {
          //console.log('element', element.id === user)
          if (element.id === user) {
            console.log('in get elus=>', user)
            user = element
            zones.push(element)
          }
        })
      })

      user['zones'] = zones
      //console.log('data', user)
      this.setState({ zones: data, user })

      await this.getIncidentsByZone()
    } catch (error) {
      console.log(error.message)
    }
  }

  onShowIncident = (id) => {
    this.setState({
      inProgress: false,
      showIncidentModal: !this.state.showIncidentModal,
    })
    const item = this.getIncidentById(id)
    console.log(item)
    if (item) {
      console.log('element à afficher ', item)
      this.state.incident = item
    }
  }
  handleShowIncidentModal = () => {
    this.setState({
      inProgress: false,
      showIncidentModal: !this.state.showIncidentModal,
    })
  }

  getIncidentById(id) {
    let incident = ''
    for (let index = 0; index < this.state.data.length; index++) {
      const element = this.state.data[index]
      if (element.id === id) {
        incident = element
      }
    }
    return incident
  }

  getIncidentsByZone = async () => {
    let data = []

    try {
      for (let i = 0; i < this.state.user.zones.length; i++) {
        const element = this.state.user.zones[i];
        // var url =
        //   global.config.url +
        //   'api/incidentbyzone/' +
        //   element.name +
        //   '/'
        var url =
          global.config.url +
          '/MapApi/incidentbyzone/' +
          element.name +
          '/'
        let res = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer '.concat(sessionStorage.token),
          },
        })
        //let messages = res.data
        //console.log(res.data)
        for (let j = 0; j < res.data.length; j++) {
          const elt = res.data[j];
          data.push(elt)
        }
      }
      // console.log('data elu', data)
      this.setState({ data, count_incidents: data.length })
    } catch (error) {
      console.log(error.message)
    }
  }

  getIncidentsByWeek = async () => {
    let elu_zone = sessionStorage.zone;
    // var url = global.config.url + "api/incidentbyweekbyzone/" + elu_zone + "/";
    var url = global.config.url + "/MapApi/IncidentOnWeek_zone/" + elu_zone + "/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });
      // console.log(res.data.data);
      this.setState({ incidentsByWeek: res.data.data });
    } catch (error) {
      console.log(error.message);
    }
  };
  getIncidentsByMonth = async () => {
    let elu_zone = sessionStorage.zone;
    // var url = global.config.url + "api/incidentbymonthbyzone/" + elu_zone + "/";
    var url = global.config.url + "/MapApi/incidentByMonth_zone/" + elu_zone + "/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });
      // console.log(res.data.data)

      this.setState({
        incidentsByMonth: res.data.data,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  _getIncidentsResolved = async () => {
    let elu_zone = sessionStorage.zone;
    console.log(elu_zone);
    // var url = global.config.url + "api/incidentresolved/";
    var url = global.config.url + "/MapApi/incidentResolved/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });
      //  console.log(res.data);
      this.setState({ resolus: res.data.results });
      // this.setState({ data: res.data });
    } catch (error) {
      console.log(error.message);
    }
  };

  getIndicateur = async () => {
    let elu_zone = sessionStorage.zone;

    // var url = global.config.url + "api/indicateurincidentbyzone/" + elu_zone;
    var url = global.config.url + "/MapApi/indicator_incident_zone/" + elu_zone;
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });

      console.log("indicateur", res.data.data);
      var data = res.data.data;
      var labels = [];
      var series = [];
      data.forEach((element) => {
        // if (element.pourcentage != 0.0) {
        //   labels.push(parseFloat(element.pourcentage).toFixed(3))
        //   series.push(parseFloat(element.pourcentage).toFixed(3))
        // }

        // console.log("element", element);

        if (element.number > 0 && element.indicateur != "null") {
          labels.push(element.indicateur + "(" + element.number + ")");
          series.push(element.number);
        }
      });

      var dataPie = {
        labels: labels,
        series: series,
      };


      this.setState({ indicateurs: dataPie });
    } catch (error) {
      console.log(error.message);
    }
  };

  _getIncidentsNotResolved = async () => {
    let elu_zone = sessionStorage.zone;
    // var url = global.config.url + "api/incidentnotresolved/";
    var url = global.config.url + "/MapApi/incidentNotResolved/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });

      this.setState({ enCours: res.data.results });
      // this.setState({ data: res.data });
    } catch (error) {
      console.log(error.message);
    }
  };

  addReport = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    const new_data = {
      details: this.state.newReport.details,
      zone: sessionStorage.zone,
      user_id: sessionStorage.user_id,
      incident: this.state.newReport.incident_id,
      date_livraison: this.state.newReport.date_livraison,
    };

    // var url = global.config.url + "api/rapport/";
    var url = global.config.url + "/MapApi/rapport/";
    console.log(new_data);
    axios
      .post(url, new_data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response);
        swal("Succes", "Rapport commande avec succes", "success");
        this.setState({
          inProgress: !this.state.inProgress,
          showRapportModal: false,
          showIncidentModal: false,
        });
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          swal(error.response.status, error.response.data, error);
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
        } else {
          console.log(error.message);
        }
      });
  };
  onRequestRapport = (item) => {
    this.setState({
      inProgress: false,
      showRapportModal: !this.state.showRapportModal,
      // showIncidentModal: false
    });
    if (item) {
      console.log("Rapport pour ", item);
      this.state.newReport.incident_id = item;
    }
  };
  handleModalClose = () => {
    this.setState({ showRapportModal: !this.state.showRapportModal });
  };

  _getRapports = async () => {
    let user = sessionStorage.user_id;
    // var url = global.config.url + "api/rapportbyuser/" + user + "/";
    var url = global.config.url + "/MapApi/rapport_user/" + user + "/";
    try {
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      });
      let data = res.data;
      // this.setState({ data: data });
      this.setState({ count_reports: data.length });
    } catch (error) {
      console.log(error.message);
    }
  };
  createLegend(json) {
    var legend = [];
    for (var i = 0; i < json["names"].length; i++) {
      var type = "fa fa-circle text-" + json["types"][i];
      legend.push(<i className={type} key={i} />);
      legend.push(" ");
      legend.push(json["names"][i]);
    }
    return legend;
  }
  render() {
    var dataSales = {
      labels: [],
      series: [[]],
    };
    let day = new Date();
    if (day.getDay() === 1) {
      dataSales.labels = ["Lundi"];
    }

    if (day.getDay() === 2) {
      dataSales.labels = ["Lundi", "Mardi"];
    }

    if (day.getDay() === 3) {
      dataSales.labels = ["Lundi", "Mardi", "Mercredi"];
    }

    if (day.getDay() === 4) {
      dataSales.labels = ["Lundi", "Mardi", "Mercredi", "Jeudi"];
    }

    if (day.getDay() === 5) {
      dataSales.labels = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
    }

    if (day.getDay() === 6) {
      dataSales.labels = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
      ];
    }

    if (day.getDay() === 7) {
      dataSales.labels = [
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi",
        "Dimanche",
      ];
    }

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var dataBar = {
      labels: [],
      series: [],
    };
    const total = [];
    const r = [];
    const ntr = [];
    this.state.incidentsByMonth.map((incidentm, id) => {
      var date = new Date(incidentm.month);
      var m = month[date.getMonth()];
      // var d = days[date.getDay()];
      dataBar.labels.push(m);
      total.push(incidentm.total);
      r.push(incidentm.resolved);
      ntr.push(incidentm.unresolved);
    });
    dataBar.series.push(total, r, ntr);

    // By Week
    const totalw = [];
    // this.state.incidentsByWeek.map((incidentw, id) => {
    //   var date = new Date(incidentw.day);
    //   var d = days[date.getDay()];
    //   totalw.push(incidentw.total);
    //   dataSales.series.push(totalw);
    //   dataSales.labels.push(d);
    // });
    if (this.state.incidentsByWeek.length) {
      this.state.incidentsByWeek.map((incidentw, id) => {
        var date = new Date(incidentw.day);

        var d = date.getDay();
        for (let i = 0; i < day.getDay(); i++) {
          //const element = array[i];
          if (i === d) {
            dataSales.series[0][d] = incidentw.total;
          } else {
            dataSales.series[0][i] = 0;
          }
        }
        totalw.push(incidentw.total);
        //dataSales.series[0][d] = incidentw.total
        //dataSales.series.push(totalw);
        //console.log("dataSales", dataSales.series[0][d] , date.getDay(), totalw)
        //dataSales.labels.push(d);
      });
    } else {
      for (let i = 0; i < day.getDay(); i++) {
        dataSales.series[0][i] = 0;
      }
    }

    let positions = [];
    this.state.data.map((incident, idx) => {

      if (incident.lattitude !== null && incident.longitude !== null && !isNaN(incident.longitude) && !isNaN(incident.lattitude)) {
        let pos = {
          id: incident.id,
          lat: incident.lattitude,
          lon: incident.longitude,
          tooltip: incident.title,
          desc: incident.description,
          img: global.config.url.slice(0, -1) + incident.photo,
          etat: incident.etat,
        };

        positions.push(pos);

      }
    });
    // console.log('positions', positions)
    const pos = [];
    {
      positions.map((mark, idx) => {
        if (mark !== null) {
          pos.push(mark.lat, mark.lon);
        }
      });
    }
    const position = [14.716677, -17.467686];

    const iconHTML = ReactDOMServer.renderToString(<i class="fas fa-map-marker-alt fa-2x text-primary "></i>)
    const customMarkerIconBlue = new L.DivIcon({
      html: iconHTML,
    });

    const iconHTMLRed = ReactDOMServer.renderToString(<i class="fas fa-map-marker-alt fa-2x text-danger "></i>)
    const customMarkerIconRed = new L.DivIcon({
      html: iconHTMLRed,
    });

    const map = (
      <Map center={position} zoom={10}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {positions.map((mark, idx) => (


          <Marker
            className="icon-marker"
            key={`marker-${idx}`}
            position={[mark.lat, mark.lon]}
            icon={mark.etat == "resolved" ? customMarkerIconBlue : customMarkerIconRed}

          >
            <Popup>
              <span className="icon-marker-tooltip">
                <ul>
                  <div className="row">
                    <div className="col-md-6">
                      <li>
                        <strong>Titre:</strong> {mark.tooltip}
                      </li>
                      <li>
                        <strong>Description:</strong> {mark.desc}
                      </li>
                    </div>
                    <div className="col-md-6">
                      <img src={mark.img} alt="" />
                    </div>

                  </div>
                  <div className="row">
                    <div className="col-md-2">
                      <button
                        className="boutton  button--round-l "
                        onClick={(e) => this.onShowIncident(mark.id)}>
                        <i className="fa fa-eye" aria-hidden="true"></i>
                      </button>
                    </div>
                    <div className="col-md-10">
                      <button
                        className="boutton  button--round-l"
                        onClick={(e) => this.onRequestRapport(mark.id)}>
                        <i className="fa fa-file" aria-hidden="true"></i>{" "}
                        Commander un rapport
                      </button>
                    </div>
                  </div>
                </ul>
              </span>
            </Popup>
          </Marker>
        ))}
      </Map>
    );

    const incidentsrs = [];
    const incidentsnrs = [];
    this.state.resolus.map((rs, id) => {
      if (rs.zone === sessionStorage.zone) {
        incidentsrs.push(rs);
      }
    });

    this.state.enCours.map((nrs, id) => {
      if (nrs.zone === sessionStorage.zone) {
        incidentsnrs.push(nrs);
      }
    });
    let showRapportModal = (
      <Modal show={this.state.showRapportModal} onHide={this.handleModalClose}>
        <ModalHeader closeButton>Commande de rapport</ModalHeader>
        <Form>
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-12">
              <label htmlFor="from">Details:</label>
              <textarea
                className="form-control"
                type="text"
                id="prenom"
                name="details"
                placeholder="Les details du rapport"
                value={this.state.newReport.details}
                onChange={(e) => {
                  let { newReport } = this.state;
                  newReport.details = e.target.value;
                  this.setState({ newReport }, console.log(this.state));
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Zone:</label>
              <input
                className="form-control"
                type="text"
                id="nom"
                name="zone"
                value={sessionStorage.zone}
                onChange={(e) => {
                  let { newReport } = this.state;
                  newReport.zone = e.target.value;
                  this.setState({ newReport }, console.log(this.state));
                }}
                disabled
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              {<label htmlFor="email">Incident Concerne:</label>}
              <input
                className="form-control"
                type="text"
                id="incident"
                name="incident"
                // placeholder={this.state.newIncident.id}
                value={this.state.newReport.incident_id}
                onChange={(e) => {
                  let { newReport } = this.state;
                  newReport.incident_id = e.target.value;
                  this.setState({ newReport }, console.log(this.state));
                }}
                disabled
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="phone">Date souhaite de Livraison:</label>
              <input
                className="form-control"
                type="date"
                id="phone"
                name="date_livraison"
                value={this.state.newReport.date_livraison}
                onChange={(e) => {
                  let { newReport } = this.state;
                  newReport.date_livraison = e.target.value;
                  this.setState({ newReport }, console.log(this.state));
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.addReport}>
                Ajouter
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{" "}
            <Button className="btn btn-danger" onClick={this.handleModalClose}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );

    return (
      <div className="content">
        <Row>
          <Col lg={4} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-graph1 text-danger" />}
              statsText={
                <h3 className="elu-dashboard-count-title"> Incidents </h3>
              }
              statsValue={
                <div className="elu-dashboard-counter">
                  {" "}
                  {this.state.count_incidents}
                </div>
              }
            // statsIcon={<i className="fa fa-clock-o" />}
            // statsIconText="In the last hour"
            />
          </Col>
          <Col lg={4} sm={6}>
            <div className="card card-stats">
              <div className="content">
                <Row>
                  <Col xs={3}>
                    <div className="icon-big text-center icon-warning">
                      {<i className="pe-7s-server text-warning" />}
                    </div>
                  </Col>
                  <Col xs={9}>
                    <div className="numbers">
                      <h3 className="elu-dashboard-count-title">
                        Etat des incidents
                      </h3>
                      <div className="text-card-details-container">
                        <div className="text-card-details">
                          <span className="text-card-number-infos">
                            {incidentsnrs.length}
                          </span>
                          &nbsp;
                          <span className="text-card-number-label">
                            résolu(s)
                          </span>
                        </div>
                        <div className="text-card-details">
                          <span className="text-card-number-infos">
                            {incidentsrs.length}
                          </span>
                          &nbsp;
                          <span className="text-card-number-label">
                            en cours
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    {/* {<i className="fa fa-refresh" />} */}
                  </div>
                </div>
              </div>
            </div>
            {/* <StatsCard
                bigIcon={<i className="pe-7s-server text-warning" />}
                statsText="Etat des incidents"
                statsValue="resolus"
                statsValue="en-cours"
                statsIcon={<i className="fa fa-refresh" />}
                statsIconText="Updated now"
              /> */}
          </Col>
          <Col lg={4} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-wallet text-success" />}
              statsText={
                <h3 className="elu-dashboard-count-title">
                  {" "}
                  Rapports Commandes{" "}
                </h3>
              }
              statsValue={
                <div className="elu-dashboard-counter">
                  {" "}
                  {this.state.count_reports}{" "}
                </div>
              }
            // statsIcon={<i className="fa fa-calendar-o" />}
            // statsIconText="Last day"
            />
          </Col>

          {/* <Col lg={3} sm={6}>
            <StatsCard
              bigIcon={<i className="fa fa-star text-info" />}
              statsText={<h3 className="elu-dashboard-count-title"> Badge </h3>}
              statsValue={<div className="elu-dashboard-counter"> --- </div>}
              // statsIcon={<i className="fa fa-refresh" />}
              // statsIconText="Updated now"
            />
          </Col> */}
        </Row>
        <br />
        <Row>
          <Col md={5}>
            <Card
              id="chartActivity"
              title="Incidents"
              category="Les incidents selon leur état"
              stats="Etat des incidents"
              statsIcon="fa fa-check"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={dataBar}
                    type="Bar"
                    options={optionsBar}
                    responsiveOptions={responsiveBar}
                  />
                </div>
              }
              legend={
                <div className="legend">{this.createLegend(legendBar)}</div>
              }
            />
          </Col>

          <Col md={7}>
            <Card
              id="chartActivity"
              title="Indicateurs"
              category="Nombre incidents par indicateur"
              statsIcon="fa fa-check"
              stats="Indicateurs"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={this.state.indicateurs}
                    type="Pie"
                    options={optionsCircle}
                    responsiveOptions={responsiveOptionsCircle}
                  />
                </div>
              }
              legend={
                <div className="legend"> </div>
              }
            />
          </Col>

          {/* <Col md={6}>
            <Card
              title="Indicateurs"
              // category="Backend development"
              // stats="Updated 3 minutes ago"
              // statsIcon="fa fa-history"
              content={
                <ChartistGraph
                  data={this.state.indicateurs}
                  type="Pie"
                  options={optionsPie}
                />
              }
              legend={
                <div className="legend">
                  // {this.createLegend(legendPie)} 
                </div>
              }
            />
          </Col> */}
        </Row>
        <br />
        <Row>
          <Col md={12}>
            <Card
              id="chartActivity"
              title="Bilan Hebdomadaire"
              category="Nombres d'incidents de la semaine"
              stats="Incidents par jour"
              statsIcon="fa fa-check"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={dataSales}
                    type="Line"
                    options={optionsSales}
                    responsiveOptions={responsiveSales}
                  />
                </div>
              }
              legend={
                <div className="legend">{this.createLegend(legendSales)}</div>
              }
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} sm={12}>
            <Card
              id="map"
              title="Carte des Incidents dans votre zone"
              category="Tous les incidents"
              // stats="Data information certified"
              // statsIcon="fa fa-map"
              content={<div className="map">{map}</div>}
            />
          </Col>
        </Row>
        {showRapportModal}
        {this.renderShowIncident()}
      </div>


    );
  }
}

export default Dashboard;
