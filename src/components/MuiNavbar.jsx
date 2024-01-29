import PropTypes from "prop-types";

import { Drawer, Box, Toolbar, List, ListItemButton} from '@mui/material';
import React from 'react';
import { Dashboard, DirectionsWalk, GridView, SelfImprovement, TempleHindu } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import Typography from '@mui/material/Typography';
import {
  Link as RouterLink,
  MemoryRouter,
  useNavigate
} from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';

const drawerWidth = 240;

function Router(props) {
    const { children } = props;
    if (typeof window === 'undefined') {
      return <StaticRouter location="/drafts">{children}</StaticRouter>;
    }
  
    return (
      <MemoryRouter initialEntries={['/drafts']} initialIndex={0}>
        {children}
      </MemoryRouter>
    );
  }
  
  Router.propTypes = {
    children: PropTypes.node,
  };
  
  const Link = React.forwardRef(function Link(itemProps, ref) {
    return <RouterLink ref={ref} {...itemProps} role={undefined} />;
  });
  
  function ListItemLink(props) {
    const { icon, primary, to } = props;
  
    return (
      <li>
        <ListItem button component={Link} to={to}>
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
        </ListItem>
      </li>
    );
  }
  
  ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  };


const MuiNavbar = (props) => {

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const navigation = useNavigate();

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };  

    const onSignoutButtonClick = (e) => {
      e.preventDefault();
      localStorage.clear();
      navigation("/signin");
    };     

  const container =
  window !== undefined ? () => window().document.body : undefined;
  return (
    <Box
    component="nav"
    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    aria-label="mailbox folders"
  >
    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
    <Drawer
      container={container}
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
    >
         <div>
        <Toolbar  sx={{background: "#E8A87C"}}>
            <Typography variant='h6'>
                Holywalk Admin
            </Typography>
            </Toolbar>
        <Divider />
        <List aria-label="main mailbox folders">
            <ListItemLink key={"0"} to="/" primary="Dashboard" icon={<Dashboard />} />
            <ListItemLink key={"1"} to="/holywalk" primary="Holywalk" icon={<DirectionsWalk />} />
            <ListItemLink key={"2"} to="/holyplaces" primary="Holyplaces" icon={<TempleHindu />} />
            <ListItemLink key={"3"} to="/projects" primary="Projects" icon={<GridView />} />
            <ListItemLink key={"4"} to="/retreats" primary="Retreats" icon={<SelfImprovement />} />
        </List>
        <Divider />
        <List aria-label="signout">
            <ListItemButton onClick={onSignoutButtonClick}>
              <ListItemText>Signout</ListItemText>
              </ListItemButton>
        </List>
    </div>
    </Drawer>
    <Drawer
      variant="permanent"
      sx={{
        background: "#ff0000",
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
      open
    >
          <div>
        <Toolbar sx={{background: "#E8A87C"}}>
            <Typography variant='h6'>
                Holywalk Admin
            </Typography>
            </Toolbar>
        <Divider />
        <List aria-label="main mailbox folders">
            <ListItemLink key={"0"} to="/" primary="Dashboard" icon={<Dashboard />} />
            <ListItemLink key={"1"} to="/holywalk" primary="Holywalk" icon={<DirectionsWalk />} />
            <ListItemLink key={"2"} to="/holyplaces" primary="Holyplaces" icon={<TempleHindu />} />
            <ListItemLink key={"3"} to="/projects" primary="Projects" icon={<GridView />} />
            <ListItemLink key={"4"} to="/retreats" primary="Retreats" icon={<SelfImprovement />} />
        </List>
        <Divider />
        <List aria-label="signout">
            <ListItemButton onClick={onSignoutButtonClick}>
              <ListItemText>Signout</ListItemText>
              </ListItemButton>
        </List>
    </div>
    </Drawer>
  </Box>
  )
}

export default MuiNavbar
