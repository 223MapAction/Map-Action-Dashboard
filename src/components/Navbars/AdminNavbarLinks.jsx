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
import { Nav, NavDropdown, MenuItem } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { Redirect } from 'react-router-dom';
class AdminNavbarLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      // user: JSON.parse(sessionStorage.getItem('user'))
    };
  }

  logOut = () => {
    sessionStorage.clear();
    window.location.pathname = "/";
  };

  profile = () => {
    if (sessionStorage.getItem("user_type") == "admin") {
      window.location.pathname = "/admin/profile";
    } else {
      window.location.pathname = "/elu/profile-elu";
    }
  };
  render() {
    return (
      <div>
        {/* <Nav>          
          <NavItem eventKey={1} href="#">           
            <p className="hidden-lg hidden-md">Admin Sira Dashboard</p>
          </NavItem>          
        </Nav> */}
        <Nav pullRight>
          <NavDropdown
            title={sessionStorage.first_name}
            eventKey={2}
            id="basic-nav-dropdown-right"
          >
            <MenuItem eventKey={2.1} onClick={this.profile}>
              Profil
            </MenuItem>
            <MenuItem eventKey={2.2} onClick={this.logOut}>
              Log Out
            </MenuItem>
          </NavDropdown>
        </Nav>
      </div>
    );
  }
}

export default AdminNavbarLinks;
