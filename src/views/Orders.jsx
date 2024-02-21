import React, { Component } from 'react'
import {
    Grid, Col, Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Form, ControlLabel, FormControl, Alert
} from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from "variables/Variables.jsx";
import axios from 'axios';
export default class Orders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(sessionStorage.getItem("user")),
            data: [],
            newOrdModal: false,
            editOrdModal: false,
            show: false,
            users: [],
            journeys: [],
            newOrd: {
                nb_passengers: 0,
                nb_bagages: 0,
                user: {},
                journey: {
                    station_from: {},
                    station_to: {}
                }

            },
        }
    }
    componentDidMount = () => {
        // console.log(this.state.user.id);
        this._getOrdersByUser();
        // this._getUsers()
        // this._getJourneys()
        //this._getOrders();
    }

    handleModalOpen = () => {
        this.setState({ newOrdModal: !this.state.newOrdModal, inProgress: !this.state.inProgress })

    }
    handleModalEditOpen = (item) => {
        if (item.user) {
            console.log("element à modifier ", item)
            this.setState({ newOrd: item })
        }
        this.setState({ editOrdModal: !this.state.editOrdModal, inProgress: false })

    }
    onDeleteOrder = (item) => {
        if (item) {
            console.log("element à supprimer ", item)
            this.setState({ newOrd: item })
        }
        this.setState({ show: true })



    }
    _getUsers = async () => {
        try {
            let res = await axios.get('http://51.38.32.179:801/api/listUsers',
                {
                    headers:
                        { Authorization: `Bearer${sessionStorage.token}` }
                }
            )
            console.log("users", res);
            let { data } = res.data;
            this.setState({ users: data })
        } catch (error) {
            console.log(error.message);
        }

    }
    _getJourneys = async () => {
        try {
            let res = await axios.get('http://51.38.32.179:801/api/listTrajetsByTransporter/' + sessionStorage.getItem("user_id"),
                {
                    headers:
                        { Authorization: `Bearer${sessionStorage.token}` }
                }
            )
            console.log("journey", res.data);
            let data = res.data["datas"];
            this.setState({ journeys: data })
            this.setState({ inProgress: !this.state.inProgress, show: false })
        } catch (error) {
            console.log(error.message);
        }

    }

    _getOrdersByUser = () => {
        axios.get('http://51.38.32.179:801/api/getOrdersByTransporter/' + sessionStorage.getItem("user_id"), {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer${sessionStorage.token}`
            }
        }).then((response) => {
            console.log(response)
            this.setState({ data: response.data.data });
            this.setState({ inProgress: !this.state.inProgress, newOrdModal: false, editOrdModal: false, show: false })

        }
        ).catch((error) => {
            console.log(error.message);
        })
    }
    addOrder = (e) => {
        e.preventDefault();
        this.setState({ inProgress: !this.state.inProgress })
        console.log("new order ", this.state.newOrd)

        axios.post("http://51.38.32.179:801/api/orders", this.state.newOrd)
            .then((response) => {
                console.log(response);
                //let data  = this.state.data
                //data.push(response.data.data)
                this._getOrdersByUser()

            }).catch((error) => {
                this.setState({ inProgress: !this.state.inProgress })
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request.data);
                } else {
                    console.log(error.message);
                }

            })
    }
    editOrder = (e) => {
        e.preventDefault();
        console.log("edit order ", this.state.newOrd)
        this.state.newOrd.user_id = this.state.newOrd.user._id
        this.state.newOrd.journey_id = this.state.newOrd.journey._id
        axios.put("http://51.38.32.179:801/api/orders/" + this.state.newOrd._id, this.state.newOrd)
            .then((response) => {
                console.log(response);
                this._getOrdersByUser()
            }).catch((error) => {
                this.setState({ inProgress: !this.state.inProgress })
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request.data);
                } else {
                    console.log(error.message);
                }

            })
    }
    deleteOrder = (e) => {
        this.setState({ inProgress: true })
        e.preventDefault();
        axios.delete("http://51.38.32.179:801/api/orders/" + this.state.newOrd._id)
            .then((response) => {
                console.log(response);
                //let data  = this.state.data
                //data.push(response.data.data)
                this._getOrdersByUser()


            }).catch((error) => {
                //this.setState({ inProgress: !this.state.inProgress, newOrdModal:false, editOrdModal:false, show:false})
                this._getOrdersByUser()
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request.data);
                } else {
                    console.log(error.message);
                }

            })
    }
    render() {
        if (this.state.show) {

            return (
                <Alert bsStyle="danger" onDismiss={(e) => this.setState({ show: false })}>
                    <h4>Suppresion</h4>
                    <p>
                        Voulez vous vraiment supprimer cette réservation
                    </p>
                    <p>
                        {!this.state.inProgress ?
                            <Button bsStyle="danger" onClick={this.deleteOrder}>Supprimer</Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }

                        <span> or </span>
                        <Button onClick={(e) => this.setState({ show: false })}>Annuler</Button>
                    </p>
                </Alert>
            );
        }
        let { data, users, journeys } = this.state;
        console.log("data users", this.state.users)

        users = this.state.users.map((item, i) => {

            return (
                <option value={item._id} key={item._id} id={item._id}>{item.first_name} {item.last_name}</option>
            )
        }
        )
        journeys = this.state.journeys.map((item, i) => {

            return (
                <option value={item._id} key={item._id} id={item._id}>{item.station_from.name}-{item.station_to.name}</option>
            )
        }
        )
        let newOrdModal = (
            <Modal show={this.state.newOrdModal} onHide={this.handleModalOpen} >
                <ModalHeader closeButton >New Order</ModalHeader>
                <Form encType="multipart/form-data">
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Client</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newOrd } = this.state
                                console.log("selected ", e.target.value)
                                newOrd.user_id = e.target.value
                                this.setState({ newOrd })
                            }}>
                                <option value="-1" >--</option>
                                {users}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Trajet</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newOrd } = this.state
                                console.log("selected ", e.target.value)
                                newOrd.journey_id = e.target.value
                                this.setState({ newOrd })
                            }}>
                                <option value="-1" >--</option>
                                {journeys}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Nombre Passagers:</label>
                            <input className="form-control" type="number"
                                id="price"
                                name="price"
                                value={this.state.newOrd.nb_passengers}
                                onChange={(e) => {
                                    let { newOrd } = this.state
                                    newOrd.nb_passengers = e.target.value
                                    this.setState({ newOrd })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Nombre bagages:</label>
                            <input className="form-control" type="number"
                                id="price"
                                name="price"
                                value={this.state.newOrd.nb_bagages}
                                onChange={(e) => {
                                    let { newOrd } = this.state
                                    newOrd.nb_bagages = e.target.value
                                    this.setState({ newOrd })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Etat Reservation</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newOrd } = this.state
                                console.log("selected ", e.target.value)
                                newOrd.status = e.target.value
                                this.setState({ newOrd })
                            }}>
                                <option value="-1" >--</option>
                                <option value="0" >En cours</option>
                                <option value="1" >Validée</option>
                                <option value="2" >Annulée</option>
                            </FormControl>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.addOrder}>Ajouter
                            </Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        {' '}
                        <Button className="btn btn-danger"
                            onClick={this.handleModalOpen}>Annuler</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
        let editOrdModal = (
            <Modal show={this.state.editOrdModal} onHide={this.handleModalEditOpen} >
                <ModalHeader closeButton >Edit Order</ModalHeader>
                <Form encType="multipart/form-data">
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Client</ControlLabel>
                            <FormControl componentClass="select" disabled placeholder="select" onChange={(e) => {
                                let { newOrd } = this.state
                                console.log("selected ", e.target.value)
                                newOrd.user_id = e.target.value
                                this.setState({ newOrd })
                            }}>
                                <option value={this.state.newOrd.user._id} >{this.state.newOrd.user.first_name} {this.state.newOrd.user.last_name}</option>
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Trajet</ControlLabel>
                            <FormControl componentClass="select" disabled placeholder="select" onChange={(e) => {
                                let { newOrd } = this.state
                                console.log("selected ", e.target.value)
                                newOrd.journey_id = e.target.value
                                this.setState({ newOrd })
                            }}>
                                <option value={this.state.newOrd.journey._id} >{this.state.newOrd.journey.station_from.name}-{this.state.newOrd.journey.station_to.name}</option>
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Nombre de Passagers:</label>
                            <input className="form-control" type="number"
                                id="price"
                                name="price"
                                value={this.state.newOrd.nb_passengers}
                                onChange={(e) => {
                                    let { newOrd } = this.state
                                    newOrd.nb_passengers = e.target.value
                                    this.setState({ newOrd })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Nombre de bagages:</label>
                            <input className="form-control" type="number"
                                id="price"
                                name="price"
                                value={this.state.newOrd.nb_bagages}
                                onChange={(e) => {
                                    let { newOrd } = this.state
                                    newOrd.nb_bagages = e.target.value
                                    this.setState({ newOrd })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Etat Reservation</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newOrd } = this.state
                                console.log("selected ", e.target.value)
                                newOrd.status = e.target.value
                                this.setState({ newOrd })
                            }}>
                                <option value="0" >En cours</option>
                                <option value="1" >Validée</option>
                                <option value="2" >Annulée</option>
                            </FormControl>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.editOrder}>Modifier
                            </Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        {' '}
                        <Button className="btn btn-danger"
                            onClick={this.handleModalEditOpen}>Annuler</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )

        let dataOrders = this.state.data.map((item, i) => {
            return (
                <tr key={i} id={item.id}>
                    <td>{item.user.first_name} {item.user.last_name}</td>
                    <td>{item.journey.station_from.name} - {item.journey.station_to.name}</td>
                    <td>{item.nb_passengers}</td>
                    <td>{item.nb_bagages}</td>
                    {
                        item.status === "0" ? <td style={{ color: "#FBAD15" }}>En cours</td>
                            : item.status === "1" ? <td style={{ color: "green" }}>Validée</td>
                                : <td style={{ color: "red" }}>Annulée</td>
                    }

                    <td>
                        <div className="btn-group">
                            <Button className="btn btn-default btn-xs">
                                <i className="fas fa-eye"></i>
                            </Button>
                            <Button className="btn btn-default btn-xs" onClick={(e) => this.handleModalEditOpen(item)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button className="btn btn-danger btn-xs" onClick={(e) => {
                                this.onDeleteOrder(item)
                                this.setState({ inProgress: false })
                            }}>
                                <i className="fas fa-trash"></i>
                            </Button>
                        </div>
                    </td>
                </tr>
            )
        });
        return (

            <div className="content" >
                {newOrdModal}
                {editOrdModal}
                <Grid fluid>
                    <Col md={12}>
                        <Button style={btnStyle} onClick={(e) => {
                            this.handleModalOpen()
                            this.setState({ inProgress: false })
                        }} className="pull-right">Add New</Button>
                        <Card
                            title="Orders"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Users</th>
                                            <th>Journeys</th>
                                            <th>Number Passengers</th>
                                            <th>Nombres Bagages</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataOrders}
                                    </tbody>
                                </Table>
                            }
                        />
                    </Col>
                </Grid>
            </div >
        )
    }
}
