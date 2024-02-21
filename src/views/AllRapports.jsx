import React, { Component } from "react";
import {
  Grid,
  Col,
  Row,
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
import Select from "react-select";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import { Tasks } from "components/Tasks/Tasks.jsx";
import { Link, withRouter } from "react-router-dom";
import {
  dataPie,
  legendPie,
  dataSales,
  optionsSales,
  responsiveSales,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
} from "variables/Variables.jsx";
import ChartistGraph from "react-chartist";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Moment from 'moment';


export default class AllRapports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      inProgress: false,
      newRapport: {},
      newIncident: {
        title: "",
        zone: "",
        description: "",
        photo: "",
      },
      incidents: [],
      newRapportModal: false,
      showRapportModal: false,
      visible: false,
      error: false,
      message: [],
      count_rapports: "",
      rapports_dispo: "",
      rapports_nondispo: "",
      show: false,
      itemDelete: {},
      open: false,
      uploadItem: {},
      file: null,
    };
  }

  componentDidMount = () => {
    this._getRapports();
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

  _getRapports = async () => {
    let user = sessionStorage.user_id;
    var url = global.config.url + "api/rapport/";
    try {
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      });
      let data = res.data.results;
      await this._getIncidents();
      data.forEach((element) => {
        element.customIncidents = [];
        element.incidents.forEach((z) => {
          this.state.incidents.forEach((el) => {
            if (z === el.id) {
              //   console.log("in get elus=>", el);
              element.customIncidents = [...element.customIncidents, el];
            }
          });
        });
      });
      console.log("allRapport=>", data);
      this.setState({ data, count_rapports: data.length });
      var dispo = 0;
      var non_dispo = 0;
      this.setState({ rapports_dispo: dispo, rapports_nondispo: non_dispo });
      this.state.data.map((item, i) => {
        if (item.disponible) {
          dispo = dispo + 1;
          return this.setState({ rapports_dispo: dispo });
        } else {
          non_dispo = non_dispo + 1;
          return this.setState({ rapports_nondispo: non_dispo });
        }
      });
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  _getIncidents = async () => {
    let elu_zone = sessionStorage.zone;
    var url = global.config.url + "api/incident/";
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          "Content-Type": "application/json",
        },
      });
      //console.log(res.data)
      let data = res.data;
      console.log("data incident", data);
      // let data = res.data;
      this.setState({ incidents: data.results });
    } catch (error) {
      console.log(error.message);
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

  handleModalOpen = () => {
    this.setState({ showRapportModal: !this.state.showRapportModal });
  };

  onShowRapport = (item) => {
    this.setState({
      inProgress: false,
      showRapportModal: !this.state.showRapportModal,
    });
    if (item) {
      console.log("element à afficher ", item);
      // this.state.newRapport = item;
      this.setState({ newRapport: item });
    }
  };

  openRapport = (item) => {
    this.setState({
      inProgress: false,
      open: !this.state.open,
    });
    if (item) {
      console.log("element à soummettre ", item);
      this.setState({ uploadItem: item });
    }
  };

  uploadRapportModal = () => {
    this.setState((prevState) => {
      return { open: !prevState.open };
    });
    if (this.state.open === false) {
      this.setState({
        uploadItem: {
          details: "",
          zone: "",
          date_livraison: "",
          disponible: "",
          incident: "",
        },
      });
    }
  };

  onFileChange = (e) => {
    e.persist();
    let { file } = this.state;
    file = e.target.files[0];
    this.setState({ file }, () => console.log("file", e.target.files[0].name));
  };

  handleShowRapportModal = () => {
    this.setState((prevState) => {
      return { showRapportModal: !prevState.showRapportModal };
    });
    if (this.state.showRapportModal === false) {
      this.setState({
        newRapport: {
          details: "",
          zone: "",
          date_livraison: "",
          disponible: "",
          incident: "",
        },
      });
    }
  };

  uploadRapport = async (e) => {
    e.preventDefault();
    let { uploadItem, file } = this.state;
    this.setState({ inProgress: true });
    uploadItem.disponible = true;
    uploadItem.file = file;
    console.log("uploadItem=>", uploadItem);
    var url = global.config.url + "api/rapport/" + uploadItem.id + "/";
    try {
      if (file) {
        let formData = new FormData();
        formData.append("disponible", uploadItem.disponible);
        formData.append("file", uploadItem.file);
        let request = await axios.put(url, formData, {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: "Bearer ".concat(sessionStorage.token),
          },
        });
        console.log("upload Response=>", request);
        swal("Succès", "Votre rapport a été soumis", "success");
        this.setState({
          inProgress: false,
          open: false,
          uploadItem: {},
        });
        //document.getElementById("formR").reset();
        // swal("Succes", "Votre rapport a ete commande", "success");
        this._getRapports();
      }
    } catch (error) {
      this.setState({ inProgress: false });
      if (error.response) {
        console.log(error.response.status);
        swal("Erreur", "Erreur lors de l'ajout, veuillez reessayer", "error");
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request.data);
      } else {
        console.log(error.message);
      }
    }
  };

  updateReport = (e) => {
    e.preventDefault();
    this.state.newRapport["statut"] = "edit";
    if (this.state.newRapport.user_id) {
      this.state.newRapport["user_id"] = this.state.newRapport.user_id.id;
    }

    var url =
      global.config.url + "api/rapport/" + this.state.newRapport.id + "/";
    axios
      .put(url, this.state.newRapport, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response);
        swal("Succès", "Votre rapport a été commandé.", "success");
        this.setState({
          inProgress: !this.state.inProgress,
          showRapportModal: false,
          newRapport: {},
        });
        //document.getElementById("formR").reset();
        // swal("Succes", "Votre rapport a ete commande", "success");
        this._getRapports();
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error.response) {
          console.log(error.response.status);
          swal("Erreur", "Erreur lors de l'ajout, veuillez reessayer", "error");
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request.data);
        } else {
          console.log(error.message);
        }
      });
  };

  onDelete = (item) => {
    // e.preventDefault()
    //this.setState({ editIndic: item })
    this.setState({ itemDelete: item });
    swal({
      title: 'Voulez vous vraiment annuler ce rapport ',
      // text:
      //   'Once deleted, you will not be able to recover this imaginary file!',
      icon: 'warning',
      buttons: ["Non", "Oui"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {

        this.deleteRapport()

      } else {
        swal('Suppression annulée!')
      }
    })
  }

  onDeleteRapport = (item) => {
    if (item) {
      window.scrollTo(0, 0);
      console.log("element à supprimer ", item);
      this.setState({ itemDelete: item });
    }
    this.setState({ show: true });
  };

  deleteRapport = () => {
    this.setState({ inProgress: true });
    // e.preventDefault();
    // console.log(this.state.itemDelete.id)
    this.state.itemDelete["statut"] = "canceled";
    if (this.state.itemDelete.user_id) {
      this.state.itemDelete["user_id"] = this.state.itemDelete.user_id.id;
    }

    var url =
      global.config.url + "api/rapport/" + this.state.itemDelete.id + "/";
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer ".concat(sessionStorage.token),
      },
    };
    //console.log('url', url)
    axios
      .delete(url, config)
      .then((response) => {
        this.setState({ inProgress: !this.state.inProgress });
        this.setState({ show: false });
        this._getRapports();

        swal('Rapport annulé !', {
          icon: 'success',
        })
        console.log(response);
        this.setState({
          itemDelete: {},
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
        this.setState({ show: false });
      });
  };

  handleMultiChange = (e, choice) => {
    console.log("test=>", choice);
    let newRapport = this.state.newRapport;
    let { user } = this.state;
    if (choice.action === "select-option") {
      let index = newRapport.incidents.findIndex(
        (f) => f === choice.option.value
      );
      // console.log("index=>", index);
      console.log("int", String(choice.option.value));
      if (index === -1) {
        newRapport.incidents.push(String(choice.option.value));
      }
    }
    if (choice.action === "remove-value") {
      // console.log("choice=>", newRapport.incidents,  choice.removedValue.id);
      let index = newRapport.incidents.findIndex(
        (f) => parseInt(f) === choice.removedValue.value
      );
      if (index !== -1) {
        newRapport.incidents.splice(index);
      }
      // console.log("choice=>", newRapport.incidents);
    }
    if (choice.action === "clear") {
      //console.log('choice=>')
      newRapport.incidents = [];
    }
    // console.log('newRapport.incidents=>', newRapport['incidents'])
    this.setState({ newRapport });
  };

  render() {
    // let { data } = this.state;
    let optionsIncident = this.state.incidents.map(function (incident) {
      return {
        value: incident.id,
        label: incident.title,
        key: incident.id + "unique-key",
      };
    });

    const types = [
      {
        id: 1,
        value: "zone",
        label: "Zone",
      },
      {
        id: 2,
        value: "detaille",
        label: "Detaille",
      },
    ];

    let filterData = [];
    if (
      this.state.newRapport &&
      this.state.newRapport.incidents !== undefined
    ) {
      //console.log('teste', this.state.newRapport)
      if (this.state.newRapport.incidents.length && optionsIncident.length) {
        for (let i = 0; i < optionsIncident.length; i++) {
          const element = optionsIncident[i];
          for (let j = 0; j < this.state.newRapport.incidents.length; j++) {
            const elt = this.state.newRapport.incidents[j];
            // console.log(elt, element)
            if (parseInt(elt) === parseInt(element.value)) {
              filterData.push(element);
            }
          }
        }
      }
    }

    //console.log('ee', filterData)

    const columns = [
      {
        name: "details",
        label: "Details",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "zone",
        label: "Zone",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "date_livraison",
        label: "Date Livraison",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "disponible",
        label: "Disponible",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "incident",
        label: "Incident",
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: "status",
        label: "Etat",
        options: {
          sort: true,
          filter: false,
          filterType: "dropdown",
        },
      },
      {
        name: "rapport",
        label: "Rapport",
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
        },
      },
    ];

    const data = this.state.data.map((item, i) => {
      var url = `https://backend-dashboard.map-action.com${item.file}`;
      var dispo = "";

      if (item.disponible) {
        dispo = "oui";
      } else {
        dispo = "non";
      }
      return [
        item.details,
        item.zone,
        Moment(item.date_livraison).format('DD/MM/YYYY'),
        dispo,
        item.customIncidents.map((c) => c.title + " ,"),
        item.statut === "new" && item.disponible === false ? (
          <span className="label label-info">Nouveau</span>
        ) : item.statut === "edit" && item.disponible === false ? (
          <span className="label label-warning">Modifié</span>
        ) : item.statut === "canceled" && item.disponible === false ? (
          <span className="label label-danger">Annulé</span>
        ) : item.disponible === true ? (
          <span className="label label-success">Traité</span>
        ) : null,
        <div className="btn-group">
          {(item.statut === "new" && item.disponible === false) ||
            (item.statut === "edit" && item.disponible === false) ? (
            <Button
              onClick={() => this.openRapport(item)}
              className="btn btn-default btn-xs map-color nb"
            >
              <i className="fas fa-folder-open">Ouvrir un fichier</i>
            </Button>
          ) : item.disponible === true && item?.file ? (
            <a
              className="label label-success"
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              download
            >
              Telecharger le rapport
            </a>
          ) : (
            <span className="label label-warning">Fichier non disponible</span>
          )}
        </div>,
        <div className="btn-group">
          <Button
            onClick={(e) => this.onShowRapport(item)}
            className="btn btn-default btn-xs map-color nb"
          >
            <i className="fas fa-edit fa-x"></i>
          </Button>
          <Button
            className="btn btn-danger btn-xs red-color nb"
            onClick={(e) => {
              // this.onDeleteRapport(item);
              this.onDelete(item)
              this.setState({ inProgress: false });
            }}
          >
            <i className="fas fa-trash fa-x"></i>
          </Button>{" "}
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

    let modalRapport = (
      <Modal show={this.state.open} onHide={this.uploadRapportModal}>
        <ModalHeader closeButton>
          <span className="map-color">{`Rapport: ${this.state.uploadItem.details}`}</span>
        </ModalHeader>
        <ModalBody>
          <Form encType="multipart/form-data">
            <Row>
              <Col md={6}>
                <FormGroup>
                  <input
                    type="file"
                    name="file"
                    onChange={(e) => this.onFileChange(e)}
                    placeholder="upload rapport"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                {!this.state.inProgress ? (
                  <Button
                    className="btn btn-white btn-round"
                    onClick={this.uploadRapport}
                    disabled={!this.state.file}
                  >
                    Envoyer
                  </Button>
                ) : (
                  <Button className="btn  btn-white btn-round">
                    Loading...
                    <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                  </Button>
                )}{" "}
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Button
                    className="btn btn-red btn-round"
                    onClick={this.uploadRapportModal}
                  >
                    Annuler
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    );

    return (
      <div className="content">
        {this.state.show && (
          <Alert
            bsStyle="danger"
            onDismiss={(e) => this.setState({ show: false })}
          >
            <h4>Attention!!!</h4>
            <p>Voulez vous vraiment annuler ce rapport ?</p>
            <p>
              {!this.state.inProgress ? (
                <Button bsStyle="danger" onClick={this.deleteRapport}>
                  Oui
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
        )}
        <Row>
          <Col lg={4} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-file text-warning" />}
              statsText="Rapports Commandes"
              statsValue={this.state.count_rapports}
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Vos Rapports"
            />
          </Col>
          <Col lg={4} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-wallet text-success" />}
              statsText="Rapports Disponibles"
              statsValue={this.state.rapports_dispo}
              statsIcon={<i className="fa fa-calendar-o" />}
              statsIconText="Rapports livres"
            />
          </Col>
          <Col lg={4} sm={6}>
            <StatsCard
              bigIcon={<i className="pe-7s-graph1 text-danger" />}
              statsText="Rapports Non Disponibles"
              statsValue={this.state.rapports_nondispo}
              statsIcon={<i className="fa fa-clock-o" />}
              statsIconText="Rapports en attente"
            />
          </Col>
        </Row>
        {/* <Button
          style={btnStyle}
          onClick={() => this.props.history.push("/admin/add-rapport")}
          className="pull-right"
        >
          Nouveau Rapport
        </Button> */}

        {/* <Link
                            to={{
                            pathname: "/add-rapport",
                            }}><Button className="pull-right" > Nouveau Rapport</Button></Link>
                 */}
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={"Liste des Rapports"}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
        {/* {this.renderShowIncident()} */}
        {modalRapport}
        <div className="modal fade">
          <Modal
            show={this.state.showRapportModal}
            onHide={this.handleShowRapportModal}
          >
            <ModalHeader closeButton className="map-color fs-20 t-center">
              Details Rapport
            </ModalHeader>

            <Form encType="multipart/form-data">
              <ModalBody className="col-sm-12">
                <FormGroup className="col-sm-6">
                  <p className="title mt-3">Type de Rapports:</p>
                  <div>
                    {types.map((choice, i) => {
                      return (
                        <div key={i}>
                          <input
                            type="radio"
                            name="type"
                            checked={
                              this.state.newRapport.type &&
                              this.state.newRapport.type === choice.value
                            }
                            value={choice.value}
                            onChange={(e) => {
                              let { newRapport } = this.state;
                              newRapport.type = e.target.value;
                              this.setState(
                                { newRapport },
                                console.log(this.state.newRapport)
                              );
                            }}
                          />
                          <label>{choice.label}</label>
                        </div>
                      );
                    })}
                    {/* <input type="radio" value="zone" name="type" /> Zone <br />
                  <input type="radio" value="detaille" name="type" /> Detaille */}
                  </div>
                </FormGroup>

                <FormGroup className="col-sm-6">
                  <p className="title mt-3">Validation du rapport:</p>
                  <div>
                    <input
                      type="checkbox"
                      name="disponible"
                      id="disponible"
                      defaultChecked={this.state.newRapport.disponible}
                      onChange={(e) => {
                        let { newRapport } = this.state;
                        if (e.target.checked === true) {
                          newRapport.disponible = true;
                          this.setState(
                            { newRapport },
                            console.log(this.state.newRapport)
                          );
                        } else {
                          newRapport.disponible = false;
                          this.setState(
                            { newRapport },
                            console.log(this.state.newRapport)
                          );
                        }
                      }}
                    />
                    <label htmlFor="disponible">Disponible</label>
                    {/* <input type="radio" value="zone" name="type" /> Zone <br />
                  <input type="radio" value="detaille" name="type" /> Detaille */}
                  </div>
                </FormGroup>

                <FormGroup className="col-sm-12">
                  <label htmlFor="from">Details:</label>
                  <textarea
                    className="form-control"
                    type="text"
                    id="prenom"
                    name="details"
                    value={this.state.newRapport.details}
                    onChange={(e) => {
                      let { newRapport } = this.state;
                      newRapport.details = e.target.value;
                      this.setState(
                        { newRapport },
                        console.log(this.state.newRapport)
                      );
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
                      let { newRapport } = this.state;
                      newRapport.zone = e.target.value;
                      this.setState(
                        { newRapport },
                        console.log(this.state.newRapport)
                      );
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
                    name="incidents"
                    value={filterData}
                    options={optionsIncident}
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
                    value={this.state.newRapport.date_livraison}
                    onChange={(e) => {
                      let { newRapport } = this.state;
                      newRapport.date_livraison = e.target.value;
                      this.setState(
                        { newRapport },
                        console.log(this.state.newRapport)
                      );
                    }}
                  />
                </FormGroup>
                <p></p>
                <FormGroup className="col-sm-6">
                  {!this.state.inProgress ? (
                    <Button
                      className="btn btn-white btn-round"
                      onClick={this.updateReport}
                    >
                      Modifer
                    </Button>
                  ) : (
                    <Button className="btn  btn-white btn-round">
                      Loading...
                      <i
                        className="fa fa-spin fa-spinner"
                        aria-hidden="true"
                      ></i>
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
                <div className="col-sm-12 pb-3">
                  <label htmlFor="code" className="map-color fs-18">
                    Details:
                  </label>
                  <p>{this.state.newRapport.details}</p>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="code" className="map-color fs-18">
                    Zone:
                  </label>
                  <p>{this.state.newRapport.zone}</p>
                </div>
                <hr />

                <div className="col-sm-6 pb-3">
                  <label htmlFor="code" className="map-color fs-18">
                    Date Livraison:
                  </label>
                  <p>{this.state.newRapport.date_livraison}</p>
                </div>
                <div className="col-sm-6 pb-3">
                  <label htmlFor="code" className="map-color fs-18">
                    Incident:
                  </label>
                  <p>{this.state.newRapport.incident}</p>
                </div>

                {this.state.newRapport.user_id ?
                  <div className="col-sm-12 pb-3">
                    <div className="col-sm-6 pb-3">
                      <label htmlFor="code" className="map-color fs-18">
                        Prenom Organisation :
                      </label>
                      <p>{this.state.newRapport.user_id.first_name}</p>
                    </div>
                    <div className="col-sm-6 pb-3">
                      <label htmlFor="code" className="map-color fs-18">
                        Nom Organisation :
                      </label>
                      <p>{this.state.newRapport.user_id.last_name}</p>
                    </div>
                    <div className="col-sm-6 pb-3">
                      <label htmlFor="code" className="map-color fs-18">
                        Email Organisation :
                      </label>
                      <p>{this.state.newRapport.user_id.email}</p>
                    </div>
                    <div className="col-sm-6 pb-3">
                      <label htmlFor="code" className="map-color fs-18">
                        Téléphone Organisation :
                      </label>
                      <p>{this.state.newRapport.user_id.phone}</p>
                    </div>
                  </div>
                  : null
                }

              </ModalBody>
              <ModalFooter></ModalFooter>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}
