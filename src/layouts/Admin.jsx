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
// import Notifications from "views/Notifications.jsx";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.jsx";

// import { style } from "variables/Variables.jsx";

import routes from "routes.js";
import routesElu from "routesElu";

import image from "assets/img/sidebar-3.jpg";
import EluDashboard from "./EluDashboard";
import { Grid, Row } from "react-bootstrap";
import AddRapport from "views/AddRapport";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: sessionStorage.getItem("token"),
      isAdmin: false,
      userType: sessionStorage.getItem("user_type"),
      Config: {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      },
      userID: sessionStorage.getItem("user_id"),
      _notificationSystem: null,
      image: image,
      color: "#38A0DB",
      hasImage: true,
      fixedClasses: "dropdown show-dropdown open",
    };
  }

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" || prop.layout === "/elu") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        this.props.location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  handleImageClick = (image) => {
    this.setState({ image: image });
  };
  handleColorClick = (color) => {
    this.setState({ color: color });
  };
  handleHasImage = (hasImage) => {
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
    // if (this.state.userType !== "admin") {
    //   return <Login />;
    // }

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

  // componentWillMount() {
  //   if (this.state.userType === "elu") {
  //     // return <Login />;

  //     this.props.history.push("/");
  //     // browserHistory.push("/");
  //   }
  // }

  render() {
    let userType = "";
    var get_rt = [];
    let token = sessionStorage.getItem("token") || "";
    if (token !== undefined || token.trim().length !== 0) {
      userType = sessionStorage.getItem("user_type") || "";
      if (userType.trim().length !== 0) {
        if (userType === "admin") {
          get_rt = routes;
          // console.log("routes admin ==> ", get_rt);
        } else if (userType === "elu") {
          // console.log("user type=>", userType);
          // console.log("routes elu ==> ", routesElu);
          get_rt = routesElu;
        }
      }
    }

    let path = [];
    get_rt.forEach((element) => {
      if (!path.includes(element.layout + element.path)) {
        path.push(element.layout + element.path);
      }
    });
    const renderNotFound = (
      <div className="content" style={{ backgroundColor: "#fff" }}>
        <Grid>
          <Row>
            <h2>Page introuvable</h2>
          </Row>
        </Grid>
      </div>
    );

    console.log(!this.state.userType);
    if (this.state.token === null || this.state.isSessionExpiration === true) {
      return <Redirect to={{ pathname: "/" }} />;
      // return <Login />;
    } else {
      return (
        <div className="wrapper">
          <Sidebar
            {...this.props}
            routes={get_rt}
            // routes={routes}
            image={this.state.image}
            color={this.state.color}
            hasImage={this.state.hasImage}
          />
          <div id="main-panel" className="main-panel" ref="mainPanel">
            <AdminNavbar
              {...this.props}
            // brandText={this.getBrandText(this.props.location.pathname)}
            />

            <Switch>
              {" "}
              <Route
                path="/elu/add-rapport"
                render={(props) => <AddRapport {...props} />}
              />
              {this.getRoutes(get_rt)}
            </Switch>
            {!path.includes(this.props.location.pathname) ? renderNotFound : ""}

            <Footer />
          </div>
        </div>
      );
    }
  }
}
export default Admin;
