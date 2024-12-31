// /* eslint-disable react-hooks/exhaustive-deps */
// import { DeleteOutline, ModeEditOutline } from "@mui/icons-material";
// import {
//   Avatar,
//   Box,
//   Button,
//   Grid,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Alert,
// } from "@mui/material";

// import FormControlLabel from "@mui/material/FormControlLabel";
// import IconButton from "@mui/material/IconButton";
// import TextField from "@mui/material/TextField";
// import Card1 from "components/Card1";
// import { FlexBetween, FlexBox } from "components/flex-box";
// import { useRouter } from "next/navigation";
// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectAddresses,
//   applyCoupon,
//   getAddresses,
// } from "../../../src/redux/action.js";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Tooltip from "@mui/material/Tooltip";
// import CircularProgress from "@mui/material/CircularProgress";
// import * as yup from "yup";
// import DeleteAddress from "./DeleteAddress";
// import EditAddressForm from "./EditAddressForm";
// import NewAddressForm from "./NewAddressForm";
// import { useSnackbar } from "notistack";
// import AddUserDetails from "./AddUserDetails.jsx";
// import { isEmpty } from "lodash";

// // ====================================================================
// // date types

// // ====================================================================

// const Heading = ({ number, title }) => {
//   return (
//     <FlexBox gap={1.5} alignItems="center" mb={3.5}>
//       <Avatar
//         sx={{
//           width: 32,
//           height: 32,
//           color: "primary.text",
//           backgroundColor: "primary.main",
//         }}
//       >
//         {number}
//       </Avatar>
//       <Typography fontSize="20px">{title}</Typography>
//     </FlexBox>
//   );
// };
// const CheckoutForm2 = () => {

//   const router = useRouter();
//   const { enqueueSnackbar } = useSnackbar();
//   const dispatch = useDispatch();
//   const cart = useSelector((state) => state?.shop?.cart);
//   const addressAll1 = useSelector((state) => state?.user?.addresses);
//   const userData = useSelector((state) => state?.user);
//   const userDetails = useSelector((state) => state?.shop?.userDetails);

//   const [openEditForm, setOpenEditForm] = useState(false);
//   const [selected, setSelected] = useState();
//   const [selectedId, setSelectedId] = useState();
//   const [isLoading, setIsLoading] = useState(false);


//   const [hasVoucher, setHasVoucher] = useState(false);
//   const [couponId, setCouponId] = useState(); //

//   const toggleHasVoucher = () => setHasVoucher((has) => !has);

//   useEffect(() => {
//     if (addressAll1 && addressAll1.length > 0 && !selectedId) {
//       setSelectedId(addressAll1[0]._id);
//       dispatch(selectAddresses(addressAll1[0]._id));
//     }
//   }, [addressAll1, selectedId, dispatch]);

//   const selectedAddress = useMemo(() => {
//     return cart.addressId;
//   }, [cart]);

//   useEffect(() => {
//     setIsLoading(false);
//   }, [selectedAddress]);

//   if (userData?.isGuest) {
//     router.push("/login");
//     return null;
//   }

//   const handleFormSubmit = async (values) => {
//     if (selectedAddress && !isEmpty(userDetails)) {
//       router.push("/payment");
//     } else {
//       enqueueSnackbar("Select Your Address", {
//         variant: "error",
//         anchorOrigin: {
//           vertical: "bottom",
//           horizontal: "right",
//         },
//       });
//     }
//   };

//   const editAddress = (add) => {
//     setSelected(add);

//     setOpenEditForm(true);
//   };

//   const applyCouponCode = async (code) => {
//     const applyDiscount = await dispatch(applyCoupon(code));
//     if (applyDiscount.status) {
//       enqueueSnackbar(applyDiscount.message, {
//         variant: "success",
//       });
//     } else {
//       enqueueSnackbar(applyDiscount.message, {
//         variant: "error",
//       });
//     }
//   };
//   const ChooseAddress = (id) => {
//     setIsLoading(true);
//     setSelectedId(id);
//     dispatch(selectAddresses(id));
//   };
//   const handleAddNewAddress = (newAddressData) => {
//     const newAddressId = newAddressData._id;
//     setSelectedId(newAddressId);
//     dispatch(selectAddresses(newAddressId));
//     dispatch(getAddresses({})); // Refresh the address list
//   };

