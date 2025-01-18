"use client"

import React, { lazy } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HandshakeIcon from "@mui/icons-material/Handshake";
const ResellerFeature = lazy(()=> import ('../../src/components/reseller/ResellerFeature'))
const ResellerFeature2 = lazy(()=> import ('../../src/components/reseller/ResellerFeature2'))

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AnimatedBox = styled(Box)(({ theme }) => ({
    animation: `${fadeIn} 1s ease-out`,
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedPaper = styled(Paper)(({ theme, delay }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    animation: `${fadeInUp} 0.9s ease-out ${delay}s both`,
    transition: 'transform 0.9s ease-in-out, box-shadow 0.9s ease-in-out',
    '&:hover': {
        transform: 'translateY(-18px)',
        boxShadow: theme.shadows[10],
    },
}));

const IconAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const AnimatedIcon = styled(IconButton)(({ theme }) => ({
    animation: `${IconAnimation} 2s infinite`,
    '&:hover': {
        animation: 'none',
    },
}));

const Reseller = () => {
  return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <AnimatedBox>
          <Typography
            variant="body1"
            fontSize={"large"}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
            }}
          >
            <HandshakeIcon fontSize="small" color="primary" />
            Reseller
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6} mt={1}>
              <Typography variant="h4" gutterBottom>
                Why choose us?
              </Typography>
              <Typography variant="h5" gutterBottom>
                We helps startups in the early stages.
              </Typography>
              <Typography variant="body1" paragraph textAlign="justify">
                Well, It's Simple! If you are Running a Restaurant, Clothing
                Shop, or Furniture Shop for example.. you will having daily walk
                in Customers and you don't have time to save their number to
                send welcome message/or thank you for Dining/Purchasing message.
                With the help of DIGI BULK MARKETING Without saving your
                customer number You can send your Transactional message to all
                your daily walk in Customer in a Bulk, with RATING request on
                various platform, also Optionally Tell them to save your number
                for future Offer Updates,via WhatsApp Status
              </Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <AnimatedButton
                  variant="contained"
                  color="primary"
                  component="a"
                  href="https://reseller.digibulkmarketing.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join As Reseller
                </AnimatedButton>
                <AnimatedButton
                  variant="contained"
                  color="primary"
                  component="a"
                  href="https://master.digibulkmarketing.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join As Master
                </AnimatedButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                <img
                  src="assets/images/giphy.gif"
                  alt="Animated GIF"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6} mt={1}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  <InstallDesktopIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Easy to Install
                </Typography>
                <List>
                  {[
                    "Simple to install",
                    "Easy to update",
                    "Easy to troubleshoot",
                    "Effective error handling",
                    "Available on Microsoft Store",
                    "Available on Google Chrome Extension",
                    "OS Supported: Windows 11 & 10 (32 & 64 bit), Windows 8/7/Vista & XP.",
                  ].map((text, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircleOutlineIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>
                  <TouchAppIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Easy To Use
                </Typography>
                <Typography variant="body1">
                  100% working, safe and fastest Bulk WhatsApp Sender. Bulk
                  WhatsApp Marketing Software for sending text, photo, document
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </AnimatedBox>
        <Grid container spacing={4} mt={5}>
          <ResellerFeature2 />
        </Grid>

        <Box sx={{ mt: 8, mb: 5, textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Categories
          </Typography>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Most Reseller Ask
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1, padding: 4 }}>
          <Grid container spacing={4}>
            <ResellerFeature />
          </Grid>
        </Box>
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Our Service
          </Typography>
          <Typography variant="h4" component="h3" fontWeight="bold">
            Delivering the right solutions.
          </Typography>
          <Typography variant="h6" component="h6" mt={3}>
            To be sure that the enterprise is creating the right solutions for
            the right customers at the right time, they must balance their
            execution
          </Typography>
        </Box>
      </Container>
  );
};
export default Reseller;
