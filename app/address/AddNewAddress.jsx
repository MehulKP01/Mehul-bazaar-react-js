import React, { lazy, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  Select,
} from "@mui/material";
import { Person } from "@mui/icons-material";
import { Box, Button, Grid, TextField } from "@mui/material";
const Card1 = lazy(() => import("../../src/components/Card1"));
import { Container } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import { countryList } from "../../src/common/countryList.js";
const UserDashboardHeader = lazy(() =>
  import("../../src/components/header/UserDashboardHeader.jsx")
);

const AddNewAddress = ({
  newAddressesestogglebtn,
  HEADER_ADD_ADDRESSES_LINK,
  newAddressesHandleSubmit,
  isMobile,
  setErrors,
}) => {
  const [newAddresses, setNewAddresses] = useState({
    name: "",
    phone: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    type: "office",
  });

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setNewAddresses((prevState) => ({
        ...prevState,
        type: event.target.name,
      }));
    } else {
      setNewAddresses((prevState) => ({
        ...prevState,
        type: null,
      }));
    }
  };

  const newAddresseseshandleChange = (e) => {
    const { name, value } = e.target;
    let newZip = newAddresses?.zip;

    if (name === "zip") {
      newZip = value.slice(0, 6);
    }
    setNewAddresses({ ...newAddresses, [name]: value, zip: newZip });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePhoneChange = (value) => {
    setNewAddresses({
      ...newAddresses,
      phone: value,
    });
  };

  const AddCountry = (e) => {
    const { value } = e.target;
    setNewAddresses((prevState) => ({
      ...prevState,
      country: value,
    }));
  };

  return (
    newAddressesestogglebtn && (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <UserDashboardHeader
              icon={Person}
              title="Add Address"
              button={HEADER_ADD_ADDRESSES_LINK}
            />
            <Card1>
              <FormControl>
                <Box mb={4}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <Box sx={{ display: "flex" }}>
                        <FormControlLabel
                          control={
                            <Radio
                              name="home"
                              checked={newAddresses?.type === "home"}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label="Home"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              name="office"
                              checked={newAddresses?.type === "office"}
                              onChange={handleCheckboxChange}
                            />
                          }
                          label="Office"
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        label="Name"
                        placeholder="Name"
                        type="text"
                        name="name"
                        value={newAddresses?.name}
                        onChange={newAddresseseshandleChange}
                        required={true}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <PhoneInput
                        inputStyle={{
                          width: isMobile ? "342px" : "396px",
                          height: "36px",
                          fontSize: "18px",
                          fontFamily: "Monospace",
                          border: "1px solid #AEB4BE",
                          backgroundColor: "rgba(0, 0, 0, 0)",
                        }}
                        dropdownStyle={{
                          color: "#AEB4BE",
                        }}
                        country={"in"}
                        variant="outlined"
                        value={newAddresses?.phone}
                        onChange={handlePhoneChange}
                        placeholder="+91"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="text"
                        name="email"
                        label="Email"
                        placeholder="Email"
                        value={newAddresses?.email}
                        onChange={newAddresseseshandleChange}
                        required
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="Address Line 1"
                        label="Address Line 1"
                        type="text"
                        name="address_line_1"
                        value={newAddresses?.address_line_1}
                        onChange={newAddresseseshandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="Address Line 2"
                        label="Address Line 2"
                        name="address_line_2"
                        value={newAddresses?.address_line_2}
                        onChange={newAddresseseshandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="City"
                        label="City"
                        type="text"
                        name="city"
                        value={newAddresses?.city}
                        onChange={newAddresseseshandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="State"
                        label="State"
                        type="text"
                        name="state"
                        value={newAddresses?.state}
                        onChange={newAddresseseshandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" size="small">
                          Country
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={newAddresses?.country}
                          name="country"
                          label="Country"
                          onChange={AddCountry}
                          size="small"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200,
                                width: 250,
                              },
                            },
                          }}
                        >
                          {countryList?.map((item) => {
                            <MenuItem value={""}>Select Type</MenuItem>;
                            return (
                              <MenuItem
                                value={item?.countryLabel}
                                key={item?.country}
                              >
                                {item?.countryLabel}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="Zip"
                        label=" Zip Code"
                        type="number"
                        name="zip"
                        value={newAddresses?.zip}
                        error={newAddresses?.zip?.length > 6}
                        helperText={
                          newAddresses?.zip?.length > 6
                            ? "ZIP code cannot exceed 6 characters"
                            : ""
                        }
                        onChange={newAddresseseshandleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Button
                  type="submit"
                  onClick={(e) =>
                    newAddressesHandleSubmit(e, newAddresses, setNewAddresses)
                  }
                  variant="contained"
                  color="primary"
                >
                  Add Address
                </Button>
              </FormControl>
            </Card1>
          </Grid>
        </Grid>
      </Container>
    )
  );
};

export default AddNewAddress;
