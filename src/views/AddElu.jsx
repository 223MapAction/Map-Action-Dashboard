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

export default class AddElu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // token: window.sessionStorage.getItem('token'),
      data: [],
      inProgress: false,
      errors: {},
      newElu: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        adress: '',
        user_type: 'elu',
        password: 'mapaction2020',
        organisation: '',
        zones: [],
      },
      newEluModal: false,
      editUserModal: false,
      visible: false,
      error: false,
      message: [],
      communaute: [],
      zones: [],
      is_empty_adress: false,
      is_empty_email: false,
      is_empty_name: false,
      is_empty_phone: false,
      is_empty_user_type: false,
      is_empty_first_organisation: false,
      is_empty_last_communaute: false,
      is_empty_password: false,
      is_invalid_email: false,
      is_empty_zones: false,
      listZones: [],
      sendZone: [],
      // show: false,
    }
  }

  componentDidMount = () => {
    this._getElus()
    // this._getZones();
    this._getcommunaute()
  }

  onValidateFormData = () => {
    let newElu = this.state.newElu
    let errors = this.state.errors
    var isValidForm = true
    // console.log(newElu)

    if (!newElu['adress']) {
      isValidForm = false
      this.setState({
        is_empty_adress: true,
      })
      setTimeout(() => {
        this.setState({
          is_empty_adress: false,
        })
      }, 5000)
      errors['adress'] = 'Ce champ est obligatoire'
    }
    if (!newElu['phone']) {
      isValidForm = false
      this.setState({
        is_empty_phone: true,
      })
      setTimeout(() => {
        this.setState({
          is_empty_phone: false,
        })
      }, 5000)
      errors['phone'] = 'Ce champ est obligatoire'
    }
    if (!newElu['email']) {
      isValidForm = false
      this.setState({
        is_empty_email: true,
      })
      setTimeout(() => {
        this.setState({
          is_empty_email: false,
        })
      }, 5000)

      errors['email'] = 'Ce champ est obligatoire'
    }
    if (typeof newElu['email'] !== 'undefined') {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
      )
      if (!pattern.test(newElu['email'])) {
        isValidForm = false
        this.setState({
          is_invalid_email: true,
        })
        setTimeout(() => {
          this.setState({
            is_invalid_email: false,
          })
        }, 5000)

        errors['invalid_email'] = "Votre adresse email n'est pas valide"
      }
    }
    if (!newElu['first_name']) {
      isValidForm = false
      this.setState({
        is_empty_first_name: true,
      })
      setTimeout(() => {
        this.setState({
          is_empty_first_name: false,
        })
      }, 5000)
      errors['first_name'] = 'Ce champ est obligatoire'
    }
    if (!newElu['last_name']) {
      isValidForm = false
      this.setState({
        is_empty_last_name: true,
      })
      setTimeout(() => {
        this.setState({
          is_empty_last_name: false,
        })
      }, 5000)
      errors['last_name'] = 'Ce champ est obligatoire'
    }

    // if (!newElu['password']) {
    //   isValidForm = false
    //   this.setState({
    //     is_empty_password: true,
    //   })
    //   errors['password'] = 'Ce champ est obligatoire'
    //   setTimeout(() => {
    //     this.setState({
    //       is_empty_password: false,
    //     })
    //   }, 5000)
    // }

    // if (!newElu['user_type']) {
    //   isValidForm = false
    //   this.setState({
    //     is_empty_user_type: true,
    //   })
    //   setTimeout(() => {
    //     this.setState({
    //       is_empty_user_type: false,
    //     })
    //   }, 5000)
    //   errors['user_type'] = 'Ce champ est obligatoire'
    // }

    if (!newElu['organisation']) {
      isValidForm = false
      this.setState({
        is_empty_organisation: true,
      })
      setTimeout(() => {
        this.setState({
          is_empty_organisation: false,
        })
      }, 5000)
      errors['organisation'] = 'Ce champ est obligatoire'
    }

    // if (!newElu['communaute']) {
    //   isValidForm = false
    //   this.setState({
    //     is_empty_communaute: true,
    //   })
    //   setTimeout(() => {
    //     this.setState({
    //       is_empty_communaute: false,
    //     })
    //   }, 5000)
    //   errors['communaute'] = 'Ce champ est obligatoire'
    // }

    this.setState({
      errors: errors,
    })

    console.log(isValidForm, errors)

    return isValidForm
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

  handleSelectChange = (selectedOption) => {
    console.log(selectedOption.value)
    // let { newElu } = this.state
    // newElu.user_type = selectedOption.value
    // this.setState({ newElu })
    let newElu = this.state.newElu
    newElu['user_type'] = selectedOption.value
    this.setState({ newElu })
  }

  handleSelectChangeCom = (selectedOption) => {
    console.log(selectedOption.value)

    let newElu = this.state.newElu
    newElu['communaute'] = selectedOption.value
    this.setState({ newElu })
  }

  handleSelectZoneChange = (selectedOption) => {
    console.log(selectedOption.value)
    // let newElu = this.state.newElu
    // newElu['adress'] = selectedOption.value
    // this.setState({ newElu })
    let newElu = this.state.newElu
    newElu['adress'] = selectedOption.value
    this.setState({ newElu })
  }

  onSelectChange = (e, choice) => {
    // console.log("test=>", choice);
    let { sendZone, newElu } = this.state
    if (choice.action === 'select-option') {
      let index = sendZone.findIndex((f) => f === choice.option.id)
      // console.log("index=>", index);
      // console.log("int", String(choice.option.id));
      if (index === -1) {
        sendZone.push(parseInt(choice.option.id))
        newElu['zones'] = sendZone
      }
    }
    if (choice.action === 'remove-value') {
      // console.log('choice=>')
      let index = sendZone.findIndex((f) => f === choice.removedValue.id)
      if (index !== -1) {
        sendZone.splice(index)
        newElu.zones = sendZone
      }
    }
    if (choice.action === 'clear') {
      // console.log('choice=>')
      sendZone = []
      newElu.zones = sendZone
    }
    this.setState({ sendZone, newElu })
  }

  _getZones = async () => {
    // var url = global.config.url + 'api/zone/'
    var url = global.config.url + '/MapApi/zone/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      // console.log('zones=>', res.data)
      let data = res.data['results']
      // console.log(data)
      this.setState({ zones: data })
    } catch (error) {
      console.log(error.message)
    }
  }

  _getElus = async () => {
    var url = global.config.url + 'api/elu/'
    var url = global.config.url + '/MapApi/elu/'
    let { data } = this.state
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      // console.log(res.data);
      data = res.data['results']
      let allElus = res.data['results']
      await this._getZones()
      data.forEach((element) => {
        element.customZone = []
        element.zones.forEach((z) => {
          this.state.zones.forEach((el) => {
            if (z === el.id) {
              // console.log('in get elus=>', el)
              element.customZone = [...element.customZone, el]
            }
          })
        })
      })
      // console.log('allElus=>', data)
      this.setState({ data })
    } catch (error) {
      console.log(error.message)
    }
  }

  _getcommunaute = async () => {
    // var url = global.config.url + 'api/communaute/'
    var url = global.config.url + '/MapApi/communaute/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log('communaute', res.data)
      let data = res.data['results']
      console.log(data)

      // let listZones = [
      //   {
      //     id: 1,
      //     zones: 'yeumbeul',
      //     communaute: 1,
      //   },
      //   {
      //     id: 2,
      //     zones: 'diamnadio',
      //     communaute: 2,
      //   },
      // ]
      // this.setState({ communaute: data }, () => {
      //   listZones = listZones.filter(
      //     (f) => f.communaute === this.state.communaute[0]?.id,
      //   )
      //   console.log('zoneByCommunaute', listZones)
      //   this.setState({ listZones })
      // })

    } catch (error) {
      console.log(error.message)
    }
  }

  __addElu = (e) => {
    e.preventDefault()
    if (this.onValidateFormData()) {
      this.setState({ inProgress: !this.state.inProgress })
      const new_data = {
        first_name: this.state.newElu.first_name,
        last_name: this.state.newElu.last_name,
        email: this.state.newElu.email,
        phone: this.state.newElu.phone,
        adress: this.state.newElu.adress,
        user_type: 'elu',
        password: 'mapaction2020',
        organisation: this.state.newElu.organisation,
        zones: this.state.newElu.zones,
      }
      // var url = global.config.url + 'api/elu/'
      var url = global.config.url + '/MapApi/elu/'
      console.log('newElu', new_data)
      axios
        .post(url, new_data, {
          headers: {
            'Content-Type': 'application/json',
            Bearer: `${sessionStorage.token}`,
          },
        })
        .then((response) => {
          console.log(response)
          let { data } = this.state
          // data.push(new_data);
          this._getElus()
          this.setState({
            inProgress: !this.state.inProgress,
            newEluModal: false,
            newElu: {},
          })
          swal('Succes', 'Organisation ajouté avec succès', 'success')
        })
        .catch((error) => {
          this.setState({ inProgress: !this.state.inProgress })
          if (error?.response?.status === 400 && error?.response?.data?.email) {
            swal(
              'Erreur Ajout',
              'Cet email est déja associé à un compte. Veuillez renseigner une autre adresse email.',
              'error',
            )
            console.log(error?.response?.status)
            console.log(error?.response?.data)
          } else if (error?.request) {
            console.log(error?.request?.data)
            swal('erreur', 'Veuillez reessayer', 'error')
          } else {
            swal('erreur', error?.message, 'error')
            console.log(error?.message)
          }
        })
    }
  }

  onUpdateUser = (e) => {
    e.preventDefault()
    let { errors, newElu } = this.state
    if (newElu['zones'].length === 0) {
      errors['zones'] = 'Ce champ est obligatoire'
      this.setState({
        is_empty_zones: true,
        errors,
      })
      setTimeout(() => {
        this.setState({
          is_empty_zones: false,
          errors: {},
        })
      }, 5000)
      // console.log("is errors=>", this.state.errors);
    } else {
      this.setState({ inProgress: !this.state.inProgress })
      const new_data = {
        first_name: this.state.newElu.first_name,
        last_name: this.state.newElu.last_name,
        email: this.state.newElu.email,
        phone: this.state.newElu.phone,
        adress: this.state.newElu.adress,
        organisation: this.state.newElu.organisation,
        user_type: this.state.newElu.user_type,
        communaute: this.state.newElu.communaute,
        // password: this.state.newElu.password,
        zones: this.state.newElu.zones || [],
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
              organisation: '',
              zones: [],
            },
          })
          swal('Succès', 'Utilisateur mis à jour avec succès', 'success')
          this._getElus()
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
  }

  onEditUser = (item) => {
    console.log(item)
    let { sendZone } = this.state
    item.zones.map((z) => {
      sendZone = [...sendZone, parseInt(z)]
    })
    // console.log("recup Zones=>", sendZone);
    this.setState(
      {
        editUserModal: !this.state.editUserModal,
        newElu: item,
        sendZone,
      },
      () => {
        if (this.state.editUserModal === false) {
          this.setState({ newElu: {}, sendZone: [] })
        }
      },
    )
    // console.log("zones=>", item.zones);
    // this.state.zones.forEach((element) => {
    //   item.zones.forEach((item) => {
    //     if (item === element.id) console.log("mes zones=>", element);
    //   });
    // });
  }

  onDeleteUser = (item) => {
    console.log('item=>', item)
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
            console.log('response done=>', response)

            swal('Utilisateur Supprime!', {
              icon: 'success',
            })
            this._getElus()
          })
          .catch((error) => {
            this.setState({ inProgress: !this.state.inProgress })
            console.log('erreur=>', error)
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
    this.setState({
      editUserModal: !this.state.editUserModal,
      newElu: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        adress: '',
        user_type: '',
        password: '',
        zones: [],
      },
    })
  }

  handleModalOpen = () => {
    this.setState({ newEluModal: !this.state.newEluModal })

    if (this.state.newEluModal === false) {
      this.setState({
        newElu: {
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          adress: '',
          user_type: '',
          password: '',
          organisation: '',
          communaute: '',
          zones: [],
        },
      })
    }
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
        name: 'organisation',
        label: 'Organisation',
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: 'Zone',
        label: 'Zone',
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
      { value: 'elu', label: 'Organisation' },
    ]

    const optionsZone = this.state.zones.map(function (zone) {
      return {
        value: zone.name,
        label: zone.name,
        key: zone.id + 'unique-key',
        id: zone.id,
      }
    })
    let select = []
    let { zones } = this.state.newElu
    // console.log("is define=>", this.state.newElu);
    if (this.state.zones?.length) {
      this.state.zones.forEach((zone) => {
        if (zones?.length) {
          zones.forEach((item) => {
            if (item === zone.id) {
              let obj = {
                value: zone.name,
                label: zone.name,
                key: zone.id + 'unique-key',
                id: zone.id,
              }
              select = [...select, obj]
            }
          })
        }
      })
    }

    // console.log("selectZone=>", select);

    const optionsCommunaute = this.state.zones.map(function (zone) {
      return {
        value: zone.name,
        label: zone.name,
        key: zone.id + 'unique-key',
      }
    })

    const listcommunaute = this.state.communaute.map(function (communaute) {
      return {
        value: communaute.id,
        label: communaute.name,
        key: communaute.id + 'unique-key',
      }
    })

    const data = this.state.data.reverse().map((item, i) => {
      return [
        item.first_name,
        item.last_name,
        item.email,
        item.phone,
        item.adress,
        item.organisation,
        item.customZone.map((c) => c.name + ' ,'),
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

    // let testTab=[]

    let newEluModal = (
      <Modal show={this.state.newEluModal} onHide={this.handleModalOpen}>
        <ModalHeader closeButton>Nouveau Organisation</ModalHeader>
        <Form>
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Prenom:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="first_name"
                value={this.state.newElu.first_name || ''}
                onChange={(e) => {
                  let newElu = this.state.newElu
                  newElu['first_name'] = e.target.value
                  this.setState({ newElu })
                }}
              />
              {this.state.is_empty_first_name === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.first_name}{' '}
                </div>
              )}
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
                  let newElu = this.state.newElu
                  newElu['last_name'] = e.target.value
                  this.setState({ newElu })
                }}
              />
              {this.state.is_empty_last_name === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.last_name}{' '}
                </div>
              )}
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
                  let newElu = this.state.newElu
                  newElu['email'] = e.target.value
                  this.setState({ newElu })
                }}
              />
              {this.state.is_empty_email === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.email}{' '}
                </div>
              )}
              {!this.state.is_empty_email &&
                this.state.is_invalid_email === true && (
                  <div className="alert alert-danger gfa-alert-danger">
                    {' '}
                    {this.state.errors.invalid_email}{' '}
                  </div>
                )}
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
                  let newElu = this.state.newElu
                  newElu['phone'] = e.target.value
                  this.setState({ newElu })
                }}
              />
              {this.state.is_empty_phone === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.phone}{' '}
                </div>
              )}
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="zone">Adresse:</label>

              <Select
                className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="zone"
                options={optionsZone}
                className="basic-multi-select map-color "
                onChange={this.handleSelectZoneChange}
                classNamePrefix="select"
              />
              {this.state.is_empty_adress === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.adress}{' '}
                </div>
              )}
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="user_type">Type Utilisateur:</label>
              <input
                className="form-control"
                type="text"
                id=" user_type"
                name=" user_type"
                value="elu"
                disabled
              />
              {/* {this.state.is_empty_user_type === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.user_type}{' '}
                </div>
              )} */}
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="org">Organisation:</label>
              <input
                className="form-control"
                type="text"
                id="org"
                placeholder="Organisation"
                name="organisation"
                value={this.state.newElu.organisation}
                onChange={(e) => {
                  let newElu = this.state.newElu
                  newElu['organisation'] = e.target.value
                  this.setState({ newElu })
                }}
              />
              {this.state.is_empty_organisation === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.organisation}{' '}
                </div>
              )}
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="zone">Zone(s):</label>

              <Select
                className="mt-4 col-md-6 col-offset-4"
                name="zones"
                options={optionsZone}
                // defaultValue={[optionsZone[0]]}
                className="basic-multi-select map-color"
                isMulti
                onChange={(e, choice) => this.onSelectChange(e, choice)}
                classNamePrefix="select"
              />
              {this.state.is_empty_zones === true && (
                <div className="alert alert-danger gfa-alert-danger">
                  {' '}
                  {this.state.errors.is_empty_zones}{' '}
                </div>
              )}
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
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button className="btn btn-primary" onClick={this.__addElu}>
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
        <ModalHeader closeButton>Modifier Organisation</ModalHeader>
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
                  let newElu = this.state.newElu
                  newElu['first_name'] = e.target.value
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
                  let newElu = this.state.newElu
                  newElu['last_name'] = e.target.value
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
                  let newElu = this.state.newElu
                  newElu['email'] = e.target.value
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
                  let newElu = this.state.newElu
                  newElu['phone'] = e.target.value
                  this.setState({ newElu })

                  //console.log(this.state.newElu)
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="zone">Adresse:</label>

              <Select
                className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="zone"
                options={optionsZone}
                value={optionsZone.filter(
                  (option) => option.value === this.state.newElu.adress,
                )}
                className="basic-multi-select map-color"
                onChange={this.handleSelectZoneChange}
                classNamePrefix="select"
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="org">Organisation:</label>
              <input
                className="form-control"
                type="text"
                id="org"
                placeholder="Organisation"
                name="organisation"
                value={this.state.newElu.organisation}
                onChange={(e) => {
                  let newElu = this.state.newElu
                  newElu['organisation'] = e.target.value
                  this.setState({ newElu })
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="user_type">Type Utilisateur:</label>
              <Select
                className="mt-4 col-md-6 col-offset-4"
                // components={makeAnimated()}
                name="incidents_rapport"
                value={optionstype.filter(
                  (option) => option.value === this.state.newElu.user_type,
                )}
                options={optionstype}
                className="basic-multi-select map-color"
                onChange={this.handleSelectChange}
                classNamePrefix="select"
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="user_type">Zones:</label>
              <Select
                className="mt-4 col-md-6 col-offset-4"
                name="zones"
                options={optionsZone}
                defaultValue={select}
                className="basic-multi-select map-color"
                isMulti
                onChange={(e, choice) => this.onSelectChange(e, choice)}
                classNamePrefix="select"
              />
              {this.state.is_empty_zones && (
                <div className="alert alert-danger">
                  {this.state.errors.zones}
                </div>
              )}
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
      </Modal >
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
          Nouveau Organisation
        </Button>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={'Liste des Organisations'}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    )
  }
}
