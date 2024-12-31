"use client"
import React, { memo } from "react";
import { Box, Container, Grid, Typography, Paper, Grow } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SecurityIcon from "@mui/icons-material/Security";
import { keyframes } from "@mui/system";
import EmailIcon from '@mui/icons-material/Email';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';


const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1.5);
  }
`;

const StoreBox = ({ icon, title, description }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        transform: "scale(1.05)",
        boxShadow: 6,
      },
    }}
  >
    <Box
      sx={{
        mb: 2,
        color: "primary.main",
        animation: `${floatAnimation} 3s ease-in-out infinite`,
      }}
    >
      {icon}
    </Box>
    <Typography
      variant="h6"
      component="h2"
      gutterBottom
      color="primary"
      fontWeight="600"
    >
      {title}
    </Typography>
    <Typography variant="body2" color="primary.secondary" fontWeight="600">
      {description}
    </Typography>
  </Paper>
);

const FeatureBox = ({ icon, title, description, delay }) => (
  <Grow in={true} style={{ transformOrigin: "0 0 0" }} timeout={1000 + delay}>
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-10px)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          mb: 2,
          color: "primary.main",
          animation: `${pulseAnimation} 2s infinite`,
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        component="h2"
        gutterBottom
        color="primary"
        fontWeight="400"
      >
        {title}
      </Typography>
      <Typography variant="body2" color="primary.secondary" fontWeight="500">
        {description}
      </Typography>
    </Paper>
  </Grow>
);

const BannerCard = ({ title }) => {
  
  return (
    <Box sx={{ bgcolor: "background.default" }} mb={10}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            {
              title == "Banner2"
              ?
              <StoreBox
              icon={<UpdateIcon sx={{ fontSize: 40 }} />}
              title="Free Update"
              description="No Any Pay For Next Update"
              />
              :
              <FeatureBox
              icon={<EmailIcon fontSize="large" />}
              title="INSTANT LICENCE DELIVERY"
              description="Download Software Licence Key and invoices in your member's area as soon as you check out."
              delay={0}
              />
            }
          </Grid>
          <Grid item xs={12} md={4}>
          {
              title == "Banner2"
              ?
            <StoreBox
              icon={<StorefrontIcon sx={{ fontSize: 40 }} />}
              title="Available in Store"
              description="DBM Available On Microsoft Store"
            />
            :
            <FeatureBox
              icon={<PaymentIcon fontSize="large" />}
              title="EASY PAYMENT"
              description="We support many different types of payment types, Including PayPal, Razorpay And UPI Pay"
              delay={500}
            />
          }
          </Grid>
          <Grid item xs={12} md={4}>
          {
              title == "Banner2"
              ?
            <StoreBox
              icon={<SecurityIcon sx={{ fontSize: 40 }} />}
              title="Secure Payment"
              description="100% secure payment"
            />
            :
            <FeatureBox
              icon={<LocalOfferIcon fontSize="large" />}
              title="DAILY DISCOUNT COUPONS"
              description="Use 200FF Code & Get 20% Discount on order"
              delay={1000}
            />
          }
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(BannerCard);
