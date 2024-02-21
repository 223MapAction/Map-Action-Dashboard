import React, { Component } from 'react'
import {
  Col,
  Row,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  Form,
} from 'react-bootstrap'
import axios from 'axios'
import Select from 'react-select'
import swal from 'sweetalert'

import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { elementType } from 'prop-types'

// import makeAnimated from 'react-select/lib/animated';

export default class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: JSON.parse(sessionStorage.user),
      data: [],
      onReply: false,
      showMessage: false,
      inProgress: false,
      communauteMessages: [],
      userMessages: [],
      newMessage: {
        objet: '',
        message: '',
        communaute: '',
        user_id: '',
        reply: '',
      },
      fields: {},
      zones: [],
    }
    this.onReplyM = this.onReplyM.bind(this)
    this.onshowMessage = this.onshowMessage.bind(this)
    this.handleShowMessage = this.handleShowMessage.bind(this)
    this.handleReplyMessage = this.handleReplyMessage.bind(this)
  }

  componentDidMount = () => {
    this.getZones()
    this.__getMessageUser()
  }

  __getMessageUser = async () => {
    //let com = this.state.user.communaute
    //console.log(this.state.user)
    let data = []
    //if (com !== null) {
    try {

      const userId = this.state.user.id
      var url =
        global.config.url +
        'api/messagebyuser/' +
        userId +
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
      //this.setState({messages: res.data})
      //data = [...this.state.messages]


      //console.log('data', data)
      this.setState({ userMessages: data })
    } catch (error) {
      console.log(error.message)
    }
    //}
  }

  __getMessageZones = async () => {
    //let com = this.state.user.communaute
    //console.log(this.state.user)
    let data = []
    //if (com !== null) {
    try {
      for (let i = 0; i < this.state.user.zones.length; i++) {
        const element = this.state.user.zones[i]
        var url =
          global.config.url +
          'api/messagebyzone/' +
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
        //this.setState({messages: res.data})
        //data = [...this.state.messages]
      }

      //console.log('data', data)
      this.setState({ communauteMessages: data })
    } catch (error) {
      console.log(error.message)
    }
    //}
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

      await this.__getMessageZones()
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
        MuiTablePagination: {
          caption: {
            fontSize: '15px',
          },
        },
        MuiTablePagination: {
          caption: {
            fontSize: '15px',
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

  formatUser = (user) => {
    console.log('useruseruser', user)
    if (user) {
      let fullname = user.first_name + ' ' + user.last_name;

      return fullname

    } else {
      return null
    }
  }

  onReplyMessage = () => {
    this.setState((prevState) => {
      return { onReply: !prevState.onReply }
    })
    if (this.state.onReply === false) {
      this.setState({
        newMessage: {
          objet: '',
          message: '',
          communaute: '',
          user_id: '',
        },
      })
    }
  }

  onReplyM = (item) => {
    let fields = this.state.fields
    if (item) {
      console.log('message a repondre ', item)
      fields['message'] = item.id
      fields['elu'] = this.state.user.id
      this.setState({ newMessage: item })
    }
    // this.setState((prevState) => {
    //   return { onReply: !.onReply };
    // });
    this.setState({ onReply: true, fields })
  }

  onshowMessage = (item) => {
    if (item) {
      console.log('message a afficher ', item)
      this.setState({ newMessage: item })
    }
    this.setState({ showMessage: true })
  }

  handleShowMessage = () => {
    this.setState((prevState) => {
      return { showMessage: !prevState.showMessage }
    })
    if (this.state.onShow === false) {
      this.setState({
        newMessage: {
          objet: '',
          message: '',
          communaute: '',
          user_id: '',
        },
      })
    }
  }

  handleReplyMessage = (e) => {
    e.preventDefault()
    this.setState({ inProgress: !this.state.inProgress })

    var url = global.config.url + 'api/responsemessage/'
    console.log('fields', this.state.fields)
    axios
      .post(url, this.state.fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      .then((response) => {
        console.log(response)
        this.setState({
          inProgress: !this.state.inProgress,
          onReply: !this.state.onReply,
          fields: {},
        })
        swal('Succes', 'Votre message a ete envoye', 'success')
      })
      .catch((error) => {
        this.setState({ inProgress: !this.state.inProgress })
        if (error.response) {
          console.log(error.response.status)
          swal('Erreur', "Erreur lors de l'envoie, veuillez reessayer", 'error')
          console.log(error.response.data)
        } else if (error.request) {
          console.log(error.request.data)
        } else {
          console.log(error.message)
        }
      })
  }

  render() {

    this.state.communauteMessages.length && this.state.communauteMessages.forEach(message => {
      this.state.zones.forEach(element => {
        if (message.zone === element.id) {
          message.zone = element
        }
      });
    })


    const columns = [
      {
        name: "user_id",
        label: "Utilisateur",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'objet',
        label: 'Objet',
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "message",
      //   label: "Message",
      //   options: {
      //     filter: true,
      //     sort: true,
      //   },
      // },
      {
        name: 'date',
        label: 'Date',
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
          sort: true,
        },
      },
      {
        name: 'actions',
        label: 'Actions',
        options: {
          filter: true,
          sort: true,
        },
      },
    ]



    const columns2 = [
      {
        name: "user_id",
        label: "Utilisateur",
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'objet',
        label: 'Objet',
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'date',
        label: 'Date',
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "zone",
      //   label: "Zone",
      //   options: {
      //     filter: true,
      //     sort: true,
      //   },
      // },
      {
        name: 'actions',
        label: 'Actions',
        options: {
          filter: true,
          sort: true,
        },
      },
    ]

    const data2 = this.state.userMessages.map((item, i) => {
      return [
        this.formatUser(item.user_id),
        item.objet,
        // item.message,
        this.formatDate(item.created_at),
        //  item.zone.name,
        <div className="btn-group">
          <Button
            className="btn btn-default btn-xs map-color nb"
            onClick={() => this.onReplyM(item)}
          >
            <i className="fa fa-comment fa-x"></i>
          </Button>
          <Button
            className="btn btn-default btn-xs map-color nb"
            onClick={() => this.onshowMessage(item)}
          >
            <i className="fa fa-eye fa-x"></i>
          </Button>
          {/* <Button className="btn btn-danger btn-xs red-color nb">
            <i className="fas fa-trash fa-x"></i>
          </Button>{' '} */}
        </div>,
      ]
    })


    const data = this.state.communauteMessages.map((item, i) => {
      return [
        this.formatUser(item.user_id),
        item.objet,
        // item.message,
        this.formatDate(item.created_at),
        item.zone.name,
        <div className="btn-group">
          <Button
            className="btn btn-default btn-xs map-color nb"
            onClick={() => this.onReplyM(item)}
          >
            <i className="fa fa-comment fa-x"></i>
          </Button>
          <Button
            className="btn btn-default btn-xs map-color nb"
            onClick={() => this.onshowMessage(item)}
          >
            <i className="fa fa-eye fa-x"></i>
          </Button>
          <Button className="btn btn-danger btn-xs red-color nb">
            {/* <i className="fas fa-trash fa-x"></i> */}
          </Button>{' '}
        </div>,
      ]
    })
    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'stacked',
      hasIndex: true /* <-- use numbers for rows*/,
    }

    let replyMessage = (
      <div className="modal fade">
        <Modal size="sm" show={this.state.onReply} onHide={this.onReplyMessage}>
          <ModalHeader closeButton>
            Discussion :{this.state.newMessage.objet}
          </ModalHeader>
          <ModalBody className="col-sm-12">
            <Form encType="multipart/form-data">
              <FormGroup className="col-sm-6">
                <label htmlFor="from">
                  Message:
                  <p>{this.state.newMessage.message}</p>
                </label>
              </FormGroup>
              <FormGroup className="col-sm-12">
                <label htmlFor="from">Reponse:</label>
                <textarea
                  className="form-control"
                  type="text"
                  id="msg"
                  name="message"
                  placeholder="Votre Reponse"
                  value={this.state.fields ? this.state.fields.response : ''}
                  onChange={(e) => {
                    let fields = this.state.fields
                    fields['response'] = e.target.value
                    this.setState({ fields })
                  }}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            {!this.state.inProgress ? (
              <Button
                className="btn btn-primary"
                onClick={(e) => this.handleReplyMessage(e)}
              >
                Repondre
              </Button>
            ) : (
              <Button className="btn btn-primary">
                Loading...
                <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
              </Button>
            )}{' '}
            <Button className="btn btn-danger" onClick={this.onReplyMessage}>
              Annuler
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )

    let showMessage = (
      <div className="modal fade">
        <Modal show={this.state.showMessage} onHide={this.handleShowMessage}>
          <ModalHeader closeButton className="map-color fs-20 t-center">
            {this.state.newMessage.objet}
          </ModalHeader>

          <ModalBody className="col-sm-12">
            <div className="col-sm-12">
              <label htmlFor="code" className="map-color fs-18">
                Contenu:
              </label>
              <p>{this.state.newMessage.message}</p>
            </div>

            <div className="col-sm-6 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Date :
              </label>
              <p>{this.formatDate(this.state.newMessage.created_at)}</p>
            </div>
            {this.state.newMessage.zone ?
              <div className="col-sm-6">
                <label htmlFor="code" className="map-color fs-18">
                  Zone:
                </label>
                <p>{this.state.newMessage.zone?.name}</p>
              </div>
              :
              <div className="col-sm-6">
                <label htmlFor="code" className="map-color fs-18">
                  Utilisateur:
                </label>
                <p>{this.formatUser(this.state.newMessage.user_id)} </p>
              </div>
            }
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
    )

    return (
      <div className="content">
        <div className="row">
          <div className="col-md-6">
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title={'Liste des Messages de vos zones'}
                data={data}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          <div className="col-md-6">
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title={'Liste des Messages des organisations'}
                data={data2}
                columns={columns2}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </div>
        {replyMessage}
        {showMessage}
      </div>
    )
  }
}
