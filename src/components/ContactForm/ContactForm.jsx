import React, { memo } from "react";

import { Box, Grid, TextField, Typography, Button, Alert } from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import PhoneInput from "react-phone-input-2";
import ReCAPTCHA from "react-google-recaptcha";
import BazaarImage from "components/BazaarImage.jsx";

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

const ContactForm = ({
  isContactFormIsFilled,
  handleSubmit,
  contactData,
  handleChange,
  handlePhoneChange,
  handleRecaptchaChange,
  recaptchaRef,
}) => {
  const classes = useStyles();
  const siteKey = "6LdxU7QpAAAAADkyc3j87YXJWo0FI39k9_bZpHrc";

  return (
    <Box className={classes.contactForm} position="relative">
      <Box
        sx={{
          mb: 4,
          fontSize: "14px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "600", fontSize: "28px" }}
        >
          Let’s
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "300", fontSize: "28px", ml: 1 }}
        >
          Talk
        </Typography>
      </Box>
      {isContactFormIsFilled ? (
        <Alert severity="success">
          Thank you for contacting us ...
          <br />
          our team will contact you soon.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={6} sx={{ mb: 1 }}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Name"
                name="name"
                value={contactData.name}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} sx={{ mb: 1 }}>
              <PhoneInput
                fullWidth
                inputStyle={{
                  width: "100%",
                  height: "36px",
                  fontSize: "18px",
                  fontFamily: "Monospace",
                  border: "1px solid #AEB4BE",
                  backgroundColor: "rgba(0, 0, 0, 0)",
                  color: "#474a48",
                }}
                dropdownStyle={{
                  color: "#AEB4BE",
                }}
                country={"in"}
                variant="outlined"
                value={contactData.phone}
                onChange={handlePhoneChange}
                placeholder="+91"
              />
            </Grid>
            <Grid sx={{ mb: 1 }} item xs={12}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Email"
                name="email"
                value={contactData.email}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>
            <Grid sx={{ mb: 1 }} item xs={12}>
              <TextField
                multiline
                rows={3}
                fullWidth
                id="outlined-basic"
                label="Message"
                name="feedback"
                value={contactData.feedback}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={siteKey}
                onChange={handleRecaptchaChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
      <BazaarImage
        src="/assets/images/banners/flower.png"
        sx={{
          position: "absolute",
          top: "295px",
          left: "-120px",
          zIndex: -1,
          width: "100%",
          maxWidth: "140px",
        }}
      />
    </Box>
  );
};

export default memo(ContactForm);
