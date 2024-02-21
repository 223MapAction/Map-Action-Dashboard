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
import { StatsCard } from "components/StatsCard/StatsCard.jsx";

import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import swal from "sweetalert";

export default class Indicateurs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      inProgress: false,
      newIndic: {
        name: "",
      },
      editIndic: {},
      editIndicModal: false,
      newIndicateurModal: false,
    };
  }

  componentDidMount = () => {
    this._getIndicateurs();
  };

  _getIndicateurs = async () => {
    let user = sessionStorage.user_id;
    // var url = global.config.url + "api/indicateur/";
    var url = global.config.url + "/MapApi/indicator/";
    try {
      let res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      });
      // console.log(res.data);
      let data = res.data.results;
      this.setState({ data: data });
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
    this.setState({ showIndicModal: !this.state.showIndicaModal });
  };
  handleModalClose = () => {
    this.setState({ showIndicModal: false });
  };

  handleEditModalToggle = () => {
    this.setState({ editIndicModal: !this.state.editIndicModal })
  }

  onAddIndicateur = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });
    const new_data = {
      name: this.state.newIndic.name,
    };

    // var url = global.config.url + "api/indicateur/";
    var url = global.config.url + "/MapApi/indicator/";
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
        this.setState({
          inProgress: !this.state.inProgress,
          showRapportModal: false,
          showIncidentModal: false,
        });
        this._getIndicateurs();
        swal("Succes", "Indicateur Ajoute avec succes", "success");
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

  onEditIndicateur = (e) => {
    e.preventDefault();
    this.setState({ inProgress: !this.state.inProgress });


    // var url = global.config.url + "api/indicateur/" + this.state.editIndic?.id + "/";
    var url = global.config.url + "/MapApi/indicator/" + this.state.editIndic?.id + "/";
    console.log(this.state.editIndic);
    axios
      .put(url, this.state.editIndic, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          inProgress: !this.state.inProgress,
          editIndic: {},
          editIndicModal: false,
        });
        this._getIndicateurs();
        swal("Succes", "Indicateur Ajoute avec succes", "success");

      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error?.response) {
          console.log(error?.response?.status);
          swal("Erreur", "Erreur lors de la modification, veuillez reessayer", "error");
          console.log(error?.response?.data);
        } else if (error?.request) {
          console.log(error?.request?.data);
        } else {
          console.log(error?.message);
        }
      });
  };

  onDeleteIndicateur = () => {
    this.setState({ inProgress: !this.state.inProgress });


    // var url = global.config.url + "api/indicateur/" + this.state.editIndic?.id + "/";
    var url = global.config.url + "MapApi/indicatorr/" + this.state.editIndic?.id + "/";
    console.log(this.state.editIndic);
    axios
      .delete(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ".concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response);
        this.setState({
          inProgress: !this.state.inProgress,
          editIndic: {},
          editIndicModal: false,
        });
        swal('Indicateur supprimé!', {
          icon: 'success',
        })
        this._getIndicateurs();
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress });
        if (error?.response) {
          console.log(error?.response?.status);
          swal("Erreur", "Erreur lors de la suppression, veuillez reessayer plus tard", "error");
          console.log(error?.response?.data);
        } else if (error?.request) {
          console.log(error?.request?.data);
        } else {
          console.log(error?.message);
        }
      });
  };

  handleEdit = (item) => {
    this.setState({ editIndic: item, editIndicModal: true })
  }

  onDelete = (e, item) => {
    e.preventDefault()
    this.setState({ editIndic: item })
    swal({
      title: 'Êtes vous sûr de vouloir supprimer cet indicateur?',
      // text:
      //   'Once deleted, you will not be able to recover this imaginary file!',
      icon: 'warning',
      buttons: ["Non", "Oui"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {

        this.onDeleteIndicateur()

      } else {
        swal('Suppression annulée!')
      }
    })
  }

  render() {
    // let { data } = this.state;

    const columns = [
      {
        name: "id",
        label: "Id",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: "name",
        label: "Name",
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
        }
      },
    ];

    const data = this.state.data.map((item, i) => {
      return [
        item.id,
        item.name,
        <div className="btn-group">
          <Button
            onClick={(e) => this.handleEdit(item)}
            className="btn btn-default btn-xs map-color nb"
          >
            <i className="fas fa-edit fa-x"></i>
          </Button>
          <Button
            className="btn btn-danger btn-xs red-color nb"
            onClick={(e) => {
              this.onDelete(e, item)
              this.setState({ inProgress: false })
            }}
          >
            <i className="fas fa-trash fa-x"></i>
          </Button>{' '}
        </div>
      ];
    });
    // this.state.data;

    const options = {
      filter: true,
      filterType: "dropdown",
      responsive: "stacked",
      hasIndex: true /* <-- use numbers for rows*/,
      selectableRows: false,
    };

    return (
      <div className="content">
        <Button onClick={this.handleModalOpen} className="pull-right">
          {" "}
          Nouveau Indicateur
        </Button>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={"Liste des Indicateurs"}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>

        <div className="modal fade">
          <Modal
            show={this.state.showIndicModal}
            onHide={this.handleModalClose}
          >
            <ModalHeader closeButton className="map-color fs-20 t-center">
              Nouveau Indicateur
            </ModalHeader>

            <ModalBody className="col-sm-12">
              <Form>
                <FormGroup className="col-sm-12">
                  <label htmlFor="name">Libelle de l'indicateur:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    value={this.state.newIndic.name}
                    onChange={(e) => {
                      let { newIndic } = this.state;
                      newIndic.name = e.target.value;
                      this.setState({ newIndic }, console.log(this.state));
                    }}
                  />
                </FormGroup>
                <FormGroup className="col-sm-12">
                  {!this.state.inProgress ? (
                    <Button
                      className="btn btn-white btn-round"
                      onClick={this.onAddIndicateur}
                    >
                      Ajouter
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
                  <Button
                    className="btn btn-red btn-round"
                    onClick={this.handleModalClose}
                  >
                    Annuler
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
        </div>

        {/* Modal edit */}
        <div className="modal fade">
          <Modal
            show={this.state.editIndicModal}
            onHide={this.handleEditModalToggle}
          >
            <ModalHeader closeButton className="map-color fs-20 t-center">
              Modifier Indicateur
            </ModalHeader>

            <ModalBody className="col-sm-12">
              <Form>
                <FormGroup className="col-sm-12">
                  <label htmlFor="name">Libelle de l'indicateur:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    value={this.state.editIndic.name}
                    onChange={(e) => {
                      let { editIndic } = this.state;
                      editIndic.name = e.target.value;
                      this.setState({ editIndic });
                    }}
                  />
                </FormGroup>
                <FormGroup className="col-sm-12" style={{ display: 'flex' }}>
                  {!this.state.inProgress ? (
                    <Button
                      className="btn btn-white btn-round"
                      onClick={this.onEditIndicateur}
                      style={{ marginRight: '5px' }}
                    >
                      Modifier
                    </Button>
                  ) : (
                    <Button className="btn  btn-white btn-round" style={{ marginRight: '5px' }}>
                      Loading...
                      <i
                        className="fa fa-spin fa-spinner"
                        aria-hidden="true"
                      ></i>
                    </Button>
                  )}{" "}
                  <Button
                    className="btn btn-red btn-round"
                    onClick={this.handleEditModalToggle}
                    style={{ marginLeft: '5px' }}
                  >
                    Annuler
                  </Button>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}
