"use client";

import React, { lazy } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

import BazaarImage from "../../src/components/BazaarImage.jsx";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircularProgressWithLabel from "@mui/material/CircularProgress"

const Testimonials = lazy(() =>
  import("../../src/components/AboutPage/Testimonials.jsx")
);
const GlobalRatings = lazy(() =>
  import("../../src/components/AboutPage/GlobalRatings.jsx")
);

const useStyles = makeStyles((theme) => ({
  customIcon: {
    color: "#1783FE", // Fire color
    fontSize: "50px",
    marginRight: theme.spacing(1),
    animation: "$fire 1s infinite",
  },
  fadeIn: {
    animation: "$fadeIn 2s",
  },
  bounce: {
    animation: "$bounce 2s infinite",
  },
  "@keyframes fire": {
    "0%": {
      opacity: 1,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.9,
      transform: "scale(1.5)", // Simulate flickering by scaling up
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-30px)",
    },
    "60%": {
      transform: "translateY(-15px)",
    },
  },
}));

const About = () => {
  const classes = useStyles();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Container sx={{ minHeight: "95vh", py: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            mb: 1,
          }}
        >
          <InfoOutlinedIcon fontSize="small" color="primary" />
          <Typography
            variant="body1"
            fontSize="large"
            sx={{ fontWeight: "700" }}
            ml={1}
          >
            About Us
          </Typography>
        </Box>
        <Grid container spacing={isSmallScreen ? 2 : 10} mb={5}>
          <Grid item lg={6} md={6} sm={12} xs={12} position="relative">
            <BazaarImage
              src="/assets/images/banners/about.png"
              sx={{ mx: "auto", maxWidth: "100%" }}
            />
            <BazaarImage
              src="/assets/images/banners/traffic.png"
              className={classes.bounce}
              sx={{
                mx: "auto",
                maxWidth: "100%",
                width: isSmallScreen ? "30%" : "40%",
                position: "absolute",
                zIndex: 1,
                top: isSmallScreen ? "290px" : "600px",
                left: isSmallScreen ? "4%" : "40px",
              }}
            />
            <Box
              sx={{
                width: "230px",
                height: "60px",
                position: "absolute",
                borderRadius: "0px",
                background: "#fff",
                top: "120px",
                right: "-30px",
                display: "flex",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              <Typography align="left" fontSize={"20px"} fontWeight={400}>
                Conversion
              </Typography>
              <Box sx={{ display: "inline-flex" }}>
                <CircularProgressWithLabel value={85} />
                <Box
                  sx={{
                    top: 0,
                    left: 134,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography>85%</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Typography
              variant="h6"
              sx={{ color: "#1783FE", fontSize: "20px" }}
            >
              Digi Bulk Marketing
            </Typography>
            <Typography
              variant="h5"
              sx={{ color: "#000000", fontWeight: "600", my: 3 }}
            >
              Unlock Your Marketing Potential with DigiBulkMarketing!
            </Typography>
            <Typography
              sx={{
                color: "#676767",
                my: 5,
                textAlign: "justify",
              }}
            >
              At Digi Bulk Marketing, we are passionate about empowering
              businesses with cutting-edge marketing solutions. As a leading
              software-selling company, we specialize in providing robust tools
              that streamline marketing efforts, enhance customer engagement,
              and drive growth. Our team of dedicated professionals combines
              technical expertise with a deep understanding of market dynamics
              to deliver innovative software products. Whether it’s email
              campaigns, social media automation, or data analytics, we’re
              committed to helping our clients achieve their marketing goals.
              Join us on this digital journey, and let’s transform the way you
              connect with your audience!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                color: "#000000",
              }}
              className={classes.bounce}
            >
              <NotStartedIcon
                className={classes.customIcon}
                sx={{
                  color: "#1783FE",
                  fontSize: "50px",
                  mr: 1,
                }}
              />{" "}
              Our Story
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <GlobalRatings />

      <Container>
        <Grid container spacing={10} my={1}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <BazaarImage
              src="/assets/images/banners/aboutround.png"
              sx={{ mx: "auto", maxWidth: "100%" }}
              className={classes.bounce}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12} position="relative">
            <Box>
              <Typography variant="subtitle1" sx={{ color: "#1783FE" }}>
                Digi Bulk Marketing
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: "#000000",
                  fontWeight: "600",
                  my: 3,
                }}
              >
                Unlock Your Marketing Potential with DigiBulkMarketing!
              </Typography>
              <Typography
                sx={{
                  color: "#717171",
                  my: 3,
                  textAlign: "justify",
                }}
              >
                Digi Bulk Marketing software is most popular solution to send
                bulk WA notification messages. It’s a software to developed for
                to grow your business to help you generate quality leads and
                inturn more sales. We use bank-level encryption for 100% data
                security only you have to access to see your data. We are only
                one in the industry they provide you AI mechanism.
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  color: "#000000",
                  fontSize: "18px",
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: "#1783FE",
                    fontSize: "35px",
                    mr: 1,
                  }}
                />
                Global Reach
              </Typography>
              <Typography ml={6}>Upto 100%</Typography>
            </Box>
            <Box my={1}>
              <Typography
                variant="subtitle2"
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "center",
                  color: "#000000",
                  fontSize: "18px",
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: "#1783FE",
                    fontSize: "35px",
                    mr: 1,
                  }}
                />{" "}
                Convenience
              </Typography>
              <Typography ml={6} sx={{ width: "100%", maxWidth: "200px" }}>
                To reach your target and get more traffict increment
              </Typography>
            </Box>
            <BazaarImage
              src="/assets/images/banners/barchar.png"
              sx={{
                mx: "auto",
                maxWidth: "100%",
                width: isSmallScreen ? "30%" : "35%",
                position: "absolute",
                zIndex: 1,
                top: isSmallScreen ? "389px" : "350px",
                left: isSmallScreen ? "70%" : "380px",
              }}
            />
          </Grid>
        </Grid>
      </Container>

      <Testimonials />
    </>
  );
};
export default About;
