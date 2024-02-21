import React, { Component } from 'react'
import Sidebar from 'components/Sidebar/Sidebar'
import AdminNavBar from 'components/Navbars/AdminNavbar'
import Footer from 'components/Footer/Footer'
// import Users from 'components/Users'
import routesElu from "routesElu.js";
import {Switch} from 'react-router-dom';

export default class EluDashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
          token: window.sessionStorage.getItem('token'),
          requestConfig: {
            headers: { Authorization: `Bearer ${window.sessionStorage.getItem('token')}` }
          },
          userID: window.sessionStorage.getItem('user_id'),

        };
    }

    render() {
        
        return (
            <div className="wrapper">
                <Sidebar/>                
                <div id="main-panel" className="main-panel" ref="mainPanel">
                    <AdminNavBar />
                    <Switch>{this.getRoutes(routesElu)}</Switch>
                    <Footer />                
                </div>
               
            </div>
        )
    }

}
