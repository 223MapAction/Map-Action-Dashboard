import React, { Component } from 'react'
import {
    Grid, Col, Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Form, ControlLabel, FormControl, Alert
} from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from "variables/Variables.jsx";
import axios from 'axios'
import CKEditor from 'ckeditor4-react'
import ReactHtmlParser from 'react-html-parser';
export default class Journeys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            stations: [],
            equipements: [],
            inProgress: false,
            newJnyModal: false,
            editJnyModal: false,
            transporter: JSON.parse(sessionStorage.getItem('user')),
            newJny: {
                from: '',
                to: '',
                heure_arrivee: '',
                heure_depart: '',
                departureDate: '',
                arrivalDate: '',
                realArrivateDate: '',
                transporter: '',
                price: '',
                distance: 0,
                condition_annulation: sessionStorage.getItem("condition_annulation"),
                condition_voyage: sessionStorage.getItem("condition_voyage"),
                equipments_id: ''
            },
            editJny: {
                station_from: {},
                station_to: {},
                equipment: {}
            }
        }
    }
    componentDidMount = () => {
        this._getJourneys();
        this._getStations();
        this._getEquipements();
    }


    handleModalOpen = () => {
        this.setState({ newJnyModal: !this.state.newJnyModal })
        if (this.state.newJnyModal === false) {
            this.setState({
                newJny: {
                    from: '', to: '', heure_arrivee: '', heure_depart: '', departureDate: '', arrivalDate: '',
                    realArrivateDate: '', transporter: '', price: '', distance: 0,
                }
            })
        }

    }

    handleEditModal = () => {
        this.setState({ editJnyModal: !this.state.editJnyModal })
    }

    onChange = (e) => {
        let { name, value } = e.target
        this.setState({ [name]: value }, console.log(this.state))
    }

    _getJourneys = async () => {
        try {
            let res = await axios.get('http://51.38.32.179:801/api/listTrajetsByTransporter/' + sessionStorage.getItem("user_id"),
                {
                    headers:
                        { Authorization: `Bearer${sessionStorage.token}` }
                }
            )
            console.log(res.data["datas"]);
            let data = res.data["datas"];
            this.setState({ data: data })
            this.setState({ inProgress: !this.state.inProgress, show: false })
        } catch (error) {
            console.log(error.message);
        }

    }

    _getStations = async () => {
        try {
            let res = await axios.get('http://51.38.32.179:801/api/stations/',
                {
                    headers:
                        { Authorization: `Bearer${sessionStorage.token}` }
                }
            )
            console.log(res);
            let { data } = res.data;
            this.setState({ stations: data })
        } catch (error) {
            console.log(error.message);
        }

    }
    _getEquipements = async () => {
        try {
            let res = await axios.get('http://51.38.32.179:801/api/equipementsByTransporter/' + sessionStorage.getItem("user_id"),
                {
                    headers:
                        { Authorization: `Bearer${sessionStorage.token}` }
                }
            )
            console.log("equipements ", res);
            let { data } = res.data;
            this.setState({ equipements: data })
        } catch (error) {
            console.log(error.message);
        }

    }
    getIdByName(name) {
        let id = ""
        for (let index = 0; index < this.state.stations.length; index++) {
            const element = this.state.stations[index];
            if (element.name === name) {
                id = element._id
            }

        }
        return id
    }
    getIdEquipementByName(modele, numberplate) {
        let id = ""
        for (let index = 0; index < this.state.equipements.length; index++) {
            const element = this.state.equipements[index];
            if (element.modele === modele && element.numberplate === numberplate) {
                id = element._id
                console.log(id);
            }

        }
        return id
    }
    getNameEquipementById(id) {
        let name = ""
        for (let index = 0; index < this.state.equipements.length; index++) {
            const element = this.state.equipements[index];
            if (element._id === id) {
                name = element.modele + '__' + element.numberplate
                console.log(name);
            }

        }
        return name
    }
    getNameById(id) {
        let name = ""
        for (let index = 0; index < this.state.stations.length; index++) {
            const element = this.state.stations[index];
            if (element._id === id) {
                name = element.name
            }

        }
        return name
    }
    addJourney = (e) => {
        // var str = this.state.newJny.equipments_id
        var url = "http://51.38.32.179:801/api/journeys"
        e.preventDefault();
        let to, from;
        this.setState({ inProgress: !this.state.inProgress })
        console.log("new journey", this.state.newJny)
        to = this.getIdByName(this.state.newJny.to)
        from = this.getIdByName(this.state.newJny.from)
        console.log(to, from)
        this.state.newJny.providers_id = sessionStorage.getItem("user_id")
        // this.state.newJny.equipments_id = "5e7d484be90ecb0c3771a1bf"
        this.state.newJny.frequency = 10
        this.state.newJny.to = to
        this.state.newJny.from = from
        axios.post(url, this.state.newJny)
            .then((response) => {
                console.log(response);
                sessionStorage.setItem("condition_voyage", response.data.data.condition_voyage)
                sessionStorage.setItem("condition_annulation", response.data.data.condition_annulation)
                this.setState({ inProgress: !this.state.inProgress })
                this.setState({
                    newJny: {
                        from: '', to: '', heure_arrivee: '', heure_depart: '', departureDate: '', arrivalDate: '',
                        realArrivateDate: '', transporter: '', price: '', distance: 0,
                    }
                })
                this._getJourneys()
                this.handleModalOpen()
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
    editJourney = (e) => {
        e.preventDefault();
        var url = "http://51.38.32.179:801/api/journeys/";
        let to, from, equipement;
        this.setState({ inProgress: !this.state.inProgress })
        console.log("new journey", this.state.newJny)
        to = this.getIdByName(this.state.newJny.to)
        from = this.getIdByName(this.state.newJny.from)
        console.log(to, from)
        this.state.newJny.providers_id = sessionStorage.getItem("user_id")
        //this.state.newJny.equipments_id =  "5e7d484be90ecb0c3771a1bf"
        this.state.newJny.frequency = 10
        this.state.newJny.to = to
        this.state.newJny.from = from
        axios.put(url + this.state.newJny._id, this.state.newJny)
            .then((response) => {
                console.log(response);
                sessionStorage.setItem("condition_voyage", response.data.data.condition_voyage)
                sessionStorage.setItem("condition_annulation", response.data.data.condition_annulation)
                this.setState({
                    newJny: {
                        from: '', to: '', heure_arrivee: '', heure_depart: '', departureDate: '', arrivalDate: '',
                        realArrivateDate: '', transporter: '', price: '', distance: 0,
                    }, inProgress: !this.state.inProgress
                })
                this._getJourneys()
                this.handleEditModal()
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
    deleteJourney = (e) => {
        this.setState({ inProgress: true })
        e.preventDefault();
        var url = "http://51.38.32.179:801/api/journeys/"
        axios.delete(url + this.state.newJny._id)
            .then((response) => {
                console.log(response);
                this.setState({
                    newJny: {
                        from: '', to: '', heure_arrivee: '', heure_depart: '', departureDate: '', arrivalDate: '',
                        realArrivateDate: '', transporter: '', price: '', distance: 0,
                    }
                })
                this._getJourneys()
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
    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }


    onEditJourney = (item) => {
        this.setState({ inProgress: false })
        if (item) {
            console.log("element à modifier ", item)
            // this.setState({ newJny: item })
            // console.log("journey", this.state.newJny);            
            this.state.newJny = item
            this.state.newJny.to = item.station_to.name
            this.state.newJny.equipments_id = item.equipment._id
            this.state.newJny.from = item.station_from.name
            console.log("equipement", this.state.newJny.equipment);
        }
        this.setState({ editJnyModal: !this.state.editJnyModal });
    }
    onDeleteJourney = (item) => {
        if (item) {
            console.log("element à supprimer ", item)
            this.setState({ newJny: item })
        }
        this.setState({ show: true })



    }

    handleChangeFromStation(e) {
        //this.setState({ value: e.target.value });
        let { newJny } = this.state
        newJny.from = e.target.value
        this.setState({ newJny })
    }
    render() {
        if (this.state.show) {

            return (
                <Alert bsStyle="danger" onDismiss={(e) => this.setState({ show: false })}>
                    <h4>Suppresion</h4>
                    <p>
                        Voulez vous vraiment supprimer ce trajet
                    </p>
                    <p>
                        {!this.state.inProgress ?
                            <Button bsStyle="danger" onClick={this.deleteJourney}>Supprimer</Button>
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
        let { data, stations, equipements } = this.state;
        // console.log("data stations", this.state.stations)

        stations = this.state.stations.map((item, i) => {

            return (
                <option value={item.name} key={item._id} id={item._id}>{item.name}</option>
            )
        }
        )
        equipements = this.state.equipements.map((item, i) => {
            return (
                <option value={item.model} key={item._id} id={item._id}>{item.modele}__{item.numberplate}</option>
            )
        }
        )

        let newJnyModal = (
            <Modal show={this.state.newJnyModal} onHide={this.handleModalOpen} backdrop="static" >
                <ModalHeader closeButton >New Journey</ModalHeader>
                <Form encType="multipart/form-data">
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6">
                            <ControlLabel>From</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newJny } = this.state
                                console.log("selected ", e.target.value)
                                newJny.from = e.target.value
                                this.setState({ newJny })
                            }}>
                                <option value="-1" >--</option>
                                {stations}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>To</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newJny } = this.state
                                console.log("selected ", e.target.value)
                                newJny.to = e.target.value
                                this.setState({ newJny })
                            }}>
                                <option value="-1" >--</option>
                                {stations}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Distance:</label>
                            <input className="form-control" type="number"
                                id="max_bagages"
                                name="bagages"
                                value={this.state.newJny.distance}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.distance = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="heure_depart">Heure de Depart:</label>
                            <input className="form-control" type="time"
                                id="heure_depart"
                                name="heure_depart"
                                value={this.state.newJny.heure_depart}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    console.log("selected ", e.target.value)
                                    newJny.heure_depart = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="heure_arrivee">Heure d'Arrive:</label>
                            <input className="form-control" type="time"
                                id="heure_arrivee"
                                name="heure_arrivee"
                                value={this.state.newJny.heure_arrivee}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    console.log(e.target.value)
                                    newJny.heure_arrivee = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="date_dep">Date Depart:</label>
                            <input className="form-control" type="date"
                                id="date_dep"
                                name="date_dep"
                                value={this.state.newJny.departureDate}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.departureDate = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="date_arr">Date Arrive:</label>
                            <input className="form-control" type="date"
                                id="date_arr"
                                name="date_arr"
                                value={this.state.newJny.arrivalDate}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.arrivalDate = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="real_arr_date">Real arrivate date:</label>
                            <input className="form-control" type="date"
                                id="real_arr_date"
                                name="real_arr_date"
                                value={this.state.newJny.realArrivateDate}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.realArrivateDate = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Prix:</label>
                            <input className="form-control" type="number"
                                id="price"
                                name="price"
                                value={this.state.newJny.price}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.price = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Equipement</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newJny } = this.state
                                console.log("selected ", e.target.value)
                                var str = e.target.value
                                var modele = str.substring(0, str.indexOf("__"));
                                var numberplate = str.substring(str.indexOf("__") + 2, str.length);
                                var equipement = this.getIdEquipementByName(modele, numberplate)
                                console.log(equipement)
                                newJny.equipments_id = equipement
                                this.setState({ newJny })
                            }}>
                                <option value="-1" >--</option>
                                {equipements}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-12" >
                            <label htmlFor="price">conditions voyage:</label>
                            <CKEditor
                                data={this.state.newJny.condition_voyage}
                                id="travel"
                                name="travel"
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.condition_voyage = e.editor.getData()
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-12" >
                            <label htmlFor="price">conditions annulation:</label>
                            <CKEditor
                                data={this.state.newJny.condition_annulation}
                                id="cancel"
                                name="cancel"
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.condition_annulation = e.editor.getData()
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.addJourney}>Ajouter
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

        let editJnyModal = (
            <Modal show={this.state.editJnyModal} onHide={this.handleEditModal} backdrop="static">
                <ModalHeader closeButton >Edit Journey</ModalHeader>
                <Form encType="multipart/form-data">
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6">
                            <ControlLabel>From</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newJny } = this.state
                                console.log("selected ", e.target.value)
                                newJny.from = e.target.value
                                this.setState({ newJny })
                            }}>
                                <option>{this.state.newJny.from}</option>
                                {stations}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>To</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newJny } = this.state
                                console.log("selected ", e.target.value)
                                newJny.to = e.target.value
                                this.setState({ newJny })
                            }}>
                                <option value="-1" >{this.state.newJny.to}</option>
                                {stations}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="distance">Distance:</label>
                            <input className="form-control" type="number"
                                id="distance"
                                name="distance"
                                value={this.state.newJny.distance}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.distance = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="heure_depart">Heure de Depart:</label>
                            <input className="form-control" type="time"
                                id="heure_depart"
                                name="heure_depart"
                                value={this.state.newJny.heure_depart}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.heure_depart = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="heure_arrivee">Heure d'Arrive:</label>
                            <input className="form-control" type="time"
                                id="heure_arrivee"
                                name="heure_arrivee"
                                value={this.state.newJny.heure_arrivee}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.heure_arrivee = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="date_dep">Date Depart:</label>
                            <input className="form-control" type="date"
                                id="date_dep"
                                name="date_dep"
                                value={this.formatDate(this.state.newJny.departureDate)}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.departureDate = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="date_arr">Date Arrive:</label>
                            <input className="form-control" type="date"
                                id="date_arr"
                                name="date_arr"
                                value={this.formatDate(this.state.newJny.arrivalDate)}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.arrivalDate = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="real_arr_date">Real arrivate date:</label>
                            <input className="form-control" type="date"
                                id="real_arr_date"
                                name="real_arr_date"
                                value={this.formatDate(this.state.newJny.realArrivateDate)}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.realArrivateDate = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="price">Prix:</label>
                            <input className="form-control" type="number"
                                id="price"
                                name="price"
                                value={this.state.newJny.price}
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.price = e.target.value
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <ControlLabel>Equipement</ControlLabel>
                            <FormControl componentClass="select" placeholder="select" onChange={(e) => {
                                let { newJny } = this.state
                                console.log("selected ", e.target.value)
                                var str = e.target.value
                                var modele = str.substring(0, str.indexOf("__"));
                                var numberplate = str.substring(str.indexOf("__") + 2, str.length);
                                var equipement = this.getIdEquipementByName(modele, numberplate)
                                console.log(equipement)
                                newJny.equipments_id = equipement
                                this.setState({ newJny })
                            }}>
                                <option>{this.getNameEquipementById(this.state.newJny.equipments_id)}</option>
                                {equipements}
                            </FormControl>
                        </FormGroup>
                        <FormGroup className="col-sm-12" >
                            <label htmlFor="price">conditions voyage:</label>
                            <CKEditor
                                data={this.state.newJny.condition_voyage}
                                id="travel"
                                name="travel"
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    newJny.condition_voyage = e.editor.getData()
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-12" >
                            <label htmlFor="price">conditions annulation:</label>
                            <CKEditor
                                data={this.state.newJny.condition_annulation}
                                id="travel"
                                name="travel"
                                onChange={(e) => {
                                    let { newJny } = this.state
                                    var html = e.editor.getData();
                                    console.log(html)
                                    newJny.condition_voyage = e.editor.getData()
                                    this.setState({ newJny })
                                }}
                            />
                        </FormGroup>
                    </ModalBody><ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.editJourney}>Modifier
                            </Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        {' '}
                        <Button className="btn btn-danger"
                            onClick={this.handleEditModal}>Annuler</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )

        let journeys = data.map((item, i) => {
            return (
                <tr key={i} id={item._id}>
                    {/* <td>{this.getNameById(item.from)}</td>
                    <td>{this.getNameById(item.to)}</td>                    */}
                    <td>{item.station_from.name}</td>
                    <td>{item.station_to.name}</td>
                    {/* <td>{this.getNameById(item._id)}</td> */}
                    <td>{this.formatDate(item.departureDate)}</td>
                    <td>{this.formatDate(item.arrivalDate)}</td>
                    <td>{this.formatDate(item.realArrivateDate)}</td>
                    <td>{item.price}</td>
                    <td>
                        <div className="btn-group">
                            <Button className="btn btn-default btn-xs">
                                <i className="fas fa-eye"></i>
                            </Button>
                            <Button onClick={(e) => this.onEditJourney(item)} className="btn btn-default btn-xs">
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button className="btn btn-danger btn-xs" onClick={(e) => {
                                this.onDeleteJourney(item)
                                this.setState({ inProgress: false })
                            }}>
                                <i className="fas fa-trash"></i>
                            </Button>
                        </div>
                    </td>
                </tr>
            )
        })
        return (
            <div className="content" >
                {newJnyModal}
                {editJnyModal}
                <Grid fluid>
                    <Col md={12}>
                        <Button style={btnStyle} onClick={(e) => {
                            this.handleModalOpen()
                            this.setState({ inProgress: false })
                        }} className="pull-right">Add New</Button>
                        <Card
                            title="Journeys"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Depart</th>
                                            <th>Arrivee</th>
                                            <th>Date Depart</th>
                                            <th>Date Arrivee</th>
                                            <th>Real arrivate date</th>
                                            <th>Price</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {journeys}
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
