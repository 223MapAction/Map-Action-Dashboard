import React, { Component } from 'react'
import axios from 'axios'
import MUIDataTable from 'mui-datatables'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
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

export default class Contact extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: JSON.parse(sessionStorage.user),
      data: [],
      showMessage: false,
      onReply: false,
      newMessage: {},
    }
  }

  componentDidMount() {
    this.getAllContact()
  }

  onReplyM = (item) => {
    if (item) {
      console.log('message a repondre ', item)
      this.setState({ newMessage: item })
    }
    // this.setState((prevState) => {
    //   return { onReply: !.onReply };
    // });
    this.setState({ onReply: true })
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
        newMessage: {},
      })
    }
  }

  getAllContact = async () => {
    var url = global.config.url + 'api/contact/'

    await axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      .then((response) => {
        //console.log('response', response)
        this.setState({ data: response.data.results })
      })
      .catch((e) => {
        console.log('error', e)
      })
  }

  getMuiTheme = () => {
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

  render() {
    // let replyMessage = (
    //   <div className="modal fade">
    //     <Modal size="sm" show={this.state.onReply} onHide={this.onReplyMessage}>
    //       <ModalHeader closeButton>
    //         Discussion :{this.state.newMessage.objet}
    //       </ModalHeader>
    //       <ModalBody className="col-sm-12">
    //         <Form encType="multipart/form-data">
    //           <FormGroup className="col-sm-6">
    //             <label htmlFor="from">
    //               Message:
    //               <p>{this.state.newMessage.message}</p>
    //             </label>
    //           </FormGroup>
    //           <FormGroup className="col-sm-12">
    //             <label htmlFor="from">Reponse:</label>
    //             <textarea
    //               className="form-control"
    //               type="text"
    //               id="msg"
    //               name="message"
    //               placeholder="Votre Reponse"
    //               value={this.state.newMessage.reply}
    //               onChange={(e) => {
    //                 let { newMessage } = this.state
    //                 newMessage.reply = e.target.value
    //                 this.setState({ newMessage })
    //               }}
    //             />
    //           </FormGroup>
    //         </Form>
    //       </ModalBody>
    //       <ModalFooter>
    //         {!this.state.inProgress ? (
    //           <Button
    //             className="btn btn-primary"
    //             onClick={(e) => this.handleReplyMessage(e)}
    //           >
    //             Repondre
    //           </Button>
    //         ) : (
    //           <Button className="btn btn-primary">
    //             Loading...
    //             <i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
    //           </Button>
    //         )}{' '}
    //         <Button className="btn btn-danger" onClick={this.onReplyMessage}>
    //           Annuler
    //         </Button>
    //       </ModalFooter>
    //     </Modal>
    //   </div>
    // )

    let showMessage = (
      <div className="modal fade">
        <Modal show={this.state.showMessage} onHide={this.handleShowMessage}>
          <ModalHeader closeButton className="map-color fs-20 t-center">
            De {this.state.newMessage.email}
          </ModalHeader>

          <ModalBody className="row">
            <Col
              md={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                marginBottom: '10px',
              }}
            >
              Objet: {this.state.newMessage.objet}
            </Col>
            <Col
              style={{
                width: '100%',
                margin: 'auto',
                padding: '15px',
                fontFamily: 'sans-serif',
                fontSize: '20px',
                marginBottom: '10px',
              }}
            >
              {this.state.newMessage.message}
            </Col>
            <Col md={12} style={{ marginTop: '-5px', textAlign: 'end' }}>
              <button
                className="btn btn-secondary justify-content-end mb-auto"
                onClick={this.handleShowMessage}
              >
                Fermer
              </button>
            </Col>
            {/* <div className="col-sm-6">
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
            </div> */}
          </ModalBody>
          <ModalFooter></ModalFooter>
        </Modal>
      </div>
    )
    const columns = [
      {
        name: 'objet',
        label: <span style={{ fontSize: "14px" }} >Objet</span>,
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'email',
        label: <span style={{ fontSize: "14px" }} >Email</span>,
        options: {
          filter: true,
          sort: true,
        },
      },
      {
        name: 'date',
        label: <span style={{ fontSize: "14px" }} >Date</span>,
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "utilisateur",
      //   label: "Utilisateur",
      //   options: {
      //     filter: true,
      //     sort: true,
      //   },
      // },
      {
        name: 'actions',
        label: <span style={{ fontSize: "14px" }} >Action</span>,
        options: {
          filter: true,
          sort: true,
        },
      },
    ]

    const data = this.state.data.map((item, i) => {
      return [
        item.objet,
        item.email,
        this.formatDate(item.created_at),

        // item.user_id,
        <div className="btn-group">
          {/* <Button
            className="btn btn-default btn-xs map-color nb"
            onClick={() => this.onReplyM(item)}
          >
            <i className="fa fa-comment fa-x"></i>
          </Button> */}
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
    const options = {
      filter: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      hasIndex: true /* <-- use numbers for rows*/,
    }
    return (
      <div className="content">
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={'Liste des Messages de votre communaute'}
            data={data}
            columns={columns}
            options={options}
          />
        </MuiThemeProvider>
        {/* {replyMessage} */}
        {showMessage}
      </div>
    )
  }
}
