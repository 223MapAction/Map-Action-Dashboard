import React, { Component } from 'react'
import { Grid, Col, Table, Button } from 'react-bootstrap'
import Card from 'components/Card/Card.jsx'
import { btnStyle } from "variables/Variables.jsx";
import axios from 'axios';
export default class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(sessionStorage.getItem("user")),
            data: [],
        }
    }

    componentDidMount = () => {
        this._getLocations();
    }

    _getLocations = () => {
        axios.get('/locations', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer${sessionStorage.token}`
            }
        }).then((response) => {
            console.log(response);
            this.setState({ data: response.data.data });
            console.log(this.state.data);
        }
        ).catch((error) => {
            console.log(error.message);
        })
    }
    render() {
        let dataLocations = this.state.data.map((item, i) => {
            return (
                <tr key={i} id={item.id}>
                    <td>{item.latitude}</td>
                    <td>{item.longitude}</td>
                    <td>{item.url_google_map}</td>
                    <td>{item.adresse}</td>
                    <td>
                        <div className="btn-group">
                            <Button className="btn btn-default btn-xs">
                                <i className="fas fa-eye"></i>
                            </Button>
                            <Button className="btn btn-default btn-xs">
                                <i className="fas fa-edit"></i>
                            </Button>
                            <Button className="btn btn-danger btn-xs">
                                <i className="fas fa-trash"></i>
                            </Button>
                        </div>
                    </td>
                </tr>
            )
        });
        return (
            <div className="content" >
                <Grid fluid>
                    <Col md={12}>
                        <Button style={btnStyle} className="pull-right">Add New</Button>
                        <Card
                            title="Locations"
                            ctTableFullWidth
                            ctTableResponsive
                            content={
                                <Table striped hover>
                                    <thead>
                                        <tr>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                            <th>Url Google Map</th>
                                            <th>Adresse</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataLocations}
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
