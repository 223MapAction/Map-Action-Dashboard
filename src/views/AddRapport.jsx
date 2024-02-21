import React, { Component } from "react";
import { Grid, Col, Row, Button, FormGroup, Form } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import swal from "sweetalert";
// import makeAnimated from 'react-select/lib/animated';

export default class AddRapport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newReport: {
        details: "",
        type: "",
        zone: "",
        incident_id: [],
        date_livraison: "",
      },
      report: "",
      incidents: [],
      incidents_rapport: [],
      visualisation: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onValueChange = this.onValueChange.bind(this);
  }

  componentDidMount = () => {
    this._getIncidents();
  };

  _getIncidents = async () => {
    let elu_zone = sessionStorage.zone;
    var url = global.config.url + "api/incidentbyzone/" + elu_zone + "/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      let data = res.data;
      console.log(data);
      // let data = res.data;
      this.setState({ incidents: data });
    } catch (error) {
      console.log(error.message);
    }
  };
  handleChange(event) {
    // this.setState({report: event.target.value});
    // const target = event.target;
    // const value = target.name === 'type' ? target.checked : target.value;
    // const name = target.name;
    console.log(event.target.value);
    this.state.newReport.type = event.target.value;
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value,
    });
    console.log(this.state.selectedOption);
  }

  handleMultiChange = (selectedOption) => {
    let idinc = [];
    if (selectedOption) {
      selectedOption.map((inc, id) => {
        idinc.push(inc.value);
      });
    }

    this.state.newReport.incident_id = idinc;
    console.log(this.state.newReport.incident_id);
  };

  // Close Modal
  handleModalClose = () => {
    this.setState({ visualisation: !this.state.visualisation });
  };

  addReport = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    var new_data = "";
    if (this.state.newReport.type === "zone") {
      new_data = {
        details: this.state.newReport.details,
        zone: sessionStorage.zone,
        user_id: sessionStorage.user_id,
        incidents: this.state.newReport.incident_id,
        date_livraison: this.state.newReport.date_livraison,
        type: this.state.newReport.type,
        disponible: false,
      };
      var url = global.config.url + "api/rapportonzone/";
      axios
        .post(url, new_data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ".concat(sessionStorage.token),
          },
        })
        .then((response) => {
          console.log(response);
          this.setState({
            inProgress: !this.state.inProgress,
            showRapportModal: false,
            showIncidentModal: false,
            newReport: {
              details: "",
              type: "",
              zone: "",
              incident_id: [],
              date_livraison: "",
            },
          });
          document.getElementById("formR").reset();
          this._getIncidents();
          swal("Succès", "Votre rapport a été commandé.", "success");
        })
        .catch((error) => {
          this.setState({ inProgress: !this.state.inProgress });
          if (error.response) {
            console.log(error.response.status);
            swal(
              "Erreur",
              "Erreur lors de l'ajout, veuillez réessayer",
              "error"
            );
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request.data);
          } else {
            console.log(error.message);
          }
        });
    } else {
      new_data = {
        details: this.state.newReport.details,
        zone: sessionStorage.zone,
        user_id: sessionStorage.user_id,
        incident: this.state.newReport.incident_id[0],
        date_livraison: this.state.newReport.date_livraison,
        type: this.state.newReport.type,
        disponible: false,
      };
      var url = global.config.url + "api/rapport/";
      axios
        .post(url, new_data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ".concat(sessionStorage.token),
          },
        })
        .then((response) => {
          console.log(response);
          this.setState({
            inProgress: !this.state.inProgress,
            showRapportModal: false,
            showIncidentModal: false,
            newReport: {
              details: "",
              type: "",
              zone: "",
              incident_id: [],
              date_livraison: "",
            },
          });
          document.getElementById("formR").reset();
          swal("Succès", "Votre rapport a été commandé.", "success");
        })
        .catch((error) => {
          this.setState({ inProgress: !this.state.inProgress });
          if (error.response) {
            console.log(error.response.status);
            swal(
              "Erreur",
              "Erreur lors de l'ajout, veuillez reessayer",
              "error"
            );
            console.log(error.response.data);
          } else if (error.request) {
            console.log(error.request.data);
          } else {
            console.log(error.message);
          }
        });
    }
  };
  render() {
    const dataOptionsList = this.state.incidents.map((dataOption, index) => {
      return (
        <option key={index} value={dataOption.id}>
          {dataOption.title}
        </option>
      );

      // { key:index,value: dataOption.id, label :dataOption.title,color: '#00B8D9'}
    });
    let options = this.state.incidents.map(function (incident) {
      return {
        value: incident.id,
        label: incident.title + "-" + incident.description,
        key: incident.id + "unique-key",
      };
    });

    return (
      <div className="content">
        <h3 className="map-color">Commande de rapports d’inspection </h3>
        <Row>
          <Col lg={6} sm={6}>
            <Form className="text-white" id="formR">
              <FormGroup className="col-sm-12">
                <p className="title mt-3">Type de Rapports:</p>
                <div onChange={this.handleChange}>
                  <input type="radio" value="zone" name="type" /> Zone <br />
                  <input type="radio" value="detaille" name="type" /> Detaille
                </div>
              </FormGroup>

              <FormGroup className="col-sm-12">
                <label htmlFor="from">Details:</label>
                <textarea
                  className="form-control"
                  type="text"
                  id="prenom"
                  name="details"
                  value={this.state.newReport.details}
                  onChange={(e) => {
                    let { newReport } = this.state;
                    newReport.details = e.target.value;
                    this.setState({ newReport }, console.log(this.state));
                  }}
                />
              </FormGroup>
              <FormGroup className="col-sm-3">
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
              <FormGroup className="col-sm-4">
                <label htmlFor="">Type:</label>
                <Select
                  className="mt-4 col-md-6 col-offset-4"
                  // components={makeAnimated()}
                  isMulti
                  name="incidents_rapport"
                  options={options}
                  className="basic-multi-select map-color"
                  onChange={this.handleMultiChange}
                  classNamePrefix="select"
                />
              </FormGroup>
              <FormGroup className="col-sm-5">
                <label htmlFor="phone">Date livraison:</label>
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
              <p></p>
              <FormGroup className="col-sm-6">
                {!this.state.inProgress ? (
                  <Button
                    className="btn btn-white btn-round"
                    onClick={this.addReport}
                  >
                    Ajouter
                  </Button>
                ) : (
                  <Button className="btn  btn-white btn-round">
                    Loading...
                    <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                  </Button>
                )}{" "}
              </FormGroup>

              <FormGroup className="col-sm-6">
                <Button
                  className="btn btn-red btn-round"
                  onClick={this.handleModalOpen}
                >
                  Annuler
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
