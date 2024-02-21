import React, { Component } from 'react';
import './users.css';
import { Grid, Row, Col, Table } from "react-bootstrap";
import axios from 'axios';
// import Admin from 'layouts/Admin';
// import Sidebar from 'components/Sidebar/Sidebar';
// import Dashboard from 'views/Dashboard';
// import AdminDashboard from 'layouts/AdminDashboard';
export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount = () => {
    // this.getUsers();
  }

  getUsers = () => {
    axios.get("users", {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer${sessionStorage.token}`
      }
    }).then((response) => {
      console.log(response);
    }).catch((error) => { console.log(error.message) });
  }

  render() {
    return (
      // <React.Fragment>
      //   <AdminDashboard />
      //   <div id="main-panel" className="main-panel" ref="mainPanel">
      //     <div className="content">
      //       <h1>Table Users Components</h1>
      //     </div>                
      //   </div>     

      // </React.Fragment>
      <div className="content">
        <Grid fluid>
          <h1>Users Components</h1>
        </Grid>
      </div>
    );
  }
}
// export default connect(
//     ({ users }) => ({ ...users }),
//     dispatch => bindActionCreators({ ...usersActions }, dispatch)
//   )( users );