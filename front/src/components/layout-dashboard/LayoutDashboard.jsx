import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { Person, Menu as MenuIcon, LocalParking } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 250;

const Menu = () => {
  const navigate = useNavigate();

  const handleClickMenuItem = (route) => () => {
    navigate(route);
  };

  return (
    <>
      <Toolbar>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
      </Toolbar>
      <Divider />
      <List>
        <ListItem button onClick={handleClickMenuItem("/user")}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Les utilisateurs" />
        </ListItem>
        <ListItem button onClick={handleClickMenuItem("/parking")}>
          <ListItemIcon>
            <LocalParking />
          </ListItemIcon>
          <ListItemText primary="Les places de parking" />
        </ListItem>
      </List>
    </>
  );
};

const LayoutDashboard = ({ window, children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((state) => !state);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <Menu />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Menu />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ background: "rgb(239, 239, 239)" }}
        height="100vh"
        padding={3}
        width="1"
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default LayoutDashboard;
