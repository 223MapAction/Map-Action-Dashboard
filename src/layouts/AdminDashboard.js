import React, { Component } from "react";
import Sidebar from "components/Sidebar/Sidebar";
import AdminNavBar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
// import Users from 'components/Users'
import routes from "routes.js";
import { Switch } from "react-router-dom";

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: window.sessionStorage.getItem("token"),
      requestConfig: {
        headers: {
          Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
      },
      userID: window.sessionStorage.getItem("user_id"),
    };
  }
  componentWillMount() {
    if (this.state.userType === "elu") {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <div className="wrapper">
        <Sidebar />
        <div id="main-panel" className="main-panel" ref="mainPanel">
          <AdminNavBar />
          <Switch>{this.getRoutes(routes)}</Switch>
          <Footer />
        </div>
      </div>
    );
  }
}