//   return (
//     <>
//       {openEditForm && (
//         <EditAddressForm
//           selected={selected}
//           // addressData={address}
//           openEditForm={openEditForm}
//           setOpenEditForm={setOpenEditForm}
//         // setAddressData={setAddressData}
//         />
//       )}
//       <Card1 sx={{ mb: 4 }}>
//         <Typography variant="body1" fontWeight="600" mb={3}>
//           Add User Details
//         </Typography>
//         <AddUserDetails />
//       </Card1>
//       <Card1 sx={{ mb: 4 }}>
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
//           <Typography variant="h6">Address</Typography>
//           <NewAddressForm onAddNewAddress={handleAddNewAddress} />
//         </Box>

//         {addressAll1 && addressAll1.length === 0 ? (
//           <Alert severity="info" sx={{ mb: 2 }}>
//             You haven't added any addresses yet. Please add a new address.
//           </Alert>
//         ) : (
//           <Grid container spacing={2}>
//             {addressAll1?.map((address) => (
//               <Grid item md={6} sx={{ width: { md: "50%", xs: "100%" } }} lg={6} key={address._id}>
//                 <Box
//                   p={2}
//                   minHeight={"10vh"}
//                   sx={{
//                     border: selectedId === address._id ? "2px solid #3399cc" : "2px solid primary",
//                     borderRadius: "2px",
//                     boxShadow: 3,
//                     cursor: "pointer",
//                     position: "relative",
//                   }}
//                   onClick={() => ChooseAddress(address._id)}
//                 >
//                   <Typography sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//                     <Box sx={{ fontWeight: 700, textTransform: "capitalize" }}>{address.type}</Box>
//                     <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
//                       <Tooltip title="Edit" placement="top" arrow>
//                         <EditIcon
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             editAddress(address);
//                           }}
//                           fontSize="small"
//                           color="disabled"
//                         />
//                       </Tooltip>
//                       <DeleteAddress addId={address._id} />
//                     </Box>
//                   </Typography>
//                   <Box gap={4} position="relative">
//                     {selectedId === address._id && isLoading && (
//                       <Box
//                         sx={{
//                           position: "absolute",
//                           top: 0,
//                           left: 0,
//                           width: "100%",
//                           height: "100%",
//                           display: "flex",
//                           justifyContent: "center",
//                           alignItems: "center",
//                           backgroundColor: "rgba(255, 255, 255, 0.8)",
//                           zIndex: 5,
//                         }}
//                       >
//                         <CircularProgress fontSize="small" />
//                       </Box>
//                     )}
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       {address.name}, {address.addressLine1},
//                       {address.addressLine2 !== "" ? address.addressLine2 : null}
//                       {address.city}, {address.state}, {address.country},
//                       {address.zip}, {address.phone}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Card1>
//       <Card1
//         sx={{
//           mb: 3,
//         }}
//       >
//         <Button
//           sx={{
//             color: "primary.main",
//             mt: 3,
//             lineHeight: 1,
//           }}
//           onClick={toggleHasVoucher}
//         >
//           I have a Coupon
//         </Button>

//         {hasVoucher ? (
//           <FlexBox mt={3} gap={2} maxWidth="400px">
//             <TextField
//               fullWidth
//               name="voucher"
//               value={couponId}
//               onChange={(e) => setCouponId(e.target.value)}
//               placeholder="Enter coupon code here"
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               type="button"
//               onClick={() => applyCouponCode(couponId)}
//             >
//               Apply
//             </Button>
//           </FlexBox>
//         ) : (
//           <></>
//         )}

//         <Button
//           fullWidth
//           type="submit"
//           variant="contained"
//           sx={{
//             mt: 3,
//             color: "white",
//             bgcolor: "#3399cc",
//             "&:hover": {
//               backgroundColor: "#3399cc",
//             },
//           }}
//           onClick={() => handleFormSubmit()}
//         >
//           Proceed To Payment
//         </Button>
//       </Card1>
//     </>
//   );
// };
// const addressList2 = [
//   {
//     name: "Home",
//     phone: "+17804084466",
//     street2: "435 Bristol, MA 2351",
//     street1: "375 Subidbazaar, MA 2351",
//   },
//   {
//     name: "Office",
//     phone: "+18334271710",
//     street2: "968 Brockton, MA 2351",
//     street1: "645 Bondorbazaar, MA 2351",
//   },
//   {
//     name: "Office 2",
//     phone: "+17754739407",
//     street2: "777 Kazi, MA 2351",
//     street1: "324 Ambarkhana, MA 2351",
//   },
// ];
// export default CheckoutForm2;
