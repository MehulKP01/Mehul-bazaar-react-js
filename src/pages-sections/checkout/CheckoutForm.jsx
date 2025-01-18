"use client";

import React, { lazy, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
const Card1 = lazy(() => import("components/Card1"));
import { useDispatch, useSelector } from "react-redux";
import { getAddresses, selectAddresses } from "../../../src/redux/action.js";
const EditAddressForm = lazy(() => import("./EditAddressForm"));
const NewAddressForm = lazy(() => import("./NewAddressForm.jsx"));
const DeleteAddress = lazy(() => import("./DeleteAddress.jsx"));
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
const CartMessage = lazy(() => import("../../../app/cart/CartMessages.jsx"));
import { displaySnackBar } from "common/snackBar.js";
import Image from "next/image.js";
import {
  setPaymentAddress,
  setUseProfile,
} from "../../../src/redux/reducers/user.reducer.js";
import { api } from "utils/axiosInstance.js";

const CheckoutForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.shop?.cart);
  const addressAll1 = useSelector((state) => state?.user?.addresses);
  const usersDetails = useSelector((state) => state?.user?.updateProfile);
  const paymentAddress = useSelector((state) => state?.user?.paymentAddress);

  const userData = useSelector((state) => state?.user);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [selected, setSelected] = useState();
  const [selectedId, setSelectedId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAddresses({}));
  }, [dispatch]);

  useEffect(() => {
    if (addressAll1 && addressAll1.length > 0 && !selectedId) {
      setSelectedId(addressAll1[0]._id);
      dispatch(selectAddresses(addressAll1[0]._id));
    }
  }, [addressAll1, selectedId, dispatch]);

  const selectedAddress = useMemo(() => {
    dispatch(setPaymentAddress(cart?.addressId));
    return cart?.addressId;
  }, [cart]);

  useEffect(() => {
    setIsLoading(false);
  }, [selectedAddress]);

  if (userData?.isGuest) {
    router.push("/login");
    return null;
  }

  const handleFormSubmit = async () => {
    if (
      usersDetails?.email === "" ||
      usersDetails?.name === "" ||
      usersDetails?.phone === ""
    ) {
      if (paymentAddress && paymentAddress?._id) {
        const formData = new FormData();
        formData.append("user_id", paymentAddress?.userId);
        formData.append("name", paymentAddress?.name);
        formData.append("email", paymentAddress?.email);

        const { data } = await api.post("user/profile/save", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (data?.status) {
          dispatch(setUseProfile(data?.user));
        }
      }

      if (selectedAddress) {
        router.push("/payment");
      } else {
        displaySnackBar("Select Your Address", "error", "bottom", "right");
      }
    } else {
      if (selectedAddress) {
        router.push("/payment");
      } else {
        displaySnackBar("Select Your Address", "error", "bottom", "right");
      }
    }
  };

  const editAddress = (add) => {
    setSelected(add);
    setOpenEditForm(true);
  };

  const ChooseAddress = (id) => {
    setIsLoading(true);
    setSelectedId(id);
    dispatch(selectAddresses(id));
  };

  const handleAddNewAddress = (newAddressData) => {
    const newAddressId = newAddressData._id;
    setSelectedId(newAddressId);
    dispatch(selectAddresses(newAddressId));
    dispatch(getAddresses({})); // Refresh the address list
  };

  return (
    <>
      {openEditForm && (
        <EditAddressForm
          selected={selected}
          openEditForm={openEditForm}
          setOpenEditForm={setOpenEditForm}
          usersDetails={usersDetails}
        />
      )}
      <Box sx={{ mb: 4 }}>
        <CartMessage />
        <Image
          width={813.33}
          height={203.66}
          alt="offer_banner"
          src="/assets/images/banners/offer-banner2.jpg"
          style={{ borderRadius: "10px" }}
        />
      </Box>

      <Card1 sx={{ mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h6">Address</Typography>
          <NewAddressForm onAddNewAddress={handleAddNewAddress} />
        </Box>

        {addressAll1 && addressAll1.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            You haven't added any addresses yet. Please add a new address.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {addressAll1?.map((address) => (
              <Grid
                item
                md={6}
                sx={{ width: { md: "50%", xs: "100%" } }}
                lg={6}
                key={address._id}
              >
                <Box
                  p={2}
                  minHeight={"10vh"}
                  sx={{
                    border:
                      selectedId === address._id
                        ? "2px solid #3399cc"
                        : "2px solid primary",
                    borderRadius: "2px",
                    boxShadow: 3,
                    cursor: "pointer",
                    position: "relative",
                    bgcolor: "#f6f9fc",
                  }}
                  onClick={() => ChooseAddress(address._id)}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ fontWeight: 700, textTransform: "capitalize" }}>
                      {address.type}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Tooltip title="Edit" placement="top" arrow>
                        <EditIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            editAddress(address);
                          }}
                          fontSize="small"
                          color="disabled"
                        />
                      </Tooltip>
                      <DeleteAddress addId={address._id} />
                    </Box>
                  </Typography>
                  <Box gap={4} position="relative">
                    {selectedId === address._id && isLoading && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#FFF",
                          zIndex: 5,
                        }}
                      >
                        <CircularProgress fontSize="small" />
                      </Box>
                    )}
                    <Typography
                      variant="subtitle1"
                      fontWeight="600"
                      sx={{ textTransform: "uppercase" }}
                    >
                      {address.name}
                    </Typography>
                    <Typography variant="body2">
                      {address.addressLine1}
                      {address.addressLine2 &&
                        `, ${address.addressLine2}`}, {address.city},
                    </Typography>
                    <Typography variant="body2">
                      {address.state}, {address.country} - {address.zip}
                    </Typography>
                    <Typography variant="body2">
                      Mobile: {address.phone}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Card1>
      <Grid container spacing={6}>
        <Grid item sm={6} xs={12}>
          <Button
            LinkComponent={Link}
            variant="outlined"
            color="primary"
            type="button"
            href="/cart"
            fullWidth
          >
            Back to Cart
          </Button>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            sx={{
              color: "white",
              bgcolor: "#3399cc",
              "&:hover": {
                backgroundColor: "#3399cc",
              },
            }}
            type="submit"
            fullWidth
            disabled={!selectedId || addressAll1?.length === 0}
          >
            Proceed to Payment
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CheckoutForm;
