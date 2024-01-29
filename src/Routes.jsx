import Itemlist from "./components/Itemlist";

const Routes = [
    {
      path: '/',
      sidebarName: 'Home',
      component: Itemlist
    },
    {
      path: '/dashboard',
      sidebarName: 'Home',
      component: Itemlist
    },    
    {
      path: '/holywalk',
      sidebarName: 'Holywalk',
      component: Itemlist
    },
    {
      path: '/temples',
      sidebarName: 'Temples',
      component: Itemlist
    },
  ];
  
  export default Routes;