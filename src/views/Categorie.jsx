import React, { Component } from 'react'
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
} from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from 'variables/Variables.jsx'
import axios from 'axios'
import { StatsCard } from 'components/StatsCard/StatsCard.jsx'

import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import swal from 'sweetalert'

export default class categorys extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      inProgress: false,
      newCat: {
        name: '',
      },
      editCat: {},
      newCatModal: false,
      showCatModal: false,
      editCatModal: false,
    }
  }

  componentDidMount = () => {
    this._getcategorys()
  }

  _getcategorys = async () => {
    let user = sessionStorage.user_id
    // var url = global.config.url + 'api/category/'
    var url = global.config.url + '/MapApi/category/'

    try {
      let res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      // console.log(res.data)
      let data = res.data.results.sort((a, b) => b.id - a.id)
      this.setState({ data: data })
      // console.log(data)
    } catch (error) {
      console.log(error.message)
    }
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

  handleModalOpen = () => {
    this.setState({ newCatModal: !this.state.newCatModal })
  }
  handleModalClose = () => {
    this.setState({ newCatModal: false })
  }

  handleEditModalToggle = () => {
    this.setState({ editCatModal: !this.state.editCatModal })
  }

  handleEdit = (item) => {
    this.setState({ editCat: item, editCatModal: true })
  }

  onDelete = (e, item) => {
    e.preventDefault()
    this.setState({ editCat: item })
    swal({
      title: 'Êtes vous sûr de vouloir supprimer cette catégorie?',
      // text:
      //   'Once deleted, you will not be able to recover this imaginary file!',
      icon: 'warning',
      buttons: ['Non', 'Oui'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.onDeleteCategory()
      } else {
        swal('Suppression annulée!')
      }
    })
  }

  onAddcategory = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })
    const new_data = {
      name: this.state.newCat.name,
    }

    // var url = global.config.url + 'api/category/'
    var url = global.config.url + '/MapApi/category/'

    console.log(new_data)
    axios
      .post(url, new_data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response)
        this.setState({
          inProgress: !this.state.inProgress,
          newCatModal: false,
        })
        this._getcategorys()
        swal('Succes', 'category Ajoute avec succes', 'success')
        this.setState({
          newCat: {
            name: '',
          },
        })
      })
      .catch((error) => {
        this.setState({
          inProgress: !this.state.inProgress,
          newCatModal: false,
        })
        if (error.response) {
          console.log(error.response.status)
          swal('Erreur', "Erreur lors de l'ajout, veuillez reessayer", 'error')
          console.log(error.response.data)
        } else if (error.request) {
          console.log(error.request.data)
        } else {
          console.log(error.message)
        }
        // e.target.reset()
        this.setState({
          newCat: {
            name: '',
          },
        })
        // document.getElementsByClassName("edit-form").reset()
      })
  }

  onEditcategory = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })

    // var url = global.config.url + 'api/category/' + this.state.editCat?.id + '/'
    var url = global.config.url + '/MapApi/category/' + this.state.editCat?.id + '/'
    // console.log(this.state.editCat)
    axios
      .put(url, this.state.editCat, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response)
        this.setState({
          inProgress: !this.state.inProgress,
          editCatModal: false,
          editCat: {},
        })
        swal('Succes', 'categorie modifiée avec succes', 'success')
        this._getcategorys()
      })
      .catch((error) => {
        this.setState({
          inProgress: !this.state.inProgress,
          editCatModal: false,
        })
        if (error?.response) {
          console.log(error?.response?.status)
          swal(
            'Erreur',
            'Erreur lors de la modification, veuillez reessayer plus tard',
            'error',
          )
          console.log(error?.response?.data)
        } else if (error?.request) {
          console.log(error?.request?.data)
        } else {
          console.log(error?.message)
        }
      })
  }

  onDeleteCategory = () => {
    // e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })

    // var url = global.config.url + 'api/category/' + this.state.editCat?.id + '/'
    var url = global.config.url + '/MapApi/category/' + this.state.editCat?.id + '/'

    // console.log(this.state.editCat)
    axios
      .delete(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response)
        this.setState({
          inProgress: !this.state.inProgress,
          editCat: {},
        })
        swal('Catégorie supprimée!', {
          icon: 'success',
        })
        this._getcategorys()
      })
      .catch((error) => {
        this.setState({
          inProgress: !this.state.inProgress,
          editCatModal: false,
        })
        if (error?.response) {
          console.log(error?.response?.status)
          swal(
            'Erreur',
            'Erreur lors de la suppression, veuillez reessayer plus tard',
            'error',
          )
          console.log(error?.response?.data)
        } else if (error?.request) {
          console.log(error?.request?.data)
        } else {
          console.log(error?.message)
        }
      })
  }

  render() {
    // let { data } = this.state;

    const columns = [
      {
        name: 'id',
        label: 'Id',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'name',
        label: 'Name',
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
        },
      },
    ]

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
        </div>,
      ]
    })
    // this.state.data;

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      hasIndex: true /* <-- use numbers for rows*/,
      selectableRows: false,
    }

    return (
      <div className="content">
        <Button onClick={this.handleModalOpen} className="pull-right">
          {' '}
          New Category
        </Button>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={'Liste des categorys'}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>

        <div className="modal fade">
          <Modal show={this.state.newCatModal} onHide={this.handleModalClose}>
            <ModalHeader closeButton className="map-color fs-20 t-center">
              New Category
            </ModalHeader>

            <ModalBody className="col-sm-12">
              <Form className="add-form">
                <FormGroup className="col-sm-12">
                  <label htmlFor="name">Libelle:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    value={this.state.newCat.name}
                    onChange={(e) => {
                      let { newCat } = this.state
                      newCat.name = e.target.value
                      this.setState({ newCat }, console.log(this.state))
                    }}
                  />
                </FormGroup>
                <FormGroup className="col-sm-12">
                  {!this.state.inProgress ? (
                    <Button
                      className="btn btn-white btn-round"
                      onClick={this.onAddcategory}
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
                  )}{' '}
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

        {/* Edit Category */}
        <div className="modal fade">
          <Modal
            show={this.state.editCatModal}
            onHide={this.handleEditModalToggle}
          >
            <ModalHeader closeButton className="map-color fs-20 t-center">
              Modifier Categorie
            </ModalHeader>

            <ModalBody className="col-sm-12">
              <Form className="edit-form">
                <FormGroup className="col-sm-12">
                  <label htmlFor="name">Libelle:</label>
                  <input
                    className="form-control"
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={this.state.editCat.name}
                    // value={this.state.newCat.name}
                    onChange={(e) => {
                      let { editCat } = this.state
                      editCat.name = e.target.value
                      this.setState({ editCat })
                    }}
                  />
                </FormGroup>
                <FormGroup className="col-sm-12" style={{ display: 'flex' }}>
                  {!this.state.inProgress ? (
                    <Button
                      className="btn btn-white btn-round"
                      onClick={this.onEditcategory}
                      style={{ marginRight: '5px' }}
                    >
                      Modifier
                    </Button>
                  ) : (
                    <Button
                      className="btn  btn-white btn-round"
                      style={{ marginRight: '5px' }}
                    >
                      Loading...
                      <i
                        className="fa fa-spin fa-spinner"
                        aria-hidden="true"
                      ></i>
                    </Button>
                  )}{' '}
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
    )
  }
}
