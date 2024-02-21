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
import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// import NotificationSystem from "react-notification-system";

import AdminNavbar from "components/Navbars/AdminNavbar";
import Login from "components/Login";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

// import { style } from "variables/Variables.jsx";

import routesElu from "routesElu.js";

import image from "assets/img/sidebar-2.jpg";

class Elu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: sessionStorage.getItem('token'),
      Config: {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      },
      userID: window.sessionStorage.getItem('user_id'),
      userType: window.sessionStorage.getItem('user_type'),
      _notificationSystem: null,
      image: image,
      color: "black",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open"
    };
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.layout === "/elu") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={props => (
              <prop.component
                {...props}
              />
            )}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = path => {
    for (let i = 0; i < routesElu.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routesElu[i].layout + routesElu[i].path
        ) !== -1
      ) {
        return routesElu[i].name;
      }
    }
    return "Brand";
  };
  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };
  handleFixedClick = () => {
    if (this.state.fixedClasses === "dropdown") {
      this.setState({ fixedClasses: "dropdown show-dropdown open" });
    } else {
      this.setState({ fixedClasses: "dropdown" });
    }
  };
  componentDidMount() {
    if (this.state.userType != 'elu') {
      return <Login />
    }
    var color = Math.floor(Math.random() * 4 + 1);
    var level;
    switch (color) {
      case 1:
        level = "success";
        break;
      case 2:
        level = "warning";
        break;
      case 3:
        level = "error";
        break;
      case 4:
        level = "info";
        break;
      default:
        break;
    }
  }
  componentDidUpdate(e) {
    if (
      window.innerWidth < 993 &&
      e.history.location.pathname !== e.location.pathname &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
    if (e.history.action === "PUSH") {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainPanel.scrollTop = 0;
    }
  }
  render() {
    if (this.state.token === null || this.state.isSessionExpiration === true) {
      // <Redirect to="/"/>
      return <Login />
    } else {
      return (
        <div className="wrapper">
          <Sidebar {...this.props} routes={routesElu} image={this.state.image}
            color={this.state.color}
            hasImage={this.state.hasImage} />
          <div id="main-panel" className="main-panel" ref="mainPanel">
            <AdminNavbar
              {...this.props}
              brandText={this.getBrandText(this.props.location.pathname)}
            />

            <Switch>{this.getRoutes(routesElu)}</Switch>
            <Footer />

          </div>
        </div>
      );
    }
  }

}

export default Elu;
