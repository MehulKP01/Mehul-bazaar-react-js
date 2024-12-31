"use client";

import React, { memo, useRef, useState } from "react";
import Link from "next/link";

import { Box, Container, Grid, Typography } from "@mui/material";

const LocalPhoneIcon = dynamic(() => import("@mui/icons-material/LocalPhone"), {
  ssr: false,
});
const MarkunreadOutlinedIcon = dynamic(
  () => import("@mui/icons-material/MarkunreadOutlined"),
  { ssr: false }
);
const LocationOnOutlinedIcon = dynamic(
  () => import("@mui/icons-material/LocationOnOutlined"),
  { ssr: false }
);
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";


const ContactForm = dynamic(() =>
  import("../../src/components/ContactForm/ContactForm.jsx"), {ssr:false}
);

import { displaySnackBar } from "../../src/common/snackBar.js";

import { useTheme } from "@emotion/react";
import { api } from "../../src/utils/axiosInstance.js";
import dynamic from "next/dynamic.js";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles((theme) => ({
  iconButton: {
    boxShadow: "0px 4px 4px rgba(1, 0, 0, 0.25)", // Define the box shadow here
  },
  iconBox: {
    height: "64px",
    width: "64px",
    backgroundColor: "#EEEEEE",
    borderRadius: "5px",
  },
  contactForm: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "3% 4% 4% 5%",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "blue",
      },
    },
  },
}));

const Contact = () => {
  const appdatalogo = useSelector((state) => state?.shop?.appdata?.app);

  const classes = useStyles();
  const theme = useTheme();
  const recaptchaRef = useRef(null);
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setContactData({
      ...contactData,
      [name]: name === "human" ? checked : value,
    });
  };

  const handlePhoneChange = (value) => {
    setContactData({
      ...contactData,
      phone: value,
    });
  };

  const handleRecaptchaChange = (token) => {
    setIsVerified(token);
  };
  const [isContactFormIsFilled, setIsContactFormIsFilled] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isVerified) {
      try {
        const { data } = await api.post("user/contact/add", {
          ...contactData,
          recaptchaValue: isVerified,
        });

        if (data?.status) {
          setIsContactFormIsFilled(true);
          displaySnackBar(data?.message, "success", "top", "right");
          setIsVerified("");
        } else {
          displaySnackBar(data?.message, "error", "top", "right");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } else {
      alert("Please verify that you're not a robot.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "50vh", py: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          mb: 1,
        }}
      >
        <LocalPhoneIcon fontSize="small" color="primary" />
        <Typography
          variant="body1"
          fontSize="large"
          sx={{ fontWeight: "700" }}
          ml={1}
        >
          Contact
        </Typography>
      </Box>
      <Grid container sx={{ mb: 5 }} spacing={6}>
        <Grid lg={6} md={6} sm={6} item xs={12}>
          <Typography
            variant="subtitle1"
            sx={{ my: 2, fontWeight: "600", fontSize: "20px" }}
          >
            Contact Information
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "400", fontSize: "15px" }}
            textAlign="justify"
          >
            We’re thrilled to connect with you! Whether you have questions, need
            assistance, or want to explore our digital marketing software
            solutions, our team is here to help. Reach out to us via the
            following channels:
          </Typography>
          <Box
            variant="body2"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              mt: 3,
              mb: 6,
            }}
          >
            <Box
              className={classes.iconBox}
              p={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <LocalPhoneIcon />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600">
                Hotline
              </Typography>
              <Typography>
                <Link
                  sx={{ color: "#fff" }}
                  href={"tel:" + appdatalogo?.generalSetting?.phone}
                >
                  {appdatalogo?.generalSetting?.phone}
                </Link>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 6 }}>
            <Box
              className={classes.iconBox}
              p={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <MarkunreadOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600">
                Official Email
              </Typography>
              <Link href={"mailto:" + appdatalogo?.generalSetting?.email}>
                {appdatalogo?.generalSetting?.email}
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Box
              className={classes.iconBox}
              p={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <LocationOnOutlinedIcon />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight="600">
                Our Location
              </Typography>
              <Typography
                sx={{ width: "100%", maxWidth: "200px", cursor: "pointer" }}
              >
                {`Address : ${appdatalogo?.generalSetting?.address}`}
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid lg={6} md={6} sm={6} item xs={12}>
          <ContactForm
            isContactFormIsFilled={isContactFormIsFilled}
            handleSubmit={handleSubmit}
            contactData={contactData}
            handleChange={handleChange}
            handlePhoneChange={handlePhoneChange}
            handleRecaptchaChange={handleRecaptchaChange}
            recaptchaRef={recaptchaRef}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;
