import React, { Component } from 'react'
import {
    Grid, Col, Table, Button, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Form, Alert
} from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from "variables/Variables.jsx";
import axios from 'axios'
export default class Equipements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inProgress: false,
            newEquipModal: false,
            editModal: false,
            newEquip: {
                code: '',
                numberplate: '',
                acquisitionDate: '',
                age: 1,
                modele: '',
                nombre_places: 1,
                type: '',
                airConditioning: Boolean,
            },
            editEquip: {
                id: '',
                code: '',
                numberplate: '',
                acquisitionDate: '',
                age: 1,
                modele: '',
                nombre_places: 1,
                type: '',
                airConditioning: Boolean,
            },
        }
    }

    componentDidMount = () => {
        this._getEquipements();
    }

    handleModalOpen = () => {
        this.setState({ newEquipModal: !this.state.newEquipModal })
    }

    handleEditOpen = () => {
        this.setState({ editModal: !this.state.editModal })
    }

    onEditEquip = (item) => {
        console.log("equipement a modifier", item)
        this.state.editEquip = item;
        this.setState({
            // editEquip: item,
            editModal: !this.state.newEquipModal
        })
    }



    addEquipement = (e) => {
        e.preventDefault();
        this.setState({ inProgress: !this.state.inProgress })
        const new_data = {
            code: this.state.newEquip.code,
            numberplate: this.state.newEquip.numberplate,
            acquisitionDate: this.state.newEquip.acquisitionDate,
            age: this.state.newEquip.age,
            modele: this.state.newEquip.modele,
            nombre_places: this.state.newEquip.nombre_places,
            type: this.state.newEquip.type,
            airConditioning: this.state.newEquip.airConditioning,
            providers_id: sessionStorage.getItem("user_id")
        }
        console.log(new_data);
        axios.post("http://51.38.32.179:801/api/equipments", new_data)
            .then((response) => {
                console.log(response);
                let { data } = this.state;
                data.push(new_data);
                this.setState({
                    inProgress: !this.state.inProgress,
                    newEquipModal: false,
                })
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
    editEquipement = (e) => {
        e.preventDefault();
        this.setState({ inProgress: !this.state.inProgress })
        const new_data = {
            code: this.state.editEquip.code,
            numberplate: this.state.editEquip.numberplate,
            acquisitionDate: this.state.editEquip.acquisitionDate,
            age: this.state.editEquip.age,
            modele: this.state.editEquip.modele,
            nombre_places: this.state.editEquip.nombre_places,
            type: this.state.editEquip.type,
            airConditioning: this.state.editEquip.airConditioning,
            providers_id: sessionStorage.getItem("user_id")
        }
        console.log(new_data);
        axios.put("http://51.38.32.179:801/api/equipments/" + this.state.editEquip._id, new_data)
            .then((response) => {
                console.log(response);
                // let { data } = this.state;
                //data.push(new_data);
                this.setState({
                    inProgress: !this.state.inProgress
                })
                this.handleEditOpen()
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
    deleteEquipement = (e) => {
        this.setState({ inProgress: true })
        e.preventDefault();
        axios.delete("http://51.38.32.179:801/api/equipments/" + this.state.newJny._id)
            .then((response) => {
                console.log(response);
                //let data  = this.state.data
                //data.push(response.data.data)
                this._getEquipements()


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

    _getEquipements = async () => {
        let url = 'http://51.38.32.179:801/api/equipementsByTransporter/';
        try {
            let res = await axios.get(url + sessionStorage.getItem("user_id"),
                {
                    headers:
                        { Authorization: `Bearer${sessionStorage.token}` }
                }
            )
            console.log(res);
            console.log(res.data["data"])
            let data = res.data["data"];
            this.setState({ data: data })
        } catch (error) {
            console.log(error.message);
        }

    }

    str2bool = (value) => {
        if (value && typeof value === 'string') {
            if (value.toLowerCase() === "true") return true;
            if (value.toLowerCase() === "false") return false;
        }
        return value;
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

    onDeleteEquipement = (item) => {
        if (item) {
            console.log("element à supprimer ", item)
            this.setState({ newJny: item })
        }
        this.setState({ show: true })



    }
    render() {
        if (this.state.show) {

            return (
                <Alert bsStyle="danger" onDismiss={(e) => this.setState({ show: false })}>
                    <h4>Suppresion</h4>
                    <p>
                        Voulez vous vraiment supprimer cet equipment
                    </p>
                    <p>
                        {!this.state.inProgress ?
                            <Button bsStyle="danger" onClick={this.deleteEquipement}>Supprimer</Button>
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
        let { data } = this.state;
        let newEquipModal = (
            <Modal show={this.state.newEquipModal} onHide={this.handleModalOpen} >
                <ModalHeader closeButton >New Equipement</ModalHeader>
                <Form>
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6">
                            <label htmlFor="from">Code:</label>
                            <input className="form-control" type="text"
                                id="code"
                                name="code"
                                value={this.state.newEquip.code}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.code = e.target.value
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="numberplate">Numberplate:</label>
                            <input className="form-control" type="text"
                                id="numberplate"
                                name="numberplate"
                                value={this.state.newEquip.numberplate}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.numberplate = e.target.value
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="acquisitionDate">Acquisitiondate:</label>
                            <input className="form-control" type="date"
                                id="acquisitionDate"
                                name="acquisitionDate"
                                value={this.state.newEquip.acquisitionDate}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.acquisitionDate = e.target.value
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="age">Age:</label>
                            <input className="form-control" type="number"
                                id=" age"
                                name=" age"
                                min="0"
                                value={this.state.newEquip.age}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.age = Number(e.target.value)
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="modele">Modele:</label>
                            <input className="form-control" type="text"
                                id="modele"
                                name="modele"
                                value={this.state.newEquip.modele}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.modele = e.target.value
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="airConditioning">Airconditioning:</label>
                            <select
                                id="airConditioning"
                                name="airConditioning"
                                className="form-control"
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.airConditioning = this.str2bool(e.target.value)
                                    this.setState({ newEquip }, console.log(this.state))
                                }}>
                                <option>---</option>
                                <option value={true}>Oui</option>
                                <option value={false}>Non</option>
                            </select>
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="type">Type:</label>
                            <input className="form-control" type="text"
                                id="type"
                                name="type"
                                value={this.state.newEquip.type}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.type = e.target.value
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="nombre_places">Nombre de place:</label>
                            <input className="form-control" type="number"
                                id="nombre_places"
                                min="0"
                                name="nombre_places"
                                value={this.state.newEquip.nombre_places}
                                onChange={(e) => {
                                    let { newEquip } = this.state
                                    newEquip.nombre_places = Number(e.target.value)
                                    this.setState({ newEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.addEquipement}>Ajouter
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
        let editModal = (
            <Modal show={this.state.editModal} onHide={this.handleEditOpen} >
                <ModalHeader closeButton >Update Equipement</ModalHeader>
                <Form>
                    <ModalBody className="col-sm-12">
                        <FormGroup className="col-sm-6">
                            <label htmlFor="from">Code:</label>
                            <input className="form-control" type="text"
                                id="code"
                                name="code"
                                value={this.state.editEquip.code}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.code = e.target.value
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="numberplate">Numberplate:</label>
                            <input className="form-control" type="text"
                                id="numberplate"
                                name="numberplate"
                                value={this.state.editEquip.numberplate}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.numberplate = e.target.value
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6">
                            <label htmlFor="acquisitionDate">Acquisitiondate:</label>
                            <input className="form-control" type="date"
                                id="acquisitionDate"
                                name="acquisitionDate"
                                value={this.state.editEquip.acquisitionDate}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.acquisitionDate = e.target.value
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="age">Age:</label>
                            <input className="form-control" type="number"
                                id=" age"
                                name=" age"
                                min="0"
                                value={this.state.editEquip.age}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.age = Number(e.target.value)
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="modele">Modele:</label>
                            <input className="form-control" type="text"
                                id="modele"
                                name="modele"
                                value={this.state.editEquip.modele}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.modele = e.target.value
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="airConditioning">Airconditioning:</label>
                            <select
                                id="airConditioning"
                                name="airConditioning"
                                className="form-control"
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.airConditioning = this.str2bool(e.target.value)
                                    this.setState({ editEquip }, console.log(this.state))
                                }}>
                                {this.state.editEquip.airConditioning ? <option value={true}>Oui</option>
                                    :
                                    <option value={false}>Non</option>
                                }
                                <option value={true}>Oui</option>
                                <option value={false}>Non</option>
                            </select>
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="type">Type:</label>
                            <input className="form-control" type="text"
                                id="type"
                                name="type"
                                value={this.state.editEquip.type}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.type = e.target.value
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                        <FormGroup className="col-sm-6" >
                            <label htmlFor="nombre_places">Nombre de place:</label>
                            <input className="form-control" type="number"
                                id="nombre_places"
                                min="0"
                                name="nombre_places"
                                value={this.state.editEquip.nombre_places}
                                onChange={(e) => {
                                    let { editEquip } = this.state
                                    editEquip.nombre_places = Number(e.target.value)
                                    this.setState({ editEquip }, console.log(this.state))
                                }}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.inProgress ?
                            <Button
                                className="btn btn-primary"
                                onClick={this.editEquipement}>Modifier
                            </Button>
                            :
                            <Button
                                className="btn btn-primary">Loading...<i className="fa fa-spin fa-spinner" aria-hidden="true"></i>
                            </Button>
                        }
                        {' '}
                        <Button className="btn btn-danger"
                            onClick={this.handleEditOpen}>Annuler</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        )
        let equipments = data.map((item, i) => {
            return (
                <tr key={i} id={item.id}>
                    <td>{item.code}</td>
                    <td>{item.numberplate}</td>
                    <td>{this.formatDate(item.acquisitionDate)}</td>
                    <td>{item.age}</td>
                    <td>{item.modele}</td>
                    {item.airConditioning ?
                        <td>Oui</td>
                        :
                        <td>Non</td>
                    }
                    <td>{item.type}</td>
                    <td>
                        <div className="btn-group">
                            <Button className="btn btn-default btn-xs">
                                <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                                className="btn btn-default btn-xs"
                                onClick={(e) => this.onEditEquip(item)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button className="btn btn-danger btn-xs" onClick={(e) => {
                                this.onDeleteEquipement(item)
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
                {newEquipModal}
                {editModal}
                <Grid fluid>
                    <Col md={12}>
                        <Button style={btnStyle} onClick={this.handleModalOpen} className="pull-right">Add New</Button>
                        <Card
                            title="Equipements"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Code</th>
                                            <th>Number Plate</th>
                                            <th>Acquisition Date</th>
                                            <th>Age</th>
                                            <th>Modele</th>
                                            <th>Air Conditioning</th>
                                            <th>Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipments}
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

