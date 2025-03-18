import React, { useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Container, Paper } from "@mui/material";
import Masonry from 'react-masonry-css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1769aa',
    },
    secondary: {
      main: '#fefefe',
    },
    text: {
      primary: '#333',
      secondary: '#777',
    },
    success: {
      main: '#4caf50',
    },
  },
  typography: {
    h4: {
      fontSize: '2rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#1769aa',
      fontFamily: 'Quicksand, sans-serif',
    },
    subtitle1: {
      fontSize: '1rem',
      textDecoration: 'underline',
      cursor: 'pointer',
      color: '#1769aa',
      textAlign: 'center',
      fontFamily: 'Quicksand, sans-serif',
    },
    body1: {
      fontSize: '1rem',
      color: '#333',
      fontFamily: 'Quicksand, sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#4caf50',
      fontFamily: 'Quicksand, sans-serif',
    },
  },
});

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }, // Fixed here
        });
        const userData = userResponse.data;

        if (userData.dateOfBirth) {
          userData.dateOfBirth = new Date(userData.dateOfBirth)
            .toISOString()
            .split("T")[0];
        }

        setUser(userData);

        const opportunitiesResponse = await axios.get("http://localhost:5000/api/users/applied-opportunities", {
          headers: { Authorization: `Bearer ${token}` }, // Fixed here
        });
        setAppliedOpportunities(opportunitiesResponse.data);

        setLoading(false);
      } catch (err) {
        setError("Error fetching user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const age = calculateAge(user.dateOfBirth);
    if (age < 20) {
      toast.error("Ineligible age. You must be at least 20 years old.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:5000/api/users/profile`, user, {
        headers: { Authorization: `Bearer ${token}` }, // Fixed here
      });
      const updatedUser = response.data;

      if (updatedUser.dateOfBirth) {
        updatedUser.dateOfBirth = new Date(updatedUser.dateOfBirth)
          .toISOString()
          .split("T")[0];
      }

      setUser(updatedUser);
      toast.success("Profile updated successfully");
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  const handleApply = () => {
    navigate('/');
  };

  if (loading)
    return <Container style={{ textAlign: "center", color: "gray" }}>Loading...</Container>;
  if (error) return <Container style={{ textAlign: "center", color: "red" }}>{error}</Container>;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ marginTop: 4 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Typography variant="h4">Applied Opportunities</Typography>
          <Typography
            variant="subtitle1"
            onClick={() => setIsDialogOpen(true)}
          >
            Update Profile
          </Typography>
        </Box>
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogContent>
            <form onSubmit={handleProfileUpdate}>
              <TextField
                margin="normal"
                fullWidth
                label="Full Name"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                fullWidth
                type="date"
                label="Date of Birth"
                value={user.dateOfBirth || ""}
                onChange={(e) =>
                  setUser({ ...user, dateOfBirth: e.target.value })
                }
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }} 
              />
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Update
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
        {appliedOpportunities.length > 0 ? (
          <Masonry
            breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {appliedOpportunities.map((opportunity) => (
              <Paper
                key={opportunity.id}
                sx={{
                  backgroundColor: '#ffffff',
                  padding: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  textAlign: 'center',
                  transition: 'transform 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 180,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  marginBottom: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  Administration
                </Typography>
                <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
                  Company: {opportunity.companyName}
                </Typography>
                <Typography variant="body2" sx={{ color: theme.palette.success.main }}>
                  Status: Applied
                </Typography>
              </Paper>
            ))}
          </Masonry>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body1" sx={{ color: 'black', display: 'inline' }}>
              No opportunities applied. 
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ color: theme.palette.primary.main, display: 'inline', ml: 1, cursor: 'pointer' }}
              onClick={handleApply}
            >
              Apply?
            </Typography>
          </Box>
        )}
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default Dashboard;
