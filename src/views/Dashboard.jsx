/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from 'react'
import ChartistGraph from 'react-chartist'
import { Grid, Row, Col } from 'react-bootstrap'

import { Card } from 'components/Card/Card.jsx'
import { StatsCard } from 'components/StatsCard/StatsCard.jsx'
import { Tasks } from 'components/Tasks/Tasks.jsx'
import ReactDOMServer from 'react-dom/server';

import {
  dataPie,
  legendPie,
  optionsPie,
  dataSales,
  optionsSales,
  responsiveSales,
  responsiveOptionsCircle,
  optionsCircle,
  legendSales,
  dataBar,
  optionsBar,
  responsiveBar,
  legendBar,
} from 'variables/Variables.jsx'
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'react-bootstrap'
import axios from 'axios'
import { Map, Marker, Popup, TileLayer, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'assets/css/global.css'
import { Player } from 'video-react'
import 'video-react/dist/video-react.css' // import css
import Login from 'components/Login'
import { useState } from "react";

L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  //iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

var _isMounted = false



class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count_incidents: '',
      count_rapports: '',
      count_zones: '',
      count_elus: '',
      rapports_dispo: 0,
      rapports_nondispo: 0,
      incidentsByMonth: [],
      incidentsByWeek: [],
      data: [],
      indicateurs: {},
      resolus: '',
      non_resolus: '',
      markers: [[14.716677, -17.467686]],
      showIncidentModal: false,
      incident: [],
      userType: sessionStorage.getItem('user_type'),
    }
  }




  createLegend(json) {
    var legend = []
    for (var i = 0; i < json['names'].length; i++) {
      var type = 'fa fa-circle text-' + json['types'][i]
      legend.push(<i className={type} key={i} />)
      legend.push(' ')
      legend.push(json['names'][i])
    }
    return legend
  }
  _getIncidents = async () => {
    // var url = global.config.url + 'api/incident/'
    var url = global.config.url + '/MapApi/incident/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })

      // let data = res.data;
      this.setState({ count_incidents: res.data.count })
      this.setState({ data: res.data.results })
    } catch (error) {
      console.log(error.message)
    }
  }

  getIcon = async (mark) => {

    console.log(mark.etat)

    if (mark.etat == 'declared') {
      return L.Icon.Default.mergeOptions({
        iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      })
    } else {
      return L.Icon.Default.mergeOptions({
        iconUrl: "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      })
    }

  }


  getIndicateur = async () => {
    // var url = global.config.url + 'api/indicateurincident/'
    var url = global.config.url + '/MapApi/indicator_incident/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })

      // console.log('indicateur', res.data.data)
      var data = res.data.data
      var dataReverse = data.reverse()
      var labels = []
      var series = []
      data.forEach((element) => {
        // if (element.pourcentage != 0.0) {
        //   labels.push(parseFloat(element.pourcentage).toFixed(3))
        //   series.push(parseFloat(element.pourcentage).toFixed(3))
        // }

        if (element.number > 0 && element.indicateur != "null") {
          labels.push(element.indicateur + "(" + element.number + ")");
          series.push(element.number);
        }
      })

      var dataPie = {
        labels: labels,
        series: series,
      }
      console.log('data pie', dataPie)
      this.setState({ indicateurs: dataPie })
      console.log('data indicateurs', this.state.indicateurs)
    } catch (error) {
      console.log(error.message)
    }
  }
  getIncidentsByWeek = async () => {
    // var url = global.config.url + 'api/incidentonweek/'
    var url = global.config.url + '/MapApi/IncidentOnWeek/'

    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log(res.data.data)
      this.setState({ incidentsByWeek: res.data.data })
    } catch (error) {
      console.log(error.message)
      console.log('err', error.message)
    }
  }
  getIncidentsByMonth = async () => {
    // var url = global.config.url + 'api/incidentbymonth/'
    var url = global.config.url + '/MapApi/incidentByMonth/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log(res.data.data)
      this.setState({ incidentsByMonth: res.data.data })
    } catch (error) {
      console.log(error.message)
    }
  }
  _getIncidentsNotResolved = async () => {
    let elu_zone = sessionStorage.zone
    console.log(elu_zone)
    // var url = global.config.url + 'api/incidentnotresolved/'
    var url = global.config.url + '/MapApi/incidentNotResolved/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log(res.data.count)
      this.setState({ non_resolus: res.data.count })
      // this.setState({ data: res.data });
    } catch (error) {
      console.log(error.message)
    }
  }
  _getIncidentsResolved = async () => {
    let elu_zone = sessionStorage.zone
    console.log(elu_zone)
    // var url = global.config.url + 'api/incidentresolved/'
    var url = global.config.url + '/MapApi/incidentResolved/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log(res)
      this.setState({ resolus: res.data.count })
    } catch (error) {
      console.log(error.message)
    }
  }

  getZones = async () => {
    // var url = global.config.url + 'api/zone/'
    var url = global.config.url + '/MapApi/zone/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })

      // let data = res.data;
      console.log(res.data.count)
      this.setState({ count_zones: res.data.count })
    } catch (error) {
      console.log(error.message)
    }
  }

  getElus = async () => {
    // var url = global.config.url + 'api/elu/'
    var url = global.config.url + '/MapApi/elu/'
    try {
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer${sessionStorage.token}`,

          'Content-Type': 'application/json',
        },
      })
      console.log(res)
      this.setState({ count_elus: res.data.count })
    } catch (error) {
      console.log(error.message)
    }
  }

  _getRapports = async () => {
    // var url = global.config.url + 'api/rapport/'
    var url = global.config.url + '/MapApi/rapport/'
    try {
      let res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer '.concat(sessionStorage.token),
        },
      })
      // console.log(res)
      let data = res.data
      // this.setState({ data: data });
      this.setState({ count_rapports: res.data.count })
      var dispo = 0
      var non_dispo = 0
      this.setState({ rapports_dispo: dispo, rapports_nondispo: non_dispo })
      this.state.data.map((item, i) => {
        if (item.disponible) {
          dispo = dispo + 1
          return this.setState({ rapports_dispo: dispo })
        } else {
          non_dispo = non_dispo + 1
          return this.setState({ rapports_nondispo: non_dispo })
        }
      })
      console.log(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  getIncidentById(id) {
    let incident = ''
    for (let index = 0; index < this.state.data.length; index++) {
      const element = this.state.data[index]
      if (element.id === id) {
        incident = element
      }
    }
    return incident
  }

  onShowIncident = (id) => {
    this.setState({
      inProgress: false,
      showIncidentModal: !this.state.showIncidentModal,
    })
    const item = this.getIncidentById(id)
    console.log(item)
    if (item) {
      console.log('element à afficher ', item)
      this.state.incident = item
    }
  }
  handleShowIncidentModal = () => {
    this.setState({
      inProgress: false,
      showIncidentModal: !this.state.showIncidentModal,
    })
  }

  componentDidMount = () => {
    if (this.state.userType !== 'admin') {
      return <Login />
    }
    this._isMounted = true
    this._getIncidents()
    this._getRapports()
    this.getZones()
    this.getElus()
    this.getIncidentsByMonth()
    this.getIncidentsByWeek()
    this._getIncidentsNotResolved()
    this._getIncidentsResolved()
    this.getIndicateur()
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  renderShowIncident = () => {
    // var url = "http://137.74.196.127:8000";
    var url = global.config.url
    let imgUrl = this.state.incident.photo
    let imgIncident = url + `${imgUrl}`
    let audioUrl = this.state.incident.audio
    let audioIncident = url + `${audioUrl}`
    let video = this.state.incident.video
    let videoIncident = url + `${video}`
    const Loader = () => {
      return (
        <div className="loader">
          <h2>Loading video...</h2>
        </div>
      )
    }
    const lattitude = this.state.incident.lattitude
    const longitude = this.state.incident.longitude
    const position = [lattitude, longitude]

    return (
      <div className="modal fade">
        <Modal
          show={this.state.showIncidentModal}
          onHide={this.handleShowIncidentModal}
        >
          <ModalHeader closeButton className="map-color fs-20 t-center">
            Details Incident
          </ModalHeader>

          <ModalBody className="col-sm-12">
            <div className="col-sm-6 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Titre:
              </label>
              <p>{this.state.incident.title}</p>
            </div>
            <div className="col-sm-6">
              <label htmlFor="code" className="map-color fs-18">
                Zone:
              </label>
              <p>{this.state.incident.zone}</p>
            </div>
            <hr />
            <div className="col-sm-12 pb-3">
              {lattitude !== null && longitude !== null ? (
                <Map center={position} zoom={13}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={position}>
                    <Popup>{this.state.incident.title}</Popup>
                    <Circle center={position} radius={500} color="red"></Circle>
                  </Marker>
                </Map>
              ) : (
                <p className="danger">Coordonnees non renseignees</p>
              )}
            </div>
            <div className="col-sm-12 pb-3">
              <label htmlFor="code" className="map-color fs-18">
                Description:
              </label>
              <p>{this.state.incident.description}</p>
            </div>

            <div className="col-sm-12 pb-3">
              <label className="map-color fs-18">Image:</label>
              <img src={imgIncident} alt="" />{' '}
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
  render() {
    var dataSales = {
      labels: [],
      series: [[]],
    }
    // var days = new Array();
    // days[0] = "Lundi";
    // days[1] = "Mardi";
    // days[2] = "Mercredi";
    // days[3] = "Jeudi";
    // days[4] = "Vendredi";
    // days[5] = "Samedi";
    // days[6] = "Dimanche";
    let day = new Date()
    if (day.getDay() === 1) {
      dataSales.labels = ['Lundi']
    }

    if (day.getDay() === 2) {
      dataSales.labels = ['Lundi', 'Mardi']
    }

    if (day.getDay() === 3) {
      dataSales.labels = ['Lundi', 'Mardi', 'Mercredi']
    }

    if (day.getDay() === 4) {
      dataSales.labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi']
    }

    if (day.getDay() === 5) {
      dataSales.labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
    }

    if (day.getDay() === 6) {
      dataSales.labels = [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ]
    }

    if (day.getDay() === 7) {
      dataSales.labels = [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
      ]
    }

    var month = new Array()
    month[0] = 'Jan'
    month[1] = 'Feb'
    month[2] = 'Mar'
    month[3] = 'Apr'
    month[4] = 'May'
    month[5] = 'Jun'
    month[6] = 'Jul'
    month[7] = 'Aug'
    month[8] = 'Sep'
    month[9] = 'Oct'
    month[10] = 'Nov'
    month[11] = 'Dec'
    var dataBar = {
      labels: [],
      series: [],
    }
    const total = []
    const r = []
    const ntr = []
    this.state.incidentsByMonth.map((incidentm, id) => {
      var date = new Date(incidentm.month)

      var m = month[date.getMonth()]
      // var d = days[date.getDay()];
      dataBar.labels.push(m)
      total.push(incidentm.total)

      r.push(incidentm.resolved)
      ntr.push(incidentm.unresolved)
    })
    dataBar.series.push(total, ntr, r)


    // By Week
    const totalw = []
    //console.log('incidentsByWeek', this.state.incidentsByWeek)
    if (this.state.incidentsByWeek.length) {
      this.state.incidentsByWeek.map((incidentw, id) => {
        var date = new Date(incidentw.day)

        var d = date.getDay()
        for (let i = 0; i < day.getDay(); i++) {
          //const element = array[i];
          if (i === d) {
            dataSales.series[0][d] = incidentw.total
          } else {
            dataSales.series[0][i] = 0
          }
        }
        totalw.push(incidentw.total)
        //dataSales.series[0][d] = incidentw.total
        //dataSales.series.push(totalw);
        //console.log("dataSales", dataSales.series[0][d] , date.getDay(), totalw)
        //dataSales.labels.push(d);
      })
    } else {
      for (let i = 0; i < day.getDay(); i++) {
        dataSales.series[0][i] = 0
      }
    }
    //console.log(dataSales)

    //  const markers = []
    //     this.state.data.map((incident, idx) =>
    //       {
    //         if(incident.lattitude!==null && incident.longitude!==null){
    //         let pos =[incident.lattitude,incident.longitude]
    //         markers.push(pos)
    //       }
    //       })
    let positions = []
    this.state.data.map((incident, idx) => {

      if (incident.lattitude !== null && incident.longitude !== null && !isNaN(incident.longitude) && !isNaN(incident.lattitude)) {
        let pos = {
          id: incident.id,
          lat: incident.lattitude,
          lon: incident.longitude,
          tooltip: incident.title,
          desc: incident.description,
          etat: incident.etat,
          // img: "http://137.74.196.127:8000" + incident.photo,
          img: global.config.url.slice(0, -1) + incident.photo,
        }

        positions.push(pos);


      }
    })

    const position = [14.716677, -17.467686]

    const iconHTML = ReactDOMServer.renderToString(<i className="fas fa-map-marker-alt fa-2x text-primary "></i>)
    const customMarkerIconBlue = new L.DivIcon({
      html: iconHTML,
    });

    const iconHTMLRed = ReactDOMServer.renderToString(<i className="fas fa-map-marker-alt fa-2x text-danger "></i>)
    const customMarkerIconRed = new L.DivIcon({
      html: iconHTMLRed,
    });


    const map = (
      <Map center={position} zoom={5}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {positions.map((mark, idx) => (

          //  this.getIcon(mark),

          <Marker
            className="icon-marker"
            key={`marker-${idx}`}
            icon={mark.etat == "resolved" ? customMarkerIconBlue : customMarkerIconRed}
            position={[mark.lat, mark.lon]}
          >
            <Popup>
              <span className="icon-marker-tooltip">
                <ul>
                  <div className="row">
                    <div className="col-md-6">
                      <li>
                        <strong>Titre:</strong>
                        <a
                          onClick={(e) => this.onShowIncident(mark.id)}
                          className="btn btn-default btn-xs map-color nb"
                          data-id={mark.id}
                        >
                          {mark.tooltip}
                        </a>
                      </li>
                      <li>
                        <strong>Description:</strong> {mark.desc}
                      </li>
                    </div>
                    <div className="col-md-6">
                      <img src={mark.img} alt="" />
                      <div>
                        <button
                          className="boutton  button--round-l"
                          onClick={(e) => this.onShowIncident(mark.id)}
                        >
                          <i className="fa fa-eye" aria-hidden="true"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </ul>
              </span>
            </Popup>
          </Marker>
        ))}
      </Map>
    )

    return (
      <div className="content">
        <Row>
          <Col lg={3} sm={6}>
            {/* <StatsCard
              bigIcon={<i className="pe-7s-map text-warning" />}
              statsText="Zones"
              statsValue={this.state.count_zones}
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Updated now"
            /> */}
            <div className="card card-stats">
              <div className="content">
                <Row>
                  <Col xs={3}>
                    <div className="icon-big text-center icon-warning">
                      {<i className="pe-7s-map text-warning" />}
                    </div>
                  </Col>
                  <Col xs={9}>
                    <div className="text-card admin-stats">
                      <h3 className="text-card-title">Zones</h3>
                      <div className="incident-count">
                        {this.state.count_zones}
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    {/* {<i className="fa fa-refresh" />} */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={3} sm={6}>
            {/* <StatsCard
              bigIcon={<i className="pe-7s-wallet text-success" />}
              statsText="Rapports"
              statsValue={this.state.count_rapports}
              statsIcon={<i className="fa fa-calendar-o" />}
              statsIconText="Last day"
            /> */}
            <div className="card card-stats">
              <div className="content">
                <Row>
                  <Col xs={3}>
                    <div className="icon-big text-center icon-warning">
                      {<i className="pe-7s-wallet text-success" />}
                    </div>
                  </Col>
                  <Col xs={9}>
                    <div className="text-card admin-stats">
                      <h3 className="text-card-title">Rapports</h3>
                      <div className="incident-count">
                        {this.state.count_rapports}
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    {/* {<i className="fa fa-calendar-o" />} */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={3} sm={6}>
            <div className="card card-stats">
              <div className="content">
                <Row>
                  <Col xs={3}>
                    <div className="icon-big text-center icon-warning">
                      {<i className="pe-7s-server text-warning" />}
                    </div>
                  </Col>
                  <Col xs={9}>
                    <div className="text-card admin-stats">
                      <h3 className="text-card-title">Etat des incidents </h3>
                      <div className="incident-count">
                        {this.state.count_incidents}
                      </div>
                      <div className="text-card-details-container">
                        <div className="text-card-details">
                          <span className="text-card-number-infos">
                            {this.state.resolus}
                          </span>
                          &nbsp;
                          <span className="text-card-number-label">
                            résolu(s)
                          </span>
                        </div>
                        <div className="text-card-details">
                          <span className="text-card-number-infos">
                            {this.state.non_resolus}
                          </span>
                          &nbsp;
                          <span className="text-card-number-label">
                            en cours
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    {/* {<i className="fa fa-refresh" />} */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={3} sm={6}>
            {/* <StatsCard
              bigIcon={<i className="fa fa-user text-info" />}
              statsText="Elus"
              statsValue={this.state.count_elus}
              statsIcon={<i className="fa fa-refresh" />}
              statsIconText="Updated now"
            /> */}
            <div className="card card-stats">
              <div className="content">
                <Row>
                  <Col xs={3}>
                    <div className="icon-big text-center icon-warning">
                      {<i className="fa fa-user text-info" />}
                    </div>
                  </Col>
                  <Col xs={9}>
                    <div className="text-card admin-stats">
                      <h3 className="text-card-title">Organisations</h3>
                      <div className="incident-count">
                        {this.state.count_elus}
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="footer">
                  <hr />
                  <div className="stats">
                    {/* {<i className="fa fa-refresh" />} */}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <br />
        <Row>
          <Col md={5}>
            <Card
              id="chartActivity"
              title="Incidents"
              category="Les incidents selon leur etat"
              stats="Etat des incidents"
              statsIcon="fa fa-check"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={dataBar}
                    type="Bar"
                    options={optionsBar}
                    responsiveOptions={responsiveBar}
                  />
                </div>
              }
              legend={
                <div className="legend">{this.createLegend(legendBar)}</div>
              }
            />
          </Col>

          <Col md={7}>
            <Card
              id="chartActivity"
              title="Indicateurs"
              category="Nombre incidents par indicateur"
              statsIcon="fa fa-check"
              stats="Indicateurs"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={this.state.indicateurs}
                    type="Pie"
                    options={optionsCircle}
                    responsiveOptions={responsiveOptionsCircle}
                  />
                </div>
              }
              legend={
                <div className="legend"></div>
              }
            />
          </Col>

          {/* <Col md={6}>
            <Card
              title="Indicateurs"
              category="Indicateur/Incidents"
              // stats="Updated 3 minutes ago"
              // statsIcon="fa fa-history"
              content={
                <ChartistGraph
                  data={this.state.indicateurs}
                  type="Pie"
                  options={optionsPie}
                />
              }
              legend={
                <div className="legend">
                 //  {this.createLegend(legendPie)}  
                </div>
              }
            />
          </Col> */}
        </Row>
        <br />
        <Row>
          <Col md={12}>
            <Card
              id="chartActivity"
              title="Bilan Hebdomadaire"
              category="Nombres d'incidents de la semaine"
              stats="Incidents par jour"
              statsIcon="fa fa-check"
              content={
                <div className="ct-chart">
                  <ChartistGraph
                    data={dataSales}
                    type="Line"
                    options={optionsSales}
                    responsiveOptions={responsiveSales}
                  />
                </div>
              }
              legend={
                <div className="legend">{this.createLegend(legendSales)}</div>
              }
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} sm={12}>
            <Card
              id="map"
              title="Carte des Incidents"
              category="Tous les incidents"
              // stats="Data information certified"
              statsIcon="fa fa-map"
              content={<div className="map">{map}</div>}
            />
          </Col>
        </Row>
        {this.renderShowIncident()}
      </div>
    )
  }
}

export default Dashboard
