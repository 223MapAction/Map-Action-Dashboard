import React, { Component } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.jsx";
import EluLayout from "layouts/Elu.jsx";
import Login from "./components/Login";
import SignUp from "./components/register";
import AddRapport from "./views/AddRapport";
import ResetPassword from "./views/ResetPassword";
import ResetPasswordView from "./views/ResetPasswordView";

import UserProfile from "views/UserProfile.jsx";
// import Users from 'components/Users';
// import AdminDashboard from 'layouts/AdminDashboard';
// import Dashboard from 'views/Dashboard';

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import ShareIncident from "views/ShareIncident";
// import CreateJourney from 'components/journeys/CreateJourney';
import packageJson from "../package.json";
import { getBuildDate } from "./utils/utils";
import withClearCache from "./ClearCache";

const ClearCacheComponent = withClearCache(MainApp);

function App() {
  return <ClearCacheComponent />;
}

function MainApp() {
  // render() {
  // console.log("Build date :", getBuildDate(packageJson.buildDate));
  return (
    <BrowserRouter>
      <Route exact path="/" component={Login} />
      <Route path="/inscription" component={SignUp} />
      <Route exact path="/incident/:id" component={ShareIncident} />
      <Route path="/request-password" component={ResetPassword} />
      <Route path="/request-password-view" component={ResetPasswordView} />

      <Switch>
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      </Switch>
      <Switch>
        <Route path="/elu" render={(props) => <EluLayout {...props} />} />
      </Switch>
      <Switch>
        <Route
          path="/add-rapport"
          component={AddRapport}
          render={(props) => <EluLayout {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
  // }
}

export default App;
