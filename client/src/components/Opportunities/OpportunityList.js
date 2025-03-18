import React, { useState, useEffect } from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Typography, Container } from "@mui/material";
import Masonry from 'react-masonry-css'; 
import OpportunityCard from './OpportunityCard'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    },
    body1: {
      fontSize: '1rem',
      color: '#333', 
    },
    body2: {
      fontSize: '0.875rem',
      color: '#4caf50',
    },
  },
});

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/opportunities`);
        setOpportunities(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching opportunities");
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading)
    return <Container style={{ textAlign: "center", color: "gray" }}>Loading...</Container>;
  if (error) return <Container style={{ textAlign: "center", color: "red" }}>{error}</Container>;

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md" sx={{ marginTop: 4, pt: 10 }}>
        <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
          <Typography variant="h4">Available Opportunities</Typography>
        </Box>
        <Masonry
          breakpointCols={{ default: 3, 1100: 2, 700: 1 }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {opportunities.length > 0 ? (
            opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))
          ) : (
            <Typography>No opportunities available at the moment.</Typography>
          )}
        </Masonry>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default OpportunityList;
