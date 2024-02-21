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
// import UserProfile from "views/UserProfile.jsx";
// import TableList from "views/TableList.jsx";
// import Typography from "views/Typography.jsx";
// import Icons from "views/Icons.jsx";
// import Maps from "views/Maps.jsx";
// import Notifications from "views/Notifications.jsx";
// import Upgrade from "views/Upgrade.jsx";
// import Users from "views/Users";
import Admin from "layouts/Admin";

import IncidentByZone from "views/IncidentByZone";
import AddElu from "views/AddElu";
import Rapports from "views/Rapports";
import Notifications from "views/Notifications";
import AddRapport from "./views/AddRapport";
import UserProfile from "views/UserProfile";
import Message from "views/Messages";
import Dashboard from "views/DashboardElu.jsx";

// const dashboardRoutes = [
//   {
//     path: "/dashboard",
//     name: "Dashboard",
//     icon: "pe-7s-graph",
//     component: Dashboard,
//     layout: "/admin"
//   },
//   {
//     path: "/userProfile",
//     name: "User Profile",
//     icon: "pe-7s-user",
//     component: UserProfile,
//     layout: "/admin"
//   },
//   {
//     path: "/table",
//     name: "Table List",
//     icon: "pe-7s-note2",
//     component: TableList,
//     layout: "/admin"
//   },
//   {
//     path: "/typography",
//     name: "Typography",
//     icon: "pe-7s-news-paper",
//     component: Typography,
//     layout: "/admin"
//   },
//   {
//     path: "/icons",
//     name: "Icons",
//     icon: "pe-7s-science",
//     component: Icons,
//     layout: "/admin"
//   },
//   {
//     path: "/maps",
//     name: "Maps",
//     icon: "pe-7s-map-marker",
//     component: Maps,
//     layout: "/admin"
//   },
//   {
//     path: "/notifications",
//     name: "Notifications",
//     icon: "pe-7s-bell",
//     component: Notifications,
//     layout: "/admin"
//   },
//   {
//     upgrade: true,
//     path: "/upgrade",
//     name: "Upgrade to PRO",
//     icon: "pe-7s-rocket",
//     component: Upgrade,
//     layout: "/admin"
//   }
// ];
const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/elu",
  },
  {
    path: "/IncidentByZone",
    name: "Incidents",
    icon: "fa fa-map-marker fa-2x",
    component: IncidentByZone,
    layout: "/elu",
  },
  {
    path: "/rapports",
    name: "Rapports",
    icon: "fa fa-tasks fa-2x",
    component: Rapports,
    layout: "/elu",
  },
  {
    path: "/add-rapport",
    name: "Nouveau Rapport",
    icon: "fa fa-file fa-2x",
    component: AddRapport,
    layout: "/elu",
  },
  {
    path: "/message",
    name: "Message",
    icon: "fa fa-comments fa-2x",
    component: Message,
    layout: "/elu",
  },
  {
    path: "/profile-elu",
    name: "Profile Elu",
    icon: "fa fa-user-circle fa-2x",
    component: UserProfile,
    layout: "/elu",
  },
];

export default dashboardRoutes;
