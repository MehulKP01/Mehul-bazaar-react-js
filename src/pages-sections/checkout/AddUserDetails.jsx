import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  TextField,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { useSnackbar } from "notistack";
import ClearIcon from "@mui/icons-material/Clear";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../redux/reducers/shop.reducer";

// ==================================================================

// ==================================================================

const AddUserDetails = () => {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const [addCardForm, setAddCardForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  // const [checkedValue, setCheckedValue] = useState(null);
  const [error, setError] = useState(false);
  const userDetail = useSelector((state) => state?.shop.userDetails);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  console.log("check userDetails", userDetail);
  const [userDetails, setUserDetails] = useState({
    name: userDetail.name ?? "",
    email: userDetail.email ?? "",
    phone: userDetail.phone ?? "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setUserDetails((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const saveUserDetails = (e) => {
    setShowValidation(true);

    if (
      userDetails.name !== "" &&
      userDetails.email !== "" &&
      userDetails.phone !== ""
    ) {
      dispatch(getUserDetails(userDetails));
      setLoading(false)
      setAddCardForm(false);
      enqueueSnackbar("User Details Save Successfully", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "left",
      },
      });
    }
  };



  const handlePhoneChange = (value) => {
    setUserDetails({
      ...userDetails,
      phone: value,
    });
  };

  useEffect(() => {
    if (showValidation) {
      setTimeout(() => setShowValidation(false), 2000);
    }
  }, [showValidation]);

  return (
    <>
      {/* <Fragment>
      <Button
        color="primary"
        variant="outlined"
        sx={{
          p: "2px 20px",
        }}
        onClick={() => setAddCardForm(true)}
      >
        Add Details
      </Button>

      <Dialog open={addCardForm} onClose={handleClose}>
        <DialogContent sx={{overflow:'hidden',}}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" mb={3}>
              Add Details
            </Typography>
            <ClearIcon
              color="primary"
              onClick={handleClose}
              sx={{ cursor: "pointer" }}
            />
          </Box>

          <form onSubmit={saveUserDetails}>
            <Box mb={3}>
              <Grid container spacing={4}>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    name="name"
                    type="text"
                    label="Enter Name"
                    value={userDetails.name}
                    onChange={handleInputChange}
                    error={error}
                    helperText={error ? "field is required" : ""}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <PhoneInput
                    inputStyle={{
                      width: "100%",
                      height: "36px",
                      fontSize: "18px",
                      fontFamily: "Monospace",
                      border: "1px solid #AEB4BE", // Change border color here
                      backgroundColor: "rgba(0, 0, 0, 0)", // Change background color here
                      color: "#2B3445",
                    }}
                    dropdownStyle={{
                      // backgroundColor: 'black', // Set dropdown background color
                      color: "#2B3445", // Set dropdown text color
                    }}
                    country={"in"}
                    variant="outlined"
                    value={userDetails.phone}
                    onChange={handlePhoneChange}
                    placeholder="+91"
                    defaultErrorMessage={"field is required"}
                  />
                </Grid>

                <Grid item sm={12} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="email"
                    label="Enter email"
                    value={userDetails.email}
                    onChange={handleInputChange}
                    error={error}
                    helperText={error ? "field is required" : ""}
                  />
                </Grid>
              </Grid>
            </Box>

            <Button
              style={{ float: "right" }}
              color="primary"
              variant="contained"
              type="submit"
            >
              {isLoading ? (<CircularProgress color="inherit" size={25} />) :"Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Fragment> */}
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              fullWidth
              name="name"
              type="text"
              label="Enter Name"
              value={userDetails.name}
              onChange={handleInputChange}
              // error={errorMessage}
              // helperText={errorMessage ?? "field is required"}
              error={userDetails.name == "" && showValidation}
              helperText={
                userDetails.name == "" && showValidation ? (
                  <Typography variant="p">{"Name is required"}</Typography>
                ) : (
                  ""
                )
              }
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl
              fullWidth
              error={userDetails.phone == "" && showValidation}
              helperText={
                userDetails.phone == "" && showValidation ? (
                  <Typography variant="p">{"phone is required"}</Typography>
                ) : (
                  ""
                )
              }
            >
              <PhoneInput
                inputStyle={{
                  width: "100%",
                  height: "36px",
                  fontSize: "18px",
                  fontFamily: "Monospace",
                  border: "1px solid #AEB4BE", // Change border color here
                  backgroundColor: "rgba(0, 0, 0, 0)", // Change background color here
                  color: "#2B3445",
                }}
                dropdownStyle={{
                  // backgroundColor: 'black', // Set dropdown background color
                  color: "#2B3445", // Set dropdown text color
                }}
                country={"in"}
                variant="outlined"
                value={userDetails.phone}
                onChange={handlePhoneChange}
                placeholder="+91"
                // defaultErrorMessage={errorMessage ?? "field is required"}
              />
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              type="text"
              name="email"
              label="Enter email"
              value={userDetails.email}
              onChange={handleInputChange}
              // error={errorMessage}
              // helperText={errorMessage ?? "field is required"}
              error={userDetails.email == "" && showValidation}
              helperText={
                userDetails.email == "" && showValidation ? (
                  <Typography variant="p">{"email is required"}</Typography>
                ) : (
                  ""
                )
              }
            />
          </Grid>
        </Grid>
        <Typography
          variant="div"
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            sx={{ mt: 3, display: "flex", flexDirection: "end" }}
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => saveUserDetails()}
          >
            {isLoading ? (
              <CircularProgress color="inherit" size={25} />
            ) : (
              "Save"
            )}
          </Button>
        </Typography>
      </Box>
    </>
  );
};
export default AddUserDetails;
