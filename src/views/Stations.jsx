import React, { Component } from 'react'
import {
    Grid, Col, Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Form, ControlLabel, FormControl, Alert
} from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from "variables/Variables.jsx";
import axios from 'axios';
export default class Stations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
            },
            locations: [],
            cities: [],
            newIncidentModal: false,
            editIncidentModal: false,
            visible: false,
            error: false,
            message: [],
            show: false,
        }
    }

    componentDidMount = () => {
        this._getIncidents();
        this._getLocations();
        this._getCities();
    }

    onShowAlert = () => {
        this.setState({ visible: true }, () => {
            window.setTimeout(() => {
                this.setState({ visible: false, message: [] })
            }, 5000) // _getCities = async () => {
            //     var url = 'http://51.38.32.179:801/api/cities';
            //     try {
            //         let res = await axios.get(url, {
            //             headers: {
            //                 Authorization: `Bearer${sessionStorage.token}`
            //             }
            //         });
            //         console.log(res.data)
            //         console.log("cities: ", res.data["data"])
            //         let data = res.data["data"];
            //         this.setState({ cities: data });
            //     } catch (error) {
            //         console.log(error.message);
            //     }
            // }
        });
    }

    _getIncidents = async () => {
        var url = 'http://mapaction.withvolkeno.com/api/incident/';
        try {
            // let res = await axios.get(url + sessionStorage.getItem("user_id"), 
            let res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer${sessionStorage.token}`
                }
            });
            console.log(res.data)
            // console.log(res.data["stations"])
            // let data = res.data["stations"];
            let data = res.data;
            this.setState({ data: data });
        } catch (error) {
            console.log(error.message);
        }
    }

    // _getLocations = async () => {
    //     var url = 'http://51.38.32.179:801/api/locations';
    //     try {
    //         let res = await axios.get(url, {
    //             headers: {
    //                 Authorization: `Bearer${sessionStorage.token}`
    //             }
    //         });
    //         console.log(res.data)
    //         console.log("locations: ", res.data["data"])
    //         let data = res.data["data"];
    //         this.setState({ locations: data });
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    // _getCities = async () => {
    //     var url = 'http://51.38.32.179:801/api/cities';
    //     try {
    //         let res = await axios.get(url, {
    //             headers: {
    //                 Authorization: `Bearer${sessionStorage.token}`
    //             }
    //         });
    //         console.log(res.data)
    //         console.log("cities: ", res.data["data"])
    //         let data = res.data["data"];
    //         this.setState({ cities: data });
    //     } catch (error) {
    //         console.log(error.message);
    //     }
    // }

    handleModalOpen = () => {
        this.setState((prevState) => {
            return { newIncidentModal: !prevState.newIncidentModal }
        })
        if (this.state.newIncidentModal === false) {
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
    }

    handleEditModal = () => {
        this.setState((prevState) => {
            return { editStaModal: !prevState.editStaModal }
        })
        if (this.state.editStaModal === false) {
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
    }

    getIdLocationByAdresse(adresse) {
        let id = ""
        for (let index = 0; index < this.state.locations.length; index++) {
            const element = this.state.locations[index];
            if (element.adresse === adresse) {
                id = element._id
            }

        }
        return id
    }

    getIdCitieByName(data) {
        let id = ""
        for (let index = 0; index < this.state.cities.length; index++) {
            const element = this.state.cities[index];
            if (element.name === data) {
                id = element._id
                console.log(id);
            }

        }
        return id;
    }

    // addStation = (e) => {
    //     var url = "http://51.38.32.179:801/api/stations"
    //     e.preventDefault();
    //     // this.setState({error: false, message: [] })
    //     this.state.error=false;
    //     let tab=[]
    //     this.state.message = tab;
    //     let fields = {
    //         code: this.state.newIncident.code,
    //         name: this.state.newIncident.name,
    //         shortName: this.state.newIncident.shortName,
    //         cities_id: this.state.newIncident.cities_id,
    //         locations_id: this.state.newIncident.locations_id,
    //     }
    //     if (fields.code === "" || fields.name === "" || fields.shortName === ""
    //         || fields.cities_id === "" || fields.locations_id === "") {
    //         let { message } = this.state
    //         message.push('Tous les champs sont obligatoires');
    //         this.setState({ message: message, inPogress: false, error: true });
    //         this.onShowAlert();

    //     } else {
    //         let location, citie;
    //         this.setState({ inProgress: !this.state.inProgress })
    //         console.log("new station", this.state.newIncident);
    //         location = this.getIdLocationByAdresse(this.state.newIncident.locations_id)
    //         citie = this.getIdCitieByName(this.state.newIncident.cities_id)
    //         //id transporter=providers_id
    //         this.state.newIncident.transporters_id = sessionStorage.getItem("user_id")
    //         console.log("location: ", location + "citie: ", citie);
    //         this.state.newIncident.location_id = location;
    //         this.state.newIncident.citie_id = citie;
    //         axios.post(url, this.state.newIncident)
    //             .then((response) => {
    //                 console.log(response);
    //                 this.setState({ inProgress: !this.state.inProgress })
    //                 this.setState({
    //                     newIncidentModal: {
    //                         code: '',
    //                         name: '',
    //                         shortName: '',
    //                         cities_id: '',
    //                         locations_id: '',
    //                     }
    //                 })
    //                 this._getStations();
    //                 this.handleModalOpen()
    //             }).catch((error) => {
    //                 this.setState({ inProgress: !this.state.inProgress })
    //                 console.log(error.message);
    //             })
    //     }
    // }

    editStation = (e) => {
        e.preventDefault();
        var url = "http://51.38.32.179:801/api/stations/"
        let location, citie;
        this.setState({ inProgress: !this.state.inProgress })
        console.log("new station", this.state.newIncident);
        location = this.getIdLocationByAdresse(this.state.newIncident.locations_id)
        citie = this.getIdCitieByName(this.state.newIncident.cities_id)
        console.log("location: ", location + "citie: ", citie);
        this.state.newIncident.location_id = location;
        this.state.neweditIncidentModal = false, wIncident.citie_id = citie;
        this.state.newIncident.transporters_id = sessionStorage.getItem("user_id")
        axios.put(url + this.state.newIncident._id, this.state.newIncident)
            .then((response) => {
                console.log(response);
                this.setState({
                    newIncident: {
                        code: '',
                        name: '',
                        shortName: '',
                        cities_id: '',
                        locations_id: '',
                    },
                    inProgress: !this.state.inProgress
                });
                this._getStations();
                this.handleEditModal();
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

    onEditStation = (item) => {
        this.setState({
            inProgress: false,
            editStaModal: !this.state.editStaModal
        })
        if (item) {
            console.log("element à modifier ", item)
            this.state.newIncident = item;
        }
    }

    onDeleteStation = (item) => {
        if (item) {
            console.log("element à supprimer ", item)
            this.setState({ newSta: item })
            console.log("value in progress: ", this.state.inProgress)
        }
        this.setState({ show: true })
    }

    deleteStation = (e) => {
        this.setState({ inProgress: true })
        e.preventDefault();
        var url = "http://51.38.32.179:801/api/stations/"
        axios.delete(url + this.state.newIncident._id)
            .then((response) => {
                console.log(response);
                this.setState({
                    newIncident: {
                        code: '',
                        name: '',
                        shortName: '',
                        cities_id: '',
                        locations_id: '',
                    },
                })
                //ligne ci-dessous a resolu mon pb
                this.setState({ show: false, inPogress: false })
                // this.setState({inPogress:false},console.log(this.state.inProgress));
                console.log("value in progress: ", this.state.inProgress)
                this._getStations();
            }).catch((error) => {
                //test
                this._getStations();
                this.setState({ inProgress: !this.state.inProgress, show: false })
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

    renderNewStation = () => {
        // this.state.inPogress = false
        let { locations, cities } = this.state
        locations = this.state.locations.map((item, i) => {
            return (
                <option value={item.adresse} key={item._id} id={item._id}>{item.adresse}</option>
            )
        });
        cities = this.state.cities.map((item, i) => {
            return (
                <option value={item.name} key={item._id} id={item._id}>{item.name}</option>
            )
        });
        return (
            <Modal show={this.state.newStaModal} onHide={this.handleModalOpen} backdrop="static" >
                <ModalHeader closeButton >New Station</ModalHeader>
                <Form>
                    <ModalBody className="col-sm-12">
                        {
                            this.state.error ? this.state.message.map((erreur, i) => {
                                return (<div className="alert alert-danger" key={i}>{erreur}</div>)

                            }) : null
                        }
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="code">Code:</label>
                            <input className="form-control" type="text"
                                id="code"
                                name="code"
                                value={this.state.newSta.code || ''}
                                onChange={(e) => {
                                    let { newSta } = this.state
                                    newSta.code = e.target.value
                                    this.setState({ newSta })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="name">Name:</label>
                            <input className="form-control" type="text"
                                id="name"
                                name="name"
                                value={this.state.newSta.name || ''}
                                onChange={(e) => {
                                    let { newSta } = this.state
                                    newSta.name = e.target.value
                                    this.setState({ newSta })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="shortname">ShortName:</label>
                            <input className="form-control" type="text"
                                id="shortname"
                                name="shortname"
                                value={this.state.newSta.shortName || ''}
                                onChange={(e) => {
                                    let { newSta } = this.state
                                    newSta.shortName = e.target.value
                                    this.setState({ newSta })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <ControlLabel>Cities</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newSta } = this.state
                                console.log("selected ", e.target.value)
                                newSta.cities_id = e.target.value
                                this.setState({ newSta })
                            }}>
                                <option value="-1" >--Choose Citie--</option>
                                {cities}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-12" >
                            <ControlLabel>Locations</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newSta } = this.state
                                console.log("selected ", e.target.value)
                                newSta.locations_id = e.target.value
                                this.setState({ newSta })
                            }}>
                                <option value="-1" >--Choose Location--</option>
                                {locations}
                            </FormControl>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.addStation}>Ajouter
                            </Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        <Button
                            className="btn btn-danger"
                            onClick={this.handleModalOpen}>Annuler
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }
    renderEditStation = () => {
        // this.state.inPogress=false 
        let { locations, cities } = this.state
        locations = this.state.locations.map((item, i) => {
            return (
                <option value={item.adresse} key={item._id} id={item._id}>{item.adresse}</option>
            )
        });
        cities = this.state.cities.map((item, i) => {
            return (
                <option value={item.name} key={item._id} id={item._id}>{item.name}</option>
            )
        });
        return (
            <Modal show={this.state.editStaModal} onHide={this.handleEditModal} backdrop="static">
                <ModalHeader closeButton >Edit Station</ModalHeader>
                <Form>
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="code">Code:</label>
                            <input className="form-control" type="text"
                                id="code"
                                name="code"
                                value={this.state.newSta.code || ''}
                                onChange={(e) => {
                                    let { newSta } = this.state
                                    newSta.code = e.target.value
                                    this.setState({ newSta })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="name">Name:</label>
                            <input className="form-control" type="text"
                                id="name"
                                name="name"
                                value={this.state.newSta.name || ''}
                                onChange={(e) => {
                                    let { newSta } = this.state
                                    newSta.name = e.target.value
                                    this.setState({ newSta })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="shortname">ShortName:</label>
                            <input className="form-control" type="text"
                                id="shortname"
                                name="shortname"
                                value={this.state.newSta.shortName || ''}
                                onChange={(e) => {
                                    let { newSta } = this.state
                                    newSta.shortName = e.target.value
                                    this.setState({ newSta })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <ControlLabel>Cities</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newSta } = this.state
                                console.log("selected ", e.target.value)
                                newSta.cities_id = e.target.value
                                this.setState({ newSta })
                            }}>
                                <option value={this.state.newSta.cities_id} >{this.state.newSta.cities_id}</option>
                                {cities}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-12" >
                            <ControlLabel>Locations</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newSta } = this.state
                                console.log("selected ", e.target.value)
                                newSta.locations_id = e.target.value
                                this.setState({ newSta })
                            }}>
                                <option value={this.state.newSta.locations_id}>{this.state.newSta.locations_id}</option>
                                {locations}
                            </FormControl>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.editStation}>Modifier
                            </Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        <Button
                            className="btn btn-danger"
                            onClick={this.handleEditModal}>Annuler
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
    }
    render() {
        if (this.state.show) {
            console.log(this.state.show);
            return (
                <Alert bsStyle="danger" onDismiss={(e) => this.setState({ show: false })}>
                    <h4>Suppresion</h4>
                    <p>Voulez vous vraiment supprimer ce station</p>
                    <p>
                        {!this.state.inProgress ?
                            <Button bsStyle="danger" onClick={this.deleteStation}>Supprimer</Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        {/* <Button bsStyle="danger" onClick={this.deleteStation}>Supprimer</Button> */}
                        <span> or </span>
                        <Button onClick={(e) => this.setState({ show: false })}>Annuler</Button>
                    </p>
                </Alert>
            );
        }
        let incidents = this.state.data.map((item, i) => {
            return (
                <tr key={i} id={item.id}>
                    <td>{item.title}</td>
                    <td>{item.zone}</td>
                    <td>{item.description}</td>
                    <td>{item.photo}</td>
                    <td>{item.video}</td>
                    <td>{item.audio}</td>
                    <td>{item.lattitude}</td>
                    <td>{item.longitude}</td>
                    <td>{item.user_id}</td>
                    <td>
                        <div className="btn-group">
                            <Button className="btn btn-default btn-xs">
                                <i className="fas fa-eye"></i>
                            </Button>
                            <Button onClick={(e) => this.onEditStation(item)} className="btn btn-default btn-xs">
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                                className="btn btn-danger btn-xs"
                                onClick={(e) => {
                                    this.onDeleteStation(item)
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
                {/* {this.rendernewIncident()}
                {this.renderEditStation()} */}
                <Grid fluid>
                    <Col md={12}>
                        <Button style={btnStyle} onClick={(e) => {
                            this.handleModalOpen()
                            this.setState({ inProgress: false })
                        }} className="pull-right">Add New</Button>
                        <Card
                            title="Stations"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>title</th>
                                            <th>Zone</th>
                                            <th>Description</th>
                                            <th>Photo</th>
                                            <th>Video</th>
                                            <th>Audio</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                            <th>Utilisateur</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {incidents}
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
