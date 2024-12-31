import React, { Fragment } from "react";
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
import { setEditAddress, getAddresses } from "../../../src/redux/action.js";
import { useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import { countryList } from "../../../src/common/countryList.js";
import ClearIcon from "@mui/icons-material/Clear";
import { FlexBetween } from "components/flex-box/index.js";
import { useFormik } from "formik";
import * as yup from "yup";
import dynamic from "next/dynamic.js";
import { displaySnackBar } from "common/snackBar.js";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone number is required"),
  state: yup.string().required("State is required"),
  zip: yup.string().required("Zip is required"),
  address_line_1: yup.string().required("Address Line 1 is required"),
  address_line_2: yup.string().required("Address Line 2 is required"),
});

const EditAddressForm = (props) => {
  const {
    selected,
    setAddressData,
    openEditForm,
    setOpenEditForm,
    usersDetails,
  } = props;

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      address_id: selected?.id,
      name: selected?.name,
      city: selected?.city,
      email: selected?.email,
      country: selected?.country,
      landmark: selected?.landmark,
      phone: selected?.phone,
      state: selected?.state,
      zip: selected?.zip,
      address_line_1: selected?.addressLine1,
      address_line_2: selected?.addressLine2,
      type: selected?.type,
    },
    validationSchema: validationSchema,
    validateOnMount: true, // Validate on form mount
    onSubmit: async (values) => {
      const editAddress = await dispatch(setEditAddress(values));
      try {
        if (editAddress?.status) {
          displaySnackBar(editAddress?.message, "success");
          setOpenEditForm(false);
          setAddressData(editAddress?.addresses);
          dispatch(getAddresses({}));
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const handleClose = () => {
    setOpenEditForm(false);
  };

  return (
    <Fragment>
      <Dialog open={openEditForm} onClose={handleClose}>
        <DialogContent>
          <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
            <FlexBetween>
              <Typography variant="h6" gutterBottom>
                Edit Address
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
                    label="Address Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email || Boolean(formik.errors.email)} // Always show error
                    helperText={formik.errors.email && "Email is required"} // Always show error message
                  />
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Address
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    name="address_line_1"
                    label="Address Line 1"
                    value={formik.values.address_line_1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address_line_1 &&
                      Boolean(formik.errors.address_line_1)
                    }
                    helperText={
                      formik.touched.address_line_1 &&
                      formik.errors.address_line_1
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    name="address_line_2"
                    label="Address Line 2"
                    value={formik.values.address_line_2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.address_line_2 &&
                      Boolean(formik.errors.address_line_2)
                    }
                    helperText={
                      formik.touched.address_line_2 &&
                      formik.errors.address_line_2
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    name="city"
                    label="City"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.city && Boolean(formik.errors.city)}
                    helperText={formik.touched.city && formik.errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="text"
                    name="state"
                    label="State"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.state && Boolean(formik.errors.state)}
                    helperText={formik.touched.state && formik.errors.state}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl
                    fullWidth
                    size="small"
                    error={
                      formik.touched.country || Boolean(formik.errors.country)
                    }
                  >
                    <InputLabel id="demo-select-small-label">
                      Country
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={formik.values.country}
                      label="Country"
                      onChange={(e) =>
                        formik.setFieldValue("country", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                    >
                      {countryList?.map((item, index) => (
                        <MenuItem key={index} value={item?.countryLabel}>
                          {item?.countryLabel}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.errors.country && (
                      <Typography color="error">Country is required</Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="zip"
                    label="Zip Code"
                    value={formik.values.zip}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.zip && Boolean(formik.errors.zip)}
                    helperText={formik.touched.zip && formik.errors.zip}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", mb: 1 }}>
                    <FormControlLabel
                      control={
                        <Radio
                          name="home"
                          checked={formik.values.type === "home"}
                          onChange={(e) =>
                            formik.setFieldValue("type", e.target.name)
                          }
                          onBlur={formik.handleBlur}
                        />
                      }
                      label="Home"
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          name="office"
                          checked={formik.values.type === "office"}
                          onChange={(e) =>
                            formik.setFieldValue("type", e.target.name)
                          }
                          onBlur={formik.handleBlur}
                        />
                      }
                      label="Office"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default EditAddressForm;
