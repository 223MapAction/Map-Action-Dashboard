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
import Dashboard from "views/Dashboard.jsx";
import UserProfile from "views/UserProfile.jsx";
// import TableList from "views/TableList.jsx";
// import Typography from "views/Typography.jsx";
// import Icons from "views/Icons.jsx";
import Maps from "views/Maps.jsx";
import Notifications from "views/Notifications.jsx";
import Incidents from "views/Incidents";
import AddElu from "views/AddElu";
import AllRapports from "views/AllRapports";
import Indicateurs from "views/Indicateurs";
import Users from "views/Users";
import Citoyens from "views/Citoyens";
import Categorie from "views/Categorie";
import Zone from "views/Zone";
import Contact from "views/Contact";
import Parametres from "views/Parametres";

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
    layout: "/admin",
  },
  {
    path: "/parametres",
    name: "Parametres",
    icon: "fas fa-tools",
    component: Parametres,
    layout: "/admin",
  },
  {
    path: "/incidents",
    name: "Incidents",
    icon: "fa fa-map-marker fa-2x",
    component: Incidents,
    layout: "/admin",
  },
  {
    path: "/rapports",
    name: "Rapports",
    icon: "fa fa-tasks fa-2x",
    component: AllRapports,
    layout: "/admin",
  },
  {
    path: "/indicateurs",
    name: "Indicateurs",
    icon: "fa fa-arrow-left fa-2x",
    component: Indicateurs,
    layout: "/admin",
  },
  {
    path: "/categories",
    name: "Categories",
    icon: "fa fa-tag fa-2x",
    component: Categorie,
    layout: "/admin",
  },
  {
    path: "/zones",
    name: "Zones",
    icon: "pe-7s-map-marker",
    component: Zone,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Utilisateurs",
    icon: "fa fa-users fa-2x",
    component: Users,
    layout: "/admin",
  },

  {
    path: "/elus",
    name: "Organisation",
    icon: "fa fa-user-secret fa-2x",
    component: AddElu,
    layout: "/admin",
  },
  {
    path: "/citoyens",
    name: "Citoyens",
    icon: "fa fa-user-plus fa-2x",
    component: Citoyens,
    layout: "/admin",
  },
  {
    path: "/contact",
    name: "Message",
    icon: "fa fa-comments fa-2x",
    component: Contact,
    layout: "/admin",
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "fa fa-user-circle fa-2x",
    component: UserProfile,
    layout: "/admin",
  },

  // {
  //        path: "/maps",
  //      name: "Maps",
  //        icon: "pe-7s-map-marker",
  //       component: Maps,
  //       layout: "/admin"
  //      },
];

export default dashboardRoutes;
