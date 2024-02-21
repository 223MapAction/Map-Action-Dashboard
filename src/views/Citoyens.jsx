import React, { Component } from 'react'
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
} from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from 'variables/Variables.jsx'
import axios from 'axios'
import swal from 'sweetalert'
import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import Select from 'react-select'

export default class Citoyens extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // token: window.sessionStorage.getItem('token'),
      data: [],
      inProgress: false,
      newElu: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        adress: '',
        user_type: '',
        password: '',
      },
      newEluModal: false,
      editUserModal: false,
      visible: false,
      error: false,
      message: [],
      // show: false,
    }
  }

  componentDidMount = () => {
    this._getCitizens()
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTypography: {
          h6: {
            fontSize: '1.5rem',
          },
        },
        MUIDataTableHeadCell: {
          root: {
            fontSize: '16px',
            color: '#38A0DB',
          },
        },
        MUIDataTableBodyCell: {
          root: {
            fontSize: '13px',
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
            color: '#38A0DB',
          },
        },
      },
    })

  _getCitizens = async () => {
    // var url = global.config.url + 'api/citizen/'
    var url = global.config.url + '/MapApi/citizen/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      // console.log(res.data);
      let data = res.data['results']
      // console.log(data);
      this.setState({ data: data.sort((a, b) => b?.id - a?.id) })
    } catch (error) {
      console.log(error.message)
    }
  }

  __addCitizen = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })
    const new_data = {
      first_name: this.state.newElu.first_name,
      last_name: this.state.newElu.last_name,
      email: this.state.newElu.email,
      phone: this.state.newElu.phone,
      adress: this.state.newElu.adress,
      user_type: 'citizen',
      password: 'mapaction2020',
    }
    // var url = global.config.url + 'api/citizen/'
    var url = global.config.url + '/MapApi/citizen/'
    console.log(new_data)
    axios
      .post(url, new_data)
      .then((response) => {
        // console.log(response);
        let { data } = this.state
        // data.push(new_data);
        this._getCitizens()
        this.setState({
          inProgress: !this.state.inProgress,
          newEluModal: false,
        })
        swal('Succes', 'Elu ajouté avec succès', 'success')
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        if (error.response) {
          swal('Erreur Ajout', error?.response?.data, 'error')
          console.log(error?.response?.status)
          console.log(error?.response?.data)
        } else if (error?.request) {
          console.log(error?.request?.data)
          swal('erreur', error?.request?.data, 'error')
        } else {
          swal('erreur', error?.message, 'error')
          console.log(error?.message)
        }
      })
  }

  onUpdateUser = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })
    const new_data = {
      first_name: this.state.newElu.first_name,
      last_name: this.state.newElu.last_name,
      email: this.state.newElu.email,
      phone: this.state.newElu.phone,
      adress: this.state.newElu.adress,
      user_type: this.state.user_type,
      password: 'mapaction2020',
    }
    // var url = global.config.url + 'api/user/' + this.state.newElu.id + '/'
    var url = global.config.url + '/MapApi/user/' + this.state.newElu.id + '/'
    console.log(new_data)
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response)
        this.setState({
          inProgress: !this.state.inProgress,
          newEluModal: false,
          editUserModal: false,
          newElu: {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            adress: '',
            user_type: '',
            password: '',
          },
        })
        swal('Succès', 'Utilisateur mis à jour avec succès', 'success')
        this._getCitizens()
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        if (error.response) {
          swal('Erreur', 'Veuillez reessayer', 'error')
          console.log(error.response.status)
          console.log(error.response.data)
        } else if (error.request) {
          console.log(error.request.data)
          swal('erreur', 'Veuillez reessayer', 'error')
        } else {
          swal('erreur', 'Veuillez reessayer', 'error')
          console.log(error.message)
        }
      })
  }

  onEditUser = (item) => {
    console.log(item)
    this.setState({ editUserModal: !this.state.editUserModal, newElu: item })
  }

  onDeleteUser = (item) => {
    swal({
      title: 'Etes vous sure?',
      text: 'La suppression est definitive',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // var url = global.config.url + 'api/user/' + item.id + '/'
        var url = global.config.url + '/MapApi/user/' + item.id + '/'
        console.log(item)
        axios
          .delete(url, item)
          .then((response) => {
            console.log(response)

            swal('Utilisateur Supprime!', {
              icon: 'success',
            })

            this._getCitizens()
          })
          .catch((error) => {
            this.setState({ inProgress: !this.state.inProgress })
            if (error.response) {
              swal('Erreur Suppression', 'Veuillez reessayer', 'error')
              console.log(error.response.status)
              console.log(error.response.data)
            } else if (error.request) {
              console.log(error.request.data)
              swal('erreur', 'Veuillez reessayer', 'error')
            } else {
              swal('erreur', 'Veuillez reessayer', 'error')
              console.log(error.message)
            }
          })
      } else {
        swal('Suppression annulee!')
      }
    })
  }

  handleEditModal = () => {
    this.setState({ editUserModal: !this.state.editUserModal })
  }

  handleModalOpen = () => {
    this.setState({ newEluModal: !this.state.newEluModal })
  }

  render() {
    const columns = [
      {
        name: 'first_name',
        label: 'Prenom',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'last_name',
        label: 'Nom',
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: 'email',
        label: 'Email',
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: 'phone',
        label: 'Telephone',
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: 'adress',
        label: 'Adresse',
        options: {
          filter: true,
          sort: false,
        },
      },

      {
        name: 'actions',
        label: 'Action',
        options: {
          filter: false,
          sort: false,
          export: false,
        },
      },
    ]

    const optionstype = [
      { value: 'admin', label: 'Admin' },
      { value: 'visitor', label: 'Visitor' },
      { value: 'reporter', label: 'Reporter' },
      { value: 'citizen', label: 'Citizen' },
      { value: 'business', label: 'Business' },
      { value: 'elu', label: 'Elu' },
    ]

    const data = this.state.data.map((item, i) => {
      return [
        item.first_name,
        item.last_name,
        item.email,
        item.phone,
        item.adress,
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
              this.onDeleteUser(item)
              this.setState({ inProgress: false })
            }}
          >
            <i className="fas fa-trash fa-x"></i>
          </Button>
        </div>,
      ]
    })
    // this.state.data;

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      hasIndex: true /* <-- use numbers for rows*/,
    }

    let newEluModal = (
      <Modal show={this.state.newEluModal} onHide={this.handleModalOpen}>
        <ModalHeader closeButton>Nouveau Citoyen</ModalHeader>
        <Form>
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Prenom:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="first_name"
                value={this.state.newElu.first_name}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.first_name = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.last_name}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.last_name = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.email}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.email = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.phone}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.phone = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.adress}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.adress = e.target.value
                  this.setState({ newElu })
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="user_type">Type Utilisateur:</label>
              <input
                className="form-control"
                type="text"
                id=" user_type"
                name=" user_type"
                value="citizen"
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.user_type = e.target.value
                  this.setState({ newElu })
                }}
                disabled
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.__addCitizen}>
                Ajouter
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{' '}
            <Button className="btn btn-danger" onClick={this.handleModalOpen}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )

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
                value={this.state.newElu.first_name}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.first_name = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.last_name}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.last_name = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.email}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.email = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.phone}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.phone = e.target.value
                  this.setState({ newElu })
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
                value={this.state.newElu.adress}
                onChange={(e) => {
                  let { newElu } = this.state
                  newElu.adress = e.target.value
                  this.setState({ newElu })
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
            )}{' '}
            <Button className="btn btn-danger" onClick={this.handleEditModal}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )

    return (
      <div className="content">
        {newEluModal}
        {editUserModal}
        <Button
          className="pull-right"
          style={btnStyle}
          onClick={this.handleModalOpen}
        >
          <i className="fa fa-plus"></i>
          Nouveau Citoyen
        </Button>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={'Liste des Citoyens'}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    )
  }
}
