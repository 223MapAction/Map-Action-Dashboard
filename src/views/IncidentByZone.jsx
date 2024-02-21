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
// import Card from 'components/Card/Card.jsx'
// import { btnStyle } from "variables/Variables.jsx";
import axios from 'axios'
import 'assets/css/global.css'
// import test from 'assets/test.mp3'
import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import swal from 'sweetalert'
import { CSVLink, CSVDownload } from 'react-csv'
import Select from 'react-select'
import { Player } from 'video-react'
import 'video-react/dist/video-react.css' // import css
import Card from 'components/Card/Card'

var _isMounted = false

export default class IncidentByZone extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      listIncZone: [],
      eluZones: [],
      inProgress: false,
      newIncident: {
        title: '',
        zone: '',
        description: '',
        photo: '',
        video: '',
        audio: '',
        lattitude: '',
        longitude: '',
        user_id: '',
        etat: '',
        indicateur_id: '',
        category_ids: [],
      },
      EditIncident: {
        title: '',
        zone: '',
        description: '',
        lattitude: '',
        longitude: '',
        user_id: '',
        etat: '',
        zone: '',
        indicateur_id: '',
        category_ids: [],
      },
      newReport: {
        details: '',
        zone: '',
        incident_id: '',
        date_livraison: '',
      },
      newIncidentModal: false,
      showIncidentModal: false,
      showRapportModal: false,
      visible: false,
      error: false,
      message: [],
      PhotoExtensionOK: false,
      changeState: false,
      categories: [],
      indicateurs: [],
      isChanged: false,
      list_zones: [],
      displayZone: '',
      obj: '',
      load: false,
      user: JSON.parse(sessionStorage.user),
      zones: [],
      idInc: null,
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentDidMount = () => {
    // this._getIncidents();
    this.getZones()
    this._getcategorys()
    this._getIndicateurs()
    // this._fetchZones();
  }

  onShowAlert = () => {
    this.setState({ visible: true }, () => {
      window.setTimeout(() => {
        this.setState({ visible: false, message: [] })
      }, 5000)
    })
  }
  onShowIncident = (item) => {
    this.setState({
      inProgress: false,
      showIncidentModal: !this.state.showIncidentModal,
    })
    if (item) {
      console.log('element à afficher ', item)
      this.state.newIncident = item
    }
  }
  onRequestRapport = (item) => {
    this.setState({
      inProgress: false,
      showRapportModal: !this.state.showRapportModal,
      // showIncidentModal: false
    })
    if (item) {
      console.log('Rapport pour ', item)
      this.state.newReport.incident = item.title
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
  handleShowIncidentModal = () => {
    this.setState((prevState) => {
      return { showIncidentModal: !prevState.showIncidentModal }
    })
    if (this.state.showIncidentModal === false) {
      this.setState({
        videoIsLoading: true,
        newIncident: {
          title: '',
          zone: '',
          description: '',
          photo: '',
          video: '',
          audio: '',
          lattitude: '',
          longitude: '',
          user_id: '',
        },
      })
    }
  }

  _getIncidents = async () => {
    let elu_zone = sessionStorage.zone
    let { zones } = this.state
    var url = global.config.url + 'api/incidentbyzone/' + elu_zone + '/'
    console.log('url =>', url)
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log(res.data)
      let data = res.data
      this.setState({ data: data })
    } catch (error) {
      console.log(error.message)
    }
  }

  handleSelectChange = (selectedOption) => {
    console.log(selectedOption.value)
    let { EditIncident } = this.state
    EditIncident = selectedOption.value
    // EditIncident.zone = sessionStorage.zone
    this.setState({ EditIncident })
    console.log(this.state.EditIncident)
  }

  handleChangeStatus = async (e) => {
    e.preventDefault()
    this.setState({ isChanged: true })
    var new_data = new FormData()
    new_data.append('etat', this.state.EditIncident)
    new_data.append(
      'zone',
      this.state.data.filter((d) => d?.id === this.state.idInc)[0]?.zone,
    )
    var url = global.config.url + 'api/incident/' + this.state.idInc + '/'
    axios
      .put(url, new_data)
      .then((response) => {
        console.log(response)
        this.setState({
          changeState: !this.state.changeState,
          isChanged: false,
          idInc: null,
          EditIncident: {},
        })
        this.getIncidentsByZone()
        swal('Succès', ' Statut modifié avec succès.', 'success')
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        this.setState({
          changeState: !this.state.changeState,
          isChanged: false,
        })
        if (error.response) {
          swal('Erreur Ajout', 'Veuillez reessayer plutard', 'error')
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

  onDeleteIncident = (item) => {
    if (item) {
      console.log('element à supprimer ', item)
      this.setState({ newIncident: item })
    }
    this.setState({ show: true })
  }

  deleteIncident = (e) => {
    this.setState({ inProgress: true })
    e.preventDefault()
    console.log(this.state.newIncident.id)
    var url = global.config.url + 'api/incident/'
    axios
      .delete(url + this.state.newIncident.id)
      .then((response) => {
        console.log(response)
        this.setState({
          newIncident: {
            title: '',
            zone: '',
            description: '',
            photo: '',
            video: '',
            audio: '',
            lattitude: '',
            longitude: '',
            user_id: '',
          },
        })
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        if (error.response) {
          console.log(error.response.status)
          console.log(error.response.data)
        } else if (error.request) {
          console.log(error.request.data)
        } else {
          console.log(error.message)
        }
      })
  }
  onRowClick = (rowData, rowMeta) => {
    console.log('----RowClick')
    console.log('rowData: ', rowData)
    console.log('rowMeta: ', rowMeta)
  }
  handleModalOpen = () => {
    this.setState({ newIncidentModal: !this.state.newIncidentModal })
    this.setState({
      newIncident: {
        title: '',
        zone: '',
        description: '',
        photo: '',
        video: '',
        audio: '',
        lattitude: '',
        longitude: '',
        user_id: '',
      },
    })
  }
  handleModalClose = () => {
    this.setState({ showRapportModal: !this.state.showRapportModal })
  }
  photoValidation = (elementID) => {
    var fileInput = document.getElementById(elementID)

    var filePath = fileInput.value

    // Allowing file type
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i

    if (!allowedExtensions.exec(filePath)) {
      //alert('Invalid file type');
      fileInput.value = ''
      return false
    } else {
      return true
    }
  }

  videoValidation = (elementID) => {
    var fileInput = document.getElementById(elementID)

    var filePath = fileInput.value

    // Allowing file type
    var allowedExtensions = /(\.mp4|\.avi|\.mpg|\.m4v)$/i

    if (!allowedExtensions.exec(filePath)) {
      fileInput.value = ''
      return false
    } else {
      return true
    }
  }

  addFileHandleChange = (e) => {
    if (e.target.name === 'photo') {
      if (this.photoValidation('photo_inc')) {
        // photo = e.target.files[0];
        this.state.newIncident.photo = e.target.files[0]
      } else {
        this.setState({
          PhotoExtensionOK: true,
        })
      }
    }

    if (e.target.name === 'video') {
      if (this.videoValidation('video_inc')) {
        // photo = e.target.files[0];
        this.state.newIncident.video = e.target.files[0]
      } else {
        this.setState({
          PhotoExtensionOK: true,
        })
      }
    }
  }

  onChangeState = (item, id) => {
    console.log(item, 'item', id, 'id')
    this.setState(
      { changeState: !this.state.changeState, EditIncident: item, idInc: id },
      () => {
        if (this.state.changeState === false) {
          this.setState({ EditIncident: {} })
        }
      },
    )
  }

  addReport = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })
    const new_data = {
      details: this.state.newReport.details,
      zone: this.state.newIncident.zone,
      user_id: sessionStorage.user_id,
      incident: this.state.newIncident.id,
      date_livraison: this.state.newReport.date_livraison,
    }

    var url = global.config.url + 'api/rapport/'
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
        let { data } = this.state
        // data.push(new_data)
        this.setState({
          inProgress: !this.state.inProgress,
          showRapportModal: false,
          showIncidentModal: false,
        })
        swal('Succes', ' Votre demande a été envoyée avec succès.', 'success')
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        if (error.response) {
          console.log(error.response.status)
          console.log(error.response.data)
        } else if (error.request) {
          console.log(error.request.data)
        } else {
          console.log(error.message)
        }
        swal(
          'Erreur',
          ' Oupss! Une erreur est survenue. Veuillez réessayer plus tard.',
          'error',
        )
      })
  }

  handleMultiChange = (selectedOption) => {
    let idcat = []
    selectedOption.map((inc, id) => {
      idcat.push(inc.value)
    })
    this.state.newIncident.category_ids = idcat
  }

  handleOneChange = (selectedOption) => {
    let idcat = []
    this.state.newIncident.indicateur_id = selectedOption.value
    console.log(selectedOption)
  }

  _getcategorys = async () => {
    let user = sessionStorage.user_id
    var url = global.config.url + 'api/category/'
    try {
      let res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      console.log(res.data)
      let data = res.data.results
      this.setState({ categories: data })
      console.log(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  _getIndicateurs = async () => {
    let user = sessionStorage.user_id
    var url = global.config.url + 'api/indicateur/'
    try {
      let res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      console.log(res.data)
      let data = res.data.results
      this.setState({ indicateurs: data })
    } catch (error) {
      console.log(error.message)
    }
  }

  getIndicateurById(id) {
    let name = ''
    for (let index = 0; index < this.state.indicateurs.length; index++) {
      const element = this.state.indicateurs[index]
      if (element.id === id) {
        name = element.name
      }
    }
    return name
  }

  getCategoryById(ids) {
    let name = ''
    let names = []
    if (ids) {
      ids.map((cat_id, id) => {
        for (let index = 0; index < this.state.categories.length; index++) {
          const element = this.state.categories[index]
          if (element.id === cat_id) {
            names.push(element.name + ' ')
          }
        }
      })
      //console.log(names);

      return names
    }
  }

  addIncident = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })
    var new_data = new FormData()
    new_data.append('title', this.state.newIncident.title)
    new_data.append('zone', sessionStorage.zone)
    new_data.append('description', this.state.newIncident.description)
    new_data.append('photo', this.state.newIncident.photo)
    new_data.append('video', this.state.newIncident.video)
    new_data.append('audio', this.state.newIncident.audio)
    new_data.append('lattitude', this.state.newIncident.lattitude)
    new_data.append('longitude', this.state.newIncident.longitude)
    new_data.append('user_id', sessionStorage.user_id)

    var url = global.config.url + 'api/incident/'
    // new_data.append('file', this.state.newIncident.photo)
    console.log(new_data)
    axios
      .post(url, new_data)
      .then((response) => {
        console.log(response)
        let { data } = this.state
        // data.push(new_data)

        this.setState({
          inProgress: !this.state.inProgress,
          newEluModal: false,
          newIncidentModal: false,
        })
        swal('Succes', 'Incident ajoute avec succes', 'success')
        this.setState({
          newIncident: {
            title: '',
            zone: '',
            description: '',
            photo: '',
            video: '',
            audio: '',
            lattitude: '',
            longitude: '',
            user_id: '',
          },
        })
        this.getIncidentsByZone()
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        if (error?.response) {
          swal(error?.response?.status, error?.response?.data, 'error')
          console.log(error?.response?.status)
          console.log(error?.response?.data)
        } else if (error?.request) {
          swal(error, error?.request?.data, 'error')
          console.log(error?.request?.data)
        } else {
          swal(error, error?.message, 'error')
          console.log(error?.message)
        }
        this.setState({
          newIncident: {
            title: '',
            zone: '',
            description: '',
            photo: '',
            video: '',
            audio: '',
            lattitude: '',
            longitude: '',
            user_id: '',
          },
        })
      })
  }

  formatStatus(item) {
    if (item.etat === 'resolved') {
      return (
        <button onClick={() => this.onChangeState(item)} className="admin-s">
          resolu
        </button>
      )
    } else {
      return (
        <button onClick={() => this.onChangeState(item)} className="visitor-s">
          en attente
        </button>
      )
    }
  }

  formatDate = (date) => {
    if (date) {
      var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [day, month, year].join('-')
    } else {
      return null
    }
  }

  renderShowIncident = () => {
    // var url = "http://137.74.196.127:8000";
    var url = global.config.url.slice(0, -1)
    let imgUrl = this.state.newIncident.photo
    let imgIncident = url + `${imgUrl}`
    let audioUrl = this.state.newIncident.audio
    let audioIncident = url + `${audioUrl}`
    let video = this.state.newIncident.video
    let videoIncident = url + `${video}`
    const Loader = () => {
      return (
        <div className="loader">
          <h2>Loading video...</h2>
        </div>
      )
    }
    const lattitude = this.state.newIncident.lattitude
    const longitude = this.state.newIncident.longitude
    const position = [lattitude, longitude]

    return (
      <div className="modal fade">
        <Modal
          show={this.state.showIncidentModal}
          onHide={this.handleShowIncidentModal}
        >
          <ModalHeader closeButton className="map-color fs-20 t-center">
            <div className="row">
              <div className="col-md-7">Details Incident</div>
              <div className="col-md-4">
                <button
                  className="boutton  button--round-l"
                  onClick={(e) => this.onRequestRapport(this.state.newIncident)}
                >
                  <i className="fa fa-file" aria-hidden="true"></i> Commander un
                  rapport
                </button>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="col-sm-12">
            <div className="col-sm-6 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Titre:
              </label>
              <p>{this.state.newIncident.title}</p>
            </div>
            <div className="col-sm-6">
              <label htmlFor="code" className="map-color fs-18">
                Zone:
              </label>
              <p>{this.state.newIncident.zone}</p>
            </div>
            <hr />
            <div className="col-sm-12 pb-3">
              {/* {CustomMap} */}
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
                <p className="danger">Coordonnees non renseignées ou invalide  </p>
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
              <img src={imgIncident} alt="" />
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

  getZones = async () => {
    var url = global.config.url + 'api/zone/'
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

  getIncidentsByZone = async () => {
    let data = []

    try {
      for (let i = 0; i < this.state.user.zones.length; i++) {
        const element = this.state.user.zones[i]
        let str = element?.name

        var url = global.config.url + 'api/incidentbyzone/' + element.name + '/'
        var urls =
          global.config.url +
          'api/incidentbyzone/' +
          str.charAt(0).toUpperCase() +
          str.slice(1) +
          '/'
        let res = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer '.concat(sessionStorage.token),
          },
        })

        let resp = await axios.get(urls, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer '.concat(sessionStorage.token),
          },
        })
        //let messages = res.data
        //console.log(res.data)
        for (let j = 0; j < res.data.length; j++) {
          const elt = res.data[j]
          data.push(elt)
        }

        for (let j = 0; j < resp.data.length; j++) {
          const elt = resp.data[j]
          data.push(elt)
        }
      }
      // console.log('data elu',)
      this.setState({
        data: data.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i).sort((a, b) => b?.id - a?.id),
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  onSelectZone = (e) => {
    console.log('choice=>', e)
    let { obj } = this.state
    // let obj = {};
    // eluZones.forEach((element) => {
    //   obj = {
    //     ...obj,
    //     [element]: listIncZone.filter((f) => f.zone === element),
    //   };
    // });
    this.setState({ data: obj[e.value], displayZone: e.value })
  }

  render() {
    //console.log("Hoooooo=>", JSON.parse(sessionStorage.user));

    let optionscat = this.state.categories.map(function (category) {
      return {
        value: category.id,
        label: category.name,
        key: category.id + 'unique-key',
      }
    })

    let optionsIndic = this.state.indicateurs.map(function (ind) {
      return { value: ind.id, label: ind.name, key: ind.id + 'unique-key' }
    })

    const optionsZone = this.state.list_zones.map(function (zone) {
      return {
        value: zone.name,
        label: zone.name,
        key: zone.id + 'unique-key',
        id: zone.id,
      }
    })

    // console.log("optionsZone=>", this.state.list_zones[0]?.name);

    // const optionstype = [
    //   { value: 'declared', label: 'En attente' },
    //   { value: 'resolved', label: 'resolu' },
    // ]
    const optionstype = [
      { label: 'En attente', value: 'declared' },
      { label: 'Pris en charge', value: 'taken_into_account' },
      { label: 'En cours de résoluton', value: 'in_progress' },
      { label: 'Résolu', value: 'resolved' },
    ]

    let changeStateModal = (
      <div className="modal fade">
        <Modal
          backdrop="static"
          keyboard={false}
          show={this.state.changeState}
          onHide={this.onChangeState}
        >
          <ModalHeader closeButton>Status Incident</ModalHeader>
          <ModalBody>
            <Form encType="multipart/form-data">
              <FormGroup>
                <label htmlFor="etat">Statut Incident:</label>
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  defaultValue={
                    optionstype.filter(
                      (option) => option.value === this.state.EditIncident,
                    )[0]
                  }
                  name="etat"
                  options={optionstype}
                  onChange={this.handleSelectChange}
                />
              </FormGroup>
            </Form>

            {/* <div style={{ marginTop: '-5px', textAlign: 'end' }}>
              <button
                className="btn btn-warning justify-content-end mb-auto"
                onClick={this.handleChangeStatus}
                disabled={this.state.isChanged}
              >
                {this.state.isChanged ? 'Modifier' : 'Modification en cours...'}
              </button>
            </div> */}
          </ModalBody>
          <ModalFooter>
            {!this.state.isChanged ? (
              <Button
                className="btn btn-primary"
                onClick={this.handleChangeStatus}
              >
                Modifier
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Modification en cours...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    )

    let showRapportModal = (
      <Modal show={this.state.showRapportModal} onHide={this.handleModalClose}>
        <ModalHeader closeButton>
          Commande de rapport pour{' '}
          <span className="map-color">{this.state.newIncident.title}</span>
        </ModalHeader>
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
                  let { newReport } = this.state
                  newReport.details = e.target.value
                  this.setState({ newReport }, console.log(this.state))
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
                value={this.state.newIncident.zone}
                onChange={(e) => {
                  let { newReport } = this.state
                  newReport.zone = e.target.value
                  this.setState({ newReport }, console.log(this.state))
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
                placeholder={this.state.newIncident.id}
                value={this.state.newIncident.id}
                onChange={(e) => {
                  let { newReport } = this.state
                  newReport.incident_id = e.target.value
                  this.setState({ newReport }, console.log(this.state))
                }}
                disabled
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="phone">Date souhaitée de Livraison:</label>
              <input
                className="form-control"
                type="date"
                id="phone"
                name="date_livraison"
                value={this.state.newReport.date_livraison}
                onChange={(e) => {
                  let { newReport } = this.state
                  newReport.date_livraison = e.target.value
                  this.setState({ newReport }, console.log(this.state))
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
            )}{' '}
            <Button className="btn btn-danger" onClick={this.handleModalOpen}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )
    let newIncidentModal = (
      <Modal show={this.state.newIncidentModal} onHide={this.handleModalOpen}>
        <ModalHeader closeButton>Nouveau Incident</ModalHeader>
        <Form encType="multipart/form-data">
          <ModalBody className="col-sm-12">
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Titre:</label>
              <input
                className="form-control"
                type="text"
                id="prenom"
                name="title"
                value={this.state.newIncident.title}
                onChange={(e) => {
                  let { newIncident } = this.state
                  newIncident.title = e.target.value
                  this.setState({ newIncident }, console.log(this.state))
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Zone:</label>
              <input
                className="form-control"
                type="text"
                id="zone"
                name="zone"
                value={sessionStorage.zone}
                onChange={(e) => {
                  let { newIncident } = this.state
                  newIncident.zone = e.target.value
                  this.setState({ newIncident }, console.log(this.state))
                }}
                disabled
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Description:</label>
              <textarea
                className="form-control"
                type="text"
                id="desc"
                name="description"
                value={this.state.newIncident.description}
                onChange={(e) => {
                  let { newIncident } = this.state
                  newIncident.description = e.target.value
                  this.setState({ newIncident }, console.log(this.state))
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="from">Categories:</label>
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
                onChange={this.addFileHandleChange}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="video_inc">Video:</label>
              <input
                className="form-control"
                type="file"
                id="video_inc"
                name="video"
                onChange={this.addFileHandleChange}
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
                  let { newIncident } = this.state
                  newIncident.lattitude = e.target.value
                  this.setState({ newIncident }, console.log(this.state))
                }}
              />
            </FormGroup>
            <FormGroup className="col-sm-6">
              <label htmlFor="aud">Audio:</label>
              <input
                className="form-control"
                type="file"
                id="aud"
                name="video"
                // value={this.state.newIncident.audio}
                onChange={(e) => {
                  let { newIncident } = this.state
                  newIncident.audio = e.target.files[0]
                  this.setState({ newIncident }, console.log(this.state))
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
                  let { newIncident } = this.state
                  newIncident.longitude = e.target.value
                  this.setState({ newIncident }, console.log(this.state))
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
            )}{' '}
            <Button className="btn btn-danger" onClick={this.handleModalOpen}>
              Annuler
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    )

    if (this.state.show) {
      return (
        <Alert
          bsStyle="danger"
          onDismiss={(e) => this.setState({ show: false })}
        >
          <h4>Suppresion</h4>
          <p>Voulez vous vraiment supprimer</p>
          <p>
            {!this.state.inProgress ? (
              <Button bsStyle="danger" onClick={(e) => this.deleteIncident(e)}>
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
      )
    }
    const csvheaders = [
      { label: 'Titre', key: 'title' },
      { label: 'Description', key: 'description' },
      { label: 'Zone', key: 'zone' },
      { label: 'Lattitude', key: 'lattitude' },
      { label: 'Longitude', key: 'longitude' },
      { label: 'Etat', key: 'etat' },
      { label: 'Utilisateur', key: 'user_id' },
      { label: 'Indicateur', key: 'indicateur_id' },
      { label: 'Categorie', key: 'category_id' },
    ]
    const csvdata = this.state.data

    const columns = [
      {
        name: 'id',
        label: 'ID',
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        name: 'title',
        label: 'Titre',
        options: {
          filter: true,
          filterType: 'dropdown',
          sort: true,
        },
      },
      {
        name: 'description',
        label: 'Description',
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: 'categorie',
        label: 'Categories',
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: 'indicateur',
        label: 'Indicateur',
        options: {
          filter: true,
          sort: false,
        },
      },
      {
        name: 'etat',
        label: 'Statut',
        options: {
          filter: true,
          filterType: 'custom',
          sort: false,
          customBodyRender: (value, row, updateValue) =>
            value === 'resolved' ? (
              <button
                onClick={() => this.onChangeState(value, row.rowData[0])}
                className="admin-s"
              >
                Résolu
                {/* {console.log('row', row)} */}
              </button>
            ) : value === 'declared' ? (
              <button
                onClick={() => this.onChangeState(value, row.rowData[0])}
                className="visitor-s"
              >
                En attente
              </button>
            ) : value === 'taken_into_account' ? (
              <button
                onClick={() => this.onChangeState(value, row.rowData[0])}
                className="taken_into_account"
              >
                Pris en Charge
              </button>
            ) : value === 'in_progress' ? (
              <button
                onClick={() => this.onChangeState(value, row.rowData[0])}
                className="citizen-s"
              >
                En cours
              </button>
            ) : null,
          customFilterListOptions: {
            render: (v) => v,
            update: (filterList, filterPos, index) => {
              //console.log(filterList, filterPos, index)
              filterList[index] = []
              console.log('update', filterList[index])
              return filterList
            },
          },
          filterOptions: {
            logic: (etat, filters, row) => {
              //console.log('etat', etat, filters, row)
              if (filters.length && filters.length > 1)
                return !filters.includes(etat)
              return false
            },
            display: (filterList, onChange, index, column) => {
              console.log('object', filterList[index])

              const etatstype = [
                { label: 'En attente', value: 'declared' },
                { label: 'Prise en charge', value: 'taken_into_account' },
                { label: 'En cours de résoluton', value: 'in_progress' },
                { label: 'Résolu', value: 'resolved' },
              ]
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
                      filterList[index] = event.target.value
                      onChange(filterList[index], index, column)
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
              )
            },
          },
        },
      },
      {
        name: 'date creation',
        label: 'Date Creation',
        options: {
          filter: true,
          filterType: 'dropdown',
          sort: true,
        },
      },
      {
        name: 'date resolution',
        label: 'Date Resolution',
        options: {
          filter: true,
          filterType: 'dropdown',
          sort: false,
        },
      },
      {
        name: 'zone',
        label: 'Zone',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'actions',
        label: 'Action',
        options: {
          filter: false,
          sort: false,
          download: false,
        },
      },
    ]

    const data = this.state.data.map((item, i) => {
      return [
        item?.id,
        item.title,
        item.description,
        this.getCategoryById(item.category_ids),
        this.getIndicateurById(item.indicateur_id),
        item.etat,
        this.formatDate(item.created_at),
        this.formatDate(item.updated_at),
        item.zone,
        <div className="btn-group">
          <Button
            onClick={() => this.onShowIncident(item)}
            className="btn btn-default btn-xs map-color nb"
          >
            <i className="fas fa-eye fa-x"></i>
          </Button>
          {/* <Button
            className="btn btn-danger btn-xs red-color nb"
            onClick={(e) => {
              this.onDeleteIncident(item);
              this.setState({ inProgress: false });
            }}
          >
            <i className="fas fa-trash fa-x"></i>
          </Button>{" "} */}
        </div>,
      ]
    })

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      hasIndex: true /* <-- use numbers for rows*/,
      searchBox: true /* <-- search true or false */,
      csv: true /* <-- csv download true or false */,
      selectableRows: false,
    }

    return (
      <div className="content">
        <Grid fluid>
          <Card
            content={
              <React.Fragment>
                <Button className="pull-right" style={btnStyle}>
                  <CSVLink
                    filename="incidents.csv"
                    data={csvdata}
                    headers={csvheaders}
                  >
                    <i className="fa fa-download"></i>
                    Export
                  </CSVLink>
                </Button>
                <Button
                  style={btnStyle}
                  onClick={this.handleModalOpen}
                  className="pull-right"
                >
                  Nouveau
                </Button>
                {/* <div style={{ display: "flex", marginTop: "-1em" }}>
                  <Select
                    name="zone"
                    // defaultValue={
                    //   optionsZone.length > 0 ? optionsZone[0].label : ""
                    // }
                    options={optionsZone}
                    onChange={(e) => this.onSelectZone(e)}
                    className="basic-single col-md-3 map-color pull-left"
                    classNamePrefix="select"
                  />
                </div> */}
              </React.Fragment>
            }
          />
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={'Liste des Incidents: ' + this.state.displayZone}
              data={data}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
        </Grid>
        {this.renderShowIncident()}
        {showRapportModal}
        {newIncidentModal}
        {changeStateModal}
      </div>
    )
  }
}
const btnStyle = {
  marginTop: '-1em',
  marginRight: '5px',
}
