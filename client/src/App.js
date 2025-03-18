import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OpportunityList from "./components/Opportunities/OpportunityList";
import Dashboard from "./components/Dashboard/Dashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1769aa',
    },
    secondary: {
      main: '#f50057', 
    },
    background: {
      default: '#ffffff', 
    },
  },
  typography: {
    fontFamily: '"Quicksand", sans-serif',
  },
});

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const Navbar = () => {
  const token = localStorage.getItem("token"); 
  const username = localStorage.getItem("username"); 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    handleMenuClose();
    navigate("/login");
  };

  const handleProfileUpdate = () => {
    handleMenuClose();
    navigate("/dashboard");
  };

  return (
    <AppBar position="fixed" sx={{ width: '100%', top: 0, left: 0, zIndex: 1300 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '1rem' }}>
          Job Portal
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem', marginRight: '1rem' }}>
          {!token && (
            <>
              <Button color="inherit" component={NavLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={NavLink} to="/register">
                Register
              </Button>
            </>
          )}
          {token && (
            <>
              <Button color="inherit" component={NavLink} to="/">
                Home
              </Button>
              <Button color="inherit" component={NavLink} to="/dashboard">
                Dashboard
              </Button>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{ marginLeft: '1rem' }}
              >
                <AccountCircleOutlinedIcon sx={{ color: 'white' }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    minWidth: 200,
                  },
                }}
              >
                <MenuItem disabled sx={{ fontWeight: 'bold' }}>Hi, {username || "User"}</MenuItem>
                <MenuItem
                  onClick={handleProfileUpdate}
                  sx={{ '&:hover': { color: theme.palette.primary.main } }}
                >
                  User Info
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{ '&:hover': { color: theme.palette.primary.main } }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <Router>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          paddingTop: '64px', 
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Routes>
            <Route path="/" element={<OpportunityList />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  </ThemeProvider>
);

export default App;
