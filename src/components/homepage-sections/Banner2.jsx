import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SecurityIcon from '@mui/icons-material/Security';
import { keyframes } from '@mui/system';

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StoreBox = ({ icon, title, description }) => (
  <Paper elevation={3} sx={{ 
    p: 3, 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 6,
    }
  }}>
    <Box sx={{ 
      mb: 2, 
      color: 'primary.main',
      animation: `${floatAnimation} 3s ease-in-out infinite`
    }}>
      {icon}
    </Box>
    <Typography variant="h6" component="h2" gutterBottom color="primary" fontWeight="600">
      {title}
    </Typography>
    <Typography variant="body2" color="primary.secondary" fontWeight="600">
      {description}
    </Typography>
  </Paper>
);

const Banner2 = () => {
  return (
    <Box sx={{ bgcolor: 'background.default'}} mb={10}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StoreBox
              icon={<UpdateIcon sx={{ fontSize: 40 }} />}
              title="Free Update"
              description="No Any Pay For Next Update"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StoreBox
              icon={<StorefrontIcon sx={{ fontSize: 40 }} />}
              title="Available in Store"
              description="DBM Available On Microsoft Store"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StoreBox
              icon={<SecurityIcon sx={{ fontSize: 40 }} />}
              title="Secure Payment"
              description="100% secure payment"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Banner2;





