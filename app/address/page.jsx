"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Place } from "@mui/icons-material";
import { IconButton, Pagination } from "@mui/material";
const TableRow = lazy(() => import("../../src/components/TableRow"));
import { Delete, Edit } from "@mui/icons-material";
import React, { lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
const CustomerDashboardLayout = lazy(() =>
  import("../../src/components/layouts/customer-dashboard")
);
import { Box, Button, Grid } from "@mui/material";
import { FlexBox } from "../../src/components/flex-box";
const UserDashboardHeader = lazy(() =>
  import("../../src/components/header/UserDashboardHeader")
);
const CustomerDashboardNavigation = lazy(() =>
  import("../../src/components/layouts/customer-dashboard/Navigations")
);
import { useEffect, useState } from "react";
import {
  getAddresses,
  getUserEditAddresses,
  addNewAddress,
  setEditAddress,
} from "../../src/redux/action.js";
import { api } from "../../src/utils/axiosInstance.js";
import { useTheme } from "@emotion/react";
import { useRouter } from "next/navigation.js";
import { displaySnackBar } from "../../src/common/snackBar.js";
const EditNewAddress = lazy(() => import("./EditNewAddress.jsx"));
const AddNewAddress = lazy(() => import("./AddNewAddress.jsx"));

const AddressList = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const EditAddressData = useSelector((state) => state?.user?.editaddress);
  const userData = useSelector((state) => state?.user);
  const addressAll = useSelector((state) => state?.user?.addresses);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const rowsPerPage = 4;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const totalPages = Math.ceil(total / rowsPerPage);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  if (userData?.isGuest) {
    router.push("/login");
    return null;
  }

  // toggle button true false
  const [userEditAddressestogglebtn, setUserEditAddressestogglebtn] =
    useState(true);
  const [newAddressesestogglebtn, setnewAddressesestogglebtn] = useState(false);
  const [editnewaddressestogglebtn, setEditNewAddressestogglebtn] =
    useState(false);
  const [editaddressprofile, setEditAddressProfile] = useState({
    address_id: EditAddressData?._id,
    name: EditAddressData.name,
    phone: EditAddressData.phone,
    addressLine1: EditAddressData.addressLine1,
    addressLine2: EditAddressData.addressLine2,
    city: EditAddressData.city,
    state: EditAddressData.state,
    landmark: EditAddressData.landmark,
    zip: EditAddressData.zip,
    country: EditAddressData.country,
    type: EditAddressData.type,
  });

  const [errors, setErrors] = useState({});
  const EditProfileAddressesHandleChange = (e) => {
    const { name, value } = e.target;
    let newZip = editaddressprofile.zip;

    if (name === "zip") {
      newZip = value.slice(0, 6);
    }

    setEditAddressProfile({
      ...editaddressprofile,
      [name]: value,
      zip: newZip,
    });
  };

  useEffect(() => {
    setEditAddressProfile({
      name: EditAddressData?.name,
      phone: EditAddressData?.phone,
      addressLine1: EditAddressData?.addressLine1,
      addressLine2: EditAddressData?.addressLine2,
      city: EditAddressData?.city,
      state: EditAddressData?.state,
      landmark: EditAddressData?.landmark,
      zip: EditAddressData?.zip,
      country: EditAddressData?.country,
      type: EditAddressData?.type,
    });
    async function fetchaddress() {
      const response = await dispatch(
        getAddresses({
          limit: rowsPerPage,
          page: currentPage - 1,
        })
      );
      try {
        const { count } = response;
        setTotal(count);
      } catch (error) {
        console.log(error);
      }
    }
    fetchaddress();
  }, [
    dispatch,
    currentPage,
    getUserEditAddresses,
    EditAddressData,
    setTotal,
    rowsPerPage,
  ]);

  const EditCheckboxChange = (event) => {
    if (event.target.checked) {
      setEditAddressProfile((prevState) => ({
        ...prevState,
        type: event.target.name,
      }));
    } else {
      setEditAddressProfile((prevState) => ({
        ...prevState,
        type: null,
      }));
    }
  };

  const editCountry = (e) => {
    const { value } = e.target;
    setEditAddressProfile((prevState) => ({
      ...prevState,
      country: value,
    }));
  };

  const handleEditPhoneChange = (value) => {
    setEditAddressProfile({
      ...editaddressprofile,
      phone: value,
    });
  };

  // HANDLE ADDRESS DELETE Start
  const handleAddressDelete = async (id) => {
    try {
      const { data } = await api.post("user/address/delete", {
        address_id: id,
      });

      if (data?.status) {
        displaySnackBar(data?.message, "success", "top", "right");
        dispatch(
          getAddresses({
            limit: rowsPerPage,
            page: currentPage - 1,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = (addresses) => {
    const errors = {};

    if (!addresses.name.trim()) errors.name = "Name is required";
    if (!addresses.phone) errors.phone = "Phone number is required";
    if (!addresses.address_line_1.trim())
      errors.address_line_1 = "Address Line 1 is required";
    if (!addresses.city.trim()) errors.city = "City is required";
    if (!addresses.state.trim()) errors.state = "State is required";
    if (!addresses.country) errors.country = "Country is required";
    if (!addresses.zip) errors.zip = "ZIP code is required";
    else if (addresses.zip.length !== 6)
      errors.zip = "ZIP code must be exactly 6 characters";

    return errors;
  };

  const newAddressesHandleSubmit = async (e, newAddresses, setNewAddresses) => {
    e.preventDefault();
    const validationErrors = validateForm(newAddresses);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((error) => {
        displaySnackBar(error, "error", "top", "right");
      });
      return;
    }
    if (newAddresses?.zip?.length !== 6) {
      displaySnackBar(
        "ZIP code must be exactly 6 characters",
        "error",
        "top",
        "right"
      );
      return;
    }
    try {
      const response = await dispatch(addNewAddress(newAddresses));
      if (response?.status) {
        displaySnackBar(response?.message, "success", "top", "right");

        setNewAddresses({
          name: "",
          phone: "",
          address_line_1: "",
          address_line_2: "",
          city: "",
          state: "",
          landmark: "",
          zip: "",
          country: "IN",
          type: "office",
        });

        setUserEditAddressestogglebtn(true);
        setnewAddressesestogglebtn(false);
        setEditNewAddressestogglebtn(false);
        dispatch(
          getAddresses({
            limit: rowsPerPage,
            page: currentPage - 1,
          })
        );
      } else {
        displaySnackBar(response?.message, "error", "top", "right");
      }
    } catch (error) {
      displaySnackBar(
        "An error occurred. Please try again later",
        "error",
        "top",
        "right"
      );
    }
  };
  const EditAddressesHandleSubmit = async () => {
    if (editaddressprofile?.zip?.length !== 6) {
      displaySnackBar(
        "ZIP code must be exactly 6 characters",
        "error",
        "top",
        "right"
      );
      return;
    }
    try {
      const editAddresses = {
        address_id: EditAddressData?._id,
        name: editaddressprofile?.name ?? "",
        phone: editaddressprofile?.phone,
        address_line_1: editaddressprofile?.addressLine1 ?? "",
        address_line_2: editaddressprofile?.addressLine2 ?? "",
        city: editaddressprofile?.city ?? "",
        state: editaddressprofile?.state ?? "",
        landmark: editaddressprofile?.landmark ?? "",
        zip: editaddressprofile?.zip,
        country: editaddressprofile?.country ?? "",
        type: editaddressprofile?.type ?? "",
      };
      const response = await dispatch(setEditAddress(editAddresses));
      if (response?.status) {
        displaySnackBar(response?.message, "success", "top", "right");
        setUserEditAddressestogglebtn(true);
        setnewAddressesestogglebtn(false);
        setEditNewAddressestogglebtn(false);
      } else {
        displaySnackBar(response?.error, "error", "top", "right");
      }
    } catch (error) {
      displaySnackBar(
        "An error occurred. Please try again later",
        "error",
        "top",
        "right"
      );
    }
  };
  const HEADER_BACK_ADD_ADDRESSES_LINK = (
    <Button
      color="primary"
      LinkComponent={Link}
      sx={{
        px: 4,
        color: "white",
        bgcolor: "#3399cc",
        "&:hover": {
          backgroundColor: "#3399cc",
        },
      }}
      onClick={() => {
        setEditNewAddressestogglebtn(false);
        setUserEditAddressestogglebtn(true);
        setnewAddressesestogglebtn(false);
      }}
    >
      Back to Addresses
    </Button>
  );
  //  Add New  Addresses  Logic Start
  const HEADER_ADD_ADDRESSES_LINK = (
    <Button
      color="primary"
      LinkComponent={Link}
      sx={{ px: 4, bgcolor: "primary.light" }}
      onClick={() => {
        setUserEditAddressestogglebtn(true);
        setnewAddressesestogglebtn(false);
      }}
    >
      Back to Address
    </Button>
  );
  const HEADER_BUTTON = (
    <Button
      color="primary"
      sx={{
        color: "white",
        bgcolor: "#3399cc",
        "&:hover": {
          backgroundColor: "#3399cc",
        },
        px: 4,
      }}
      onClick={() => {
        setnewAddressesestogglebtn(true);
        setUserEditAddressestogglebtn(false);
      }}
    >
      Add New Address
    </Button>
  );

  return (
    <CustomerDashboardLayout>
      {userEditAddressestogglebtn ? (
        <>
          {/* SideBar Addresses Start */}
          <Grid container spacing={3}>
            {/* TITLE HEADER AREA */}
            <Grid item xs={12} md={12} paddingLeft={2}>
              <UserDashboardHeader
                icon={Place}
                title="My Addresses"
                button={HEADER_BUTTON}
                navigation={<CustomerDashboardNavigation />}
              />

              {/* ALL ADDRESS LIST AREA */}
              <div style={{ overflowX: "auto" }}>
                {addressAll?.length > 0 ? (
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ maxWidth: isMobile ? "12%" : "10%" }}>
                          Sr. No
                        </TableCell>
                        <TableCell sx={{ maxWidth: "10%" }}>Type</TableCell>
                        <TableCell
                          sx={{
                            maxWidth: "50%",
                            textAlign: "center",
                          }}
                        >
                          Address
                        </TableCell>
                        <TableCell sx={{ maxWidth: isMobile ? "15%" : "15%" }}>
                          Phone Number
                        </TableCell>
                        <TableCell
                          sx={{
                            maxWidth: isMobile ? "15%" : "15%",
                            textAlign: "center",
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {addressAll?.map((address, index) => (
                        <TableRow
                          key={address._id}
                          sx={{ my: 2, padding: "6px 18px" }}
                        >
                          <TableCell
                            sx={{
                              textAlign: "center",
                              maxWidth: "5%",
                            }}
                          >
                            {startIndex + index + 1}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              maxWidth: "15%",
                            }}
                          >
                            {address?.type}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              maxWidth: "50%",
                            }}
                          >
                            {`   
                                                    ${address.name ?? ""} ,
                                                    ${
                                                      address.addressLine1 ?? ""
                                                    } 
                                                    ${
                                                      address.addressLine2 ?? ""
                                                    } 
                                                    ${address.landmark ?? ""},
                                                    ${address.city ?? ""} ,
                                                    ${address.state ?? ""}, 
                                                    ${address.zip ?? ""} , 
                                                    ${address.country ?? ""} `}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              maxWidth: "10%",
                            }}
                          >
                            {address.phone}
                          </TableCell>
                          <TableCell
                            sx={{
                              textAlign: "end",
                              maxWidth: "20%",
                            }}
                          >
                            <IconButton
                              onClick={() => {
                                dispatch(getUserEditAddresses(address?._id));
                                setEditNewAddressestogglebtn(true);
                                setUserEditAddressestogglebtn(false);
                                setnewAddressesestogglebtn(false);
                              }}
                            >
                              <Tooltip title="Edit" placement="top" arrow>
                                <Edit fontSize="small" color="inherit" />
                              </Tooltip>
                            </IconButton>
                            <IconButton
                              sx={{ marginRight: isMobile ? "-20%" : "" }}
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddressDelete(address?._id);
                              }}
                            >
                              <Tooltip title="Delete" placement="top" arrow>
                                <Delete fontSize="small" color="inherit" />
                              </Tooltip>
                            </IconButton>
                            {/* </div> */}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p>No Address Available..</p>
                  </Box>
                )}
              </div>

              {/* PAGINATION AREA */}
              {addressAll?.length > 0 && (
                <FlexBox justifyContent="center" mt={5}>
                  <Pagination
                    color="primary"
                    variant="outlined"
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, page) => handleChangePage(page)}
                    size={isMobile ? "small" : "medium"}
                  />
                </FlexBox>
              )}
            </Grid>
          </Grid>
        </>
      ) : null}
      {/* all addressList end */}

      <AddNewAddress
        newAddressesestogglebtn={newAddressesestogglebtn}
        HEADER_ADD_ADDRESSES_LINK={HEADER_ADD_ADDRESSES_LINK}
        newAddressesHandleSubmit={newAddressesHandleSubmit}
        isMobile={isMobile}
        setErrors={setErrors}
      />

      <EditNewAddress
        editnewaddressestogglebtn={editnewaddressestogglebtn}
        HEADER_BACK_ADD_ADDRESSES_LINK={HEADER_BACK_ADD_ADDRESSES_LINK}
        editaddressprofile={editaddressprofile}
        EditCheckboxChange={EditCheckboxChange}
        EditProfileAddressesHandleChange={EditProfileAddressesHandleChange}
        handleEditPhoneChange={handleEditPhoneChange}
        editCountry={editCountry}
        EditAddressesHandleSubmit={EditAddressesHandleSubmit}
      />
    </CustomerDashboardLayout>
  );
};

export default AddressList;
