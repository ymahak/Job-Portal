import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, Link } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { motion } from "framer-motion";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OpportunityList from "./components/Opportunities/OpportunityList";
import Dashboard from "./components/Dashboard/Dashboard";

// Updated theme with new button color
const theme = createTheme({
  palette: {
    primary: {
      main: '#1769aa', // Kept for other elements
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f0f4f8',
    },
    // Adding custom color for buttons
    teal: {
      main: '#26a69a', // Vibrant teal for buttons
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: '"Quicksand", sans-serif',
  },
  components: {
    // Override Button styles
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#26a69a', // Default button color
          '&:hover': {
            backgroundColor: '#00897b', // Darker teal on hover
          },
        },
      },
    },
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

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

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
    <motion.div initial={{ y: -70 }} animate={{ y: 0 }} transition={{ duration: 0.6 }}>
      {/* Updated header with purple gradient */}
      <AppBar position="fixed" sx={{ 
        width: '100%', 
        background: 'linear-gradient(to right, #6a1b9a, #ab47bc)', // Deep purple to lighter purple
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2, color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            <motion.span whileHover={{ scale: 1.1 }} transition={{ type: 'spring' }}> Jobify</motion.span>
          </Typography>
          <Box sx={{ display: 'flex', gap: '1rem', mr: 2 }}>
            {!token ? (
              <>
                <Button 
                  color="inherit" 
                  component={NavLink} 
                  to="/login" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { 
                      backgroundColor: '#00897b' // Darker teal on hover
                    } 
                  }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  component={NavLink} 
                  to="/register" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { 
                      backgroundColor: '#00897b' 
                    } 
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button 
                  color="inherit" 
                  component={NavLink} 
                  to="/" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { 
                      backgroundColor: '#00897b' 
                    } 
                  }}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  component={NavLink} 
                  to="/dashboard" 
                  sx={{ 
                    color: '#fff',
                    '&:hover': { 
                      backgroundColor: '#00897b' 
                    } 
                  }}
                >
                  Dashboard
                </Button>
                <IconButton onClick={handleMenuOpen} color="inherit">
                  <AccountCircleOutlinedIcon />
                </IconButton>
                <Menu 
                  anchorEl={anchorEl} 
                  open={open} 
                  onClose={handleMenuClose} 
                  PaperProps={{ 
                    sx: { 
                      minWidth: 200,
                      backgroundColor: '#fff',
                      color: '#6a1b9a', // Matching purple theme
                    } 
                  }}
                >
                  <MenuItem disabled sx={{ fontWeight: 'bold' }}>Hi, {username || "User"}</MenuItem>
                  <MenuItem onClick={handleProfileUpdate}>User Info</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

const Footer = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    <Box sx={{ backgroundColor: 'white', color: 'black', p: 4, mt: 'auto', position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Jobify</Typography>
          <Typography variant="body2">Empowering your career journey, one opportunity at a time.</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Quick Links</Typography>
          <Link href="/" underline="hover" sx={{ display: 'block', color: 'black', mb: 0.5, '&:hover': { color: '#26a69a' } }}>
            Home
          </Link>
          <Link href="/dashboard" underline="hover" sx={{ display: 'block', color: 'black', mb: 0.5, '&:hover': { color: '#26a69a' } }}>
            Dashboard
          </Link>
          <Link href="/login" underline="hover" sx={{ display: 'block', color: 'black', mb: 0.5, '&:hover': { color: '#26a69a' } }}>
            Login
          </Link>
          <Link href="/register" underline="hover" sx={{ display: 'block', color: 'black', mb: 0.5, '&:hover': { color: '#26a69a' } }}>
            Register
          </Link>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Contact Us</Typography>
          <Typography variant="body2">Email: support@jobify.com</Typography>
          <Typography variant="body2">Phone: +1 123 456 7890</Typography>
        </Box>
      </Box>
      <Typography variant="body2" align="center" sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 2 }}>
        © {new Date().getFullYear()} Mahak - All rights reserved.
      </Typography>
    </Box>
  </motion.div>
);

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
          backgroundImage: 'url(https://source.unsplash.com/featured/?technology,workspace)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
        }}
      >
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            margin: '20px',
            background: 'rgba(255,255,255,0.85)',
            marginBottom:'20px',
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 1,
            marginBottom:'10px',
            p: 2,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', maxWidth: 900 }}
          >
            <Box
              sx={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                borderRadius: 4,
                p: 4,
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                alt="Job Search"
                style={{ width: '80px', marginBottom: '20px' }}
              />
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#6a1b9a' }}> {/* Matching header color */}
                Welcome to Jobify - Your Career Starts Here!
              </Typography>

              <Routes>
                <Route path="/" element={<OpportunityList />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Box>
          </motion.div>
        </Box>

        {/* Footer Decorative Image */}
        <Box sx={{ zIndex: 1, textAlign: 'center', pb: 2 }}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
            alt="Work"
            style={{ width: '60px', opacity: 0.8 }}
          />
        </Box>

        {/* Footer Component */}
        <Footer />
      </Box>
    </Router>
  </ThemeProvider>
);

export default App;