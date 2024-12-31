import React, { Fragment, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Grid,
  FormControlLabel,
  Dialog,
  DialogContent,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  CircularProgress,
  Radio,
} from "@mui/material";
import { addNewAddress } from "../../../src/redux/action.js";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import { countryList } from "../../../src/common/countryList.js";
import { FlexBetween } from "components/flex-box/index.js";
import { useFormik } from "formik";
import * as yup from "yup";
import { displaySnackBar } from "common/snackBar.js";
import ClearIcon from "@mui/icons-material/Clear";


const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone number is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Pincode is required"),
  address_line_1: yup.string().required("Address Line 1 is required"),
});

const NewAddressForm = () => {
  const dispatch = useDispatch();
  const [addCardForm, setAddCardForm] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const usersDetails = useSelector((state) => state?.user?.userprofile);

  const formik = useFormik({
    initialValues: {
      name: usersDetails?.name || "",
      email: usersDetails?.email || "",
      city: "",
      country: "India",
      phone: usersDetails?.phone || "",
      state: "",
      zip: "",
      address_line_1: "",
      address_line_2: "",
      type: "home",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await dispatch(addNewAddress(values));
        if (response?.status) {
          displaySnackBar(response?.message || "Address added successfully","success","top",'right')
          setLoading(false);
          setAddCardForm(false);
          formik.resetForm();
        } else {
          throw new Error(response?.message || "Failed to add address");
        }
      } catch (error) {
        setLoading(false);
        displaySnackBar(error?.message || "An error occurred while adding the address","error","top",'right')
      }
    },
  });

  const handleClose = () => {
    setAddCardForm(false);
    formik.resetForm();
  };

  return (
    <Fragment>
      <Button
        color="primary"
        variant="outlined"
        sx={{
          p: "2px 20px",
        }}
        onClick={() => setAddCardForm(true)}
      >
        Add New Address
      </Button>
      <Dialog open={addCardForm} onClose={handleClose}>
        <DialogContent>
          <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
            <FlexBetween>
              <Typography variant="h6" gutterBottom>
                Add New Address
              </Typography>
              <ClearIcon
                color="primary"
                onClick={handleClose}
                sx={{ cursor: "pointer" }}
              />
            </FlexBetween>
            <form onSubmit={formik.handleSubmit}>
              <Typography variant="subtitle1" gutterBottom>
                Contact Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="name"
                    type="text"
                    label="Enter Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PhoneInput
                    inputStyle={{
                      width: "100%",
                      height: "36px",
                      fontSize: "18px",
                      fontFamily: "Monospace",
                      border: "1px solid #AEB4BE",
                      backgroundColor: "rgba(0, 0, 0, 0)",
                      color: "#2B3445",
                    }}
                    dropdownStyle={{
                      color: "#2B3445",
                    }}
                    country={"in"}
                    variant="outlined"
                    value={formik.values.phone}
                    onChange={(value) => formik.setFieldValue("phone", value)}
                    placeholder="+91"
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.phone && Boolean(formik.errors.phone) && (
                    <Typography color="error">{formik.errors.phone}</Typography>
                  )}
                </Grid>
                <Grid item xs={12} >
                  <TextField
                    fullWidth
                    type="text"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    variant="outlined"
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Address Details
              </Typography>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Radio
                          name="type"
                          value="home"
                          checked={formik.values.type === "home"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      }
                      label="Home"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          name="type"
                          value="office"
                          checked={formik.values.type === "office"}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      }
                      label="Office"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="address_line_1"
                    label="Address Line 1"
                    value={formik.values.address_line_1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.address_line_1 && Boolean(formik.errors.address_line_1)}
                    helperText={formik.touched.address_line_1 && formik.errors.address_line_1}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="address_line_2"
                    label="Address Line 2"
                    value={formik.values.address_line_2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="state"
                    label="State"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="city"
                    label="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                    variant="outlined"
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">Country</InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={formik.values.country}
                      label="Country"
                      onChange={(e) => formik.setFieldValue("country", e.target.value)}
                      onBlur={formik.handleBlur}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 250,
                          },
                        },
                      }}
                    >
                      {countryList?.map((item, index) => (
                        <MenuItem key={index} value={item?.countryLabel}>
                          {item?.countryLabel}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.country && Boolean(formik.errors.country) && (
                      <Typography color="error">{formik.errors.country}</Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="zip"
                    label="Enter Pincode"
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.zip && Boolean(formik.errors.zip)}
                    helperText={formik.touched.zip && formik.errors.zip}
                    variant="outlined"
                  />
                </Grid>
          
              </Grid>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ mt: 3, bgcolor: "#3399CC", "&:hover": { bgcolor: "#3399CC" } }}
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save address"}
              </Button>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default NewAddressForm;
