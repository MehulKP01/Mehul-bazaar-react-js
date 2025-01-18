import React, { lazy } from "react";
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
const UserDashboardHeader = lazy(
  () => import("../../src/components/header/UserDashboardHeader.jsx"));

const EditNewAddress = (props) => {
  const {
    editnewaddressestogglebtn,
    HEADER_BACK_ADD_ADDRESSES_LINK,
    editaddressprofile,
    EditCheckboxChange,
    EditProfileAddressesHandleChange,
    handleEditPhoneChange,
    editCountry,
    EditAddressesHandleSubmit
  } = props;

  return (
    editnewaddressestogglebtn && (
      <Container>
        <Grid container>
          <Grid item xs={12} md={12}>
            <UserDashboardHeader
              icon={Person}
              title="Edit To Address"
              button={HEADER_BACK_ADD_ADDRESSES_LINK}
            />

            <Card1>
              <FormControl>
                <Box mb={4}>
                  <Grid container spacing={3}>
                    <Grid item md={12} xs={12}>
                      <Box>
                        <FormControlLabel
                          control={
                            <Radio
                              name="home"
                              checked={editaddressprofile?.type === "home"}
                              onChange={EditCheckboxChange}
                            />
                          }
                          label="Home"
                        />
                        <FormControlLabel
                          control={
                            <Radio
                              name="office"
                              checked={editaddressprofile?.type === "office"}
                              onChange={EditCheckboxChange}
                            />
                          }
                          label="Office"
                        />
                      </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder=" Address Name"
                        size="small"
                        label="Address Name"
                        type="text"
                        name="name"
                        inputlabelprops={{
                          shrink: true,
                        }}
                        value={editaddressprofile?.name}
                        onChange={EditProfileAddressesHandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <PhoneInput
                        inputStyle={{
                          width: "100%",
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
                        inputlabelprops={{
                          shrink: true,
                        }}
                        value={editaddressprofile?.phone}
                        onChange={handleEditPhoneChange}
                        placeholder="+91"
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="Address Line 1"
                        size="small"
                        label="Address Line 1"
                        type="text"
                        name="addressLine1"
                        inputlabelprops={{
                          shrink: true,
                        }}
                        value={editaddressprofile?.addressLine1}
                        onChange={EditProfileAddressesHandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="Address Line 2"
                        size="small"
                        label="Address Line 2"
                        inputlabelprops={{
                          shrink: true,
                        }}
                        type="text"
                        name="addressLine2"
                        value={editaddressprofile?.addressLine2}
                        onChange={EditProfileAddressesHandleChange}
                      />
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="City"
                        size="small"
                        label="City"
                        type="text"
                        inputlabelprops={{
                          shrink: true,
                        }}
                        name="city"
                        value={editaddressprofile?.city}
                        onChange={EditProfileAddressesHandleChange}
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        fullWidth
                        placeholder="State"
                        size="small"
                        label="State"
                        type="text"
                        name="state"
                        inputlabelprops={{
                          shrink: true,
                        }}
                        value={editaddressprofile?.state}
                        onChange={EditProfileAddressesHandleChange}
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
                          value={editaddressprofile?.country}
                          name="Country"
                          label="Country"
                          onChange={editCountry}
                          size="small"
                          inputlabelprops={{
                            shrink: true,
                          }}
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
                              <MenuItem value={item?.countryLabel} key={item?.country}>
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
                        placeholder="Zip Code"
                        label="Zip Code"
                        type="number"
                        name="zip"
                        inputlabelprops={{
                          shrink: true,
                        }}
                        value={editaddressprofile?.zip}
                        error={editaddressprofile?.zip?.length > 6}
                        helperText={
                          editaddressprofile?.zip?.length > 6
                            ? "ZIP code cannot exceed 6 characters"
                            : ""
                        }
                        onChange={EditProfileAddressesHandleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    "&:hover": {
                      backgroundColor: "#3399cc",
                    },
                  }}
                  onClick={() =>
                    EditAddressesHandleSubmit()
                  }
                >
                  Save Address
                </Button>
              </FormControl>
            </Card1>
          </Grid>
        </Grid>
      </Container>
    )
  );
};

export default EditNewAddress;
