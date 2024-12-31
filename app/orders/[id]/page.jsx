"use client";

import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation.js";
import { format } from "date-fns";
import {
  Box,
  Button,
  Card,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  TextField,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TableRows from "../../../src/components/TableRow.jsx";
import Delivery from "../../../src/components/icons/Delivery.jsx";
import PackageBox from "../../../src/components/icons/PackageBox.jsx";
import TruckFilled from "../../../src/components/icons/TruckFilled.jsx";
import { H5, H6 } from "../../../src/components/Typography";
import { FlexBetween, FlexBox } from "../../../src/components/flex-box";
import CustomerDashboardLayout from "../../../src/components/layouts/customer-dashboard";
import useWindowSize from "../../../src/hooks/useWindowSize";
import { currencyFormat, getMediaPath } from "../../../src/lib.js";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "@mui/material/styles";
import Image from "../../../src/components/BazaarImage.jsx";
import Rating from "@mui/material/Rating";
import { api } from "../../../src/utils/axiosInstance.js";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { displaySnackBar } from "../../../src/common/snackBar.js";
import Refund from "../Refund.jsx";
import Skeleton from "@mui/material/Skeleton";

// styled components
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
// =============================================================

const OrderDetails = () => {
  const params = useParams();

  const router = useRouter();
  const product_Id = params?.id;
  const cart = useSelector((state) => state.shop.cart);
  const dispatch = useDispatch();
  const width = useWindowSize();
  const orderStatus = "Shipping";
  const orderStatusList = ["Packaging", "Shipping", "Delivering", "Complete"];
  const stepIconList = [PackageBox, TruckFilled, Delivery];
  const breakpoint = 350;
  const statusIndex = orderStatusList.indexOf(orderStatus);
  const [openReview, setOpenReview] = useState(false);
  const [switchForm, setSwitchForm] = useState("");
  const [selectProduct, setSelectedProduct] = useState();
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState();
  const [isActiveStep, setIsActiveStap] = useState();
  const [reviewId, setReviewId] = useState();
  const currency = useSelector((state) => state?.shop?.currency);
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getOrderData() {
      setIsLoading(true);
      const response = await getOrderDetailsById(params?.id);

      if (response) {
        setIsLoading(false);
        setOrder(response?.order);
      } else {
        setOrder([]);
      }
    }

    getOrderData();
  }, []);

  // SECTION TITLE HEADER
  const HEADER_BUTTON = (
    <Button
      color="primary"
      sx={{
        bgcolor: "primary.light",
        px: 4,
      }}
    >
      Order Again
    </Button>
  );

  const steps = [
    "Pending",
    "Processing",
    order?.returnOrder?.status === "cancel" ? "cancle" : "refunded",
  ];

  useEffect(() => {
    if (order?.returnOrder?.status === "pending") {
      setIsActiveStap(1);
    } else if (order?.returnOrder?.status === "processing") {
      setIsActiveStap(2);
    } else if (
      order?.returnOrder?.status === "cancel" ||
      order?.returnOrder?.status === "refunded"
    ) {
      setIsActiveStap(3);
    }
  }, [dispatch]);

  useEffect(() => {}, [switchForm]);

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  const selectedAddress = useMemo(() => {
    return cart?.addressId;
  }, [dispatch, cart]);

  useEffect(() => {
    const ReviewData = order?.items?.map((proId) => {
      return order?.review?.find(
        (review) => review.productId === proId?.productId?._id
      );
    });

    setReviewId(ReviewData);
  }, [dispatch, order]);

  const imageForReview = useCallback((variationId, productVariations) => {
    if (variationId) {
      const data = productVariations?.variations.find(
        (varId) => varId._id === variationId
      );
      return getMediaPath(data?.image?.url);
    } else {
      return getMediaPath(productVariations?.image?.url);
    }
  }, []);

  const totalPrice = order?.items
    ?.map((item) => item.total)
    .reduce((acc, curr) => acc + curr, 0);

  const writeReview = (product, value) => {
    setSelectedProduct(product);
    setSwitchForm(value);
    if (value == "edit") {
      setValueRating(reviewId?.rating);
      setComment(reviewId?.comment);
    }
    setOpenReview(true);
  };

  const closeReview = () => {
    setOpenReview(false);
  };

  const sumbitReview = async () => {
    const { data } = await api.post("order/submit-review", {
      order_id: order?._id,
      comment: comment,
      product_id: selectProduct.productId._id,
      rating: valueRating,
    });
    if (data.success) {
      displaySnackBar(data?.message, "success");
      setOpenReview(false);
      setComment(null);
      setValueRating(null);
    } else {
      displaySnackBar(data?.message, "error");
      setComment(null);
      setValueRating(null);
      setOpenReview(false);
    }
  };

  const EditReview = async () => {
    const { data } = await api.post("order/review/save", {
      order_id: reviewId?.orderId,
      comment: comment,
      product_id: reviewId?.productId,
      rating: valueRating,
      review_id: reviewId._id,
    });
    if (data.status) {
      displaySnackBar(data?.message, "success");
      setOpenReview(false);
    }
  };

  const isStepFailed = (step) => {
    setIsActiveStap(2);
    return step === 2;
  };

  const getVariationMedia = useCallback((variationId, productVariations) => {
    if (variationId) {
      const data = productVariations?.variations.find(
        (varId) => varId._id === variationId
      );
      return getMediaPath(data?.image?.url);
    } else {
      return getMediaPath(productVariations?.image?.url);
    }
  }, []);

  return (
    <>
      <BootstrapDialog
        onClose={closeReview}
        aria-labelledby="customized-dialog-title"
        open={openReview}
        fullWidth
      >
        <DialogTitle
          sx={{ m: 0, p: 2, textAlign: "center" }}
          id="customized-dialog-title"
        >
          Product Review
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeReview}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Image
                alt={selectProduct?.productId.name}
                sx={{
                  width: "80%",
                  height: "80%",
                  borderRadius: "5px",
                }}
                display="block"
                src={imageForReview(
                  selectProduct?.variationId,
                  selectProduct?.productId
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Typography variant="body2">{selectProduct?.name}</Typography>

              <Typography component="legend" sx={{ mt: 2 }}>
                Rate the product
              </Typography>
              <Rating
                name="simple-controlled"
                value={valueRating}
                size="large"
                onChange={(event, newValue) => {
                  setValueRating(newValue);
                }}
              />
              <TextField
                sx={{ my: 2 }}
                label="Write Comment"
                placeholder="Write Comment"
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
                value={comment}
                rows={3}
                fullWidth
                onChange={(e) => setComment(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          {switchForm == "add" ? (
            <Button
              color="primary"
              variant="outlined"
              sx={{
                p: "2px 20px",
                mb: 1,
              }}
              onClick={sumbitReview}
            >
              Submit Review
            </Button>
          ) : (
            <Button
              color="primary"
              variant="outlined"
              sx={{
                p: "2px 20px",
                mb: 1,
              }}
              onClick={EditReview}
            >
              Edit Review
            </Button>
          )}
        </DialogActions>
      </BootstrapDialog>

      <CustomerDashboardLayout>
        {isLoading ? (
          <>
            <Skeleton height={70} />
            <Skeleton animation="wave" height={70} />
            <Skeleton animation={false} height={70} />
            <Skeleton height={70} />
            <Skeleton animation="wave" height={70} />
          </>
        ) : (
          <Card
            sx={{
              p: 0,
              mb: "30px",
            }}
          >
            <TableRows
              sx={{
                p: "12px",
                borderRadius: 0,
                boxShadow: "none",
              }}
            >
              <FlexBox className="pre" m={0.75} alignItems="center">
                <Typography fontSize={14} color="grey.600" mr={0.5}>
                  Order ID:
                </Typography>

                <Typography fontSize={14}>{order?._id}</Typography>
              </FlexBox>

              <FlexBox className="pre" m={0.75} alignItems="center">
                <Typography fontSize={14} color="grey.600" mr={0.5}>
                  Placed on:
                </Typography>

                <Typography fontSize={14}>
                  {format(
                    new Date(order?.createdAt ?? "02/02/2024"),
                    "dd MMM, yyyy"
                  )}
                </Typography>
              </FlexBox>

              <FlexBox className="pre" m={0.75} alignItems="center">
                <Typography fontSize={14} color="grey.600" mr={0.5}>
                  Delivered on:
                </Typography>

                <Typography fontSize={14}>
                  {format(new Date(), "dd MMM, yyyy")}
                </Typography>
              </FlexBox>
              {order?.returnOrder?.status === "cancel" ||
              order?.returnOrder?.status === "refunded" ? null : (
                <FlexBox className="pre" m={0.75} alignItems="center">
                  <Box sx={{ alignItems: "flex-end" }}>
                    <Refund orderId={order} />
                  </Box>
                </FlexBox>
              )}
            </TableRows>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.200" }}>
                    <TableCell sx={{ textAlign: "center" }}>Image</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Name</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Price</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Quantity</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>Total</TableCell>
                    {order?.status == "completed" ? (
                      <TableCell sx={{ textAlign: "center" }}>Review</TableCell>
                    ) : null}
                  </TableRow>
                </TableHead>
                <TableBody sx={{}}>
                  {order?.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ textAlign: "center" }}>
                        <img
                          src={getVariationMedia(
                            item.variationId,
                            item?.productId
                          )}
                          alt={item.name}
                          width="50"
                          height="50"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: "center", width: "30%" }}>
                        {item?.name}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {currencyFormat(item?.amount, currency)}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {item?.quantity}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {currencyFormat(item?.total, currency)}
                      </TableCell>
                      {order.status == "completed" ? (
                        <>
                          <TableCell
                            sx={{
                              textAlign: "center",
                              display: "flex",
                              gap: 2,
                              mt: 2,
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip title="Write Review" placement="top" arrow>
                              <RateReviewIcon
                                fontSize="small"
                                onClick={() => writeReview(item, "add")}
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                          </TableCell>
                        </>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

        {order?.isrefunded && (
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} xs={12}>
              <Card
                sx={{
                  mb: "30px",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography
                    color={"primary"}
                    mt={1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                    }}
                  >
                    Refund Status
                  </Typography>
                  <Typography
                    color={"primary"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    Your Refund was issue early!
                  </Typography>
                  <Typography
                    color="grey.500"
                    variant="body2"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {`${currencyFormat(
                      order?.returnOrder?.amount,
                      currency
                    )} will be credited your account`}
                  </Typography>
                  <Stepper
                    fullWidth
                    sx={{ mb: 2 }}
                    activeStep={isActiveStep}
                    alternativeLabel
                  >
                    {steps?.map((label, index) => {
                      const labelProps = {};
                      if ((e) => isStepFailed(index)) {
                        labelProps.optional = (
                          <Typography variant="caption" color="error">
                            Refund request is cancel
                          </Typography>
                        );

                        labelProps.error = true;
                      }
                      return (
                        <Step key={label}>
                          {label != "cancle" ? (
                            <StepLabel>{label}</StepLabel>
                          ) : (
                            <StepLabel {...labelProps}>{label}</StepLabel>
                          )}
                        </Step>
                      );
                    })}
                  </Stepper>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography
                  color={"primary"}
                  sx={{
                    mt: 1,
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  Orders Notes
                </Typography>
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Refunded Date:
                  </Typography>

                  <Typography fontSize={14}>
                    {format(
                      new Date(
                        order?.returnOrder?.expectedDate ?? "02/02/2024"
                      ),
                      "dd MMM, yyyy"
                    )}
                  </Typography>
                </FlexBox>
                <FlexBox className="pre" ml={4} mb={2} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Order Note:
                  </Typography>

                  <Typography fontSize={14}>
                    {order?.returnOrder?.note}
                  </Typography>
                </FlexBox>
              </Card>
            </Grid>
            <Grid item lg={6} md={6} xs={12}>
              <Card
                sx={{
                  mb: "30px",
                }}
              >
                <Typography
                  color={"primary"}
                  sx={{ mt: 1.5, mb: 1, ml: 4, fontWeight: 600 }}
                >
                  General Details
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Order Status:
                  </Typography>

                  <Typography
                    color={
                      (order?.returnOrder?.status == "refunded" && "green") ||
                      (order?.returnOrder?.status == "cancel" && "red")
                    }
                    fontSize={14}
                  >
                    {order?.returnOrder?.status}
                  </Typography>
                </FlexBox>
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Order Date:
                  </Typography>

                  <Typography fontSize={14}>
                    {format(
                      new Date(order?.returnOrder?.createdA ?? "02/02/2024"),
                      "dd MMM, yyyy"
                    )}
                  </Typography>
                </FlexBox>
                <Divider sx={{ my: 0.5 }} />
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Customer:
                  </Typography>

                  <Typography fontSize={14}>{order?.name}</Typography>
                </FlexBox>
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Email:
                  </Typography>

                  <Typography fontSize={14}>{order?.email}</Typography>
                </FlexBox>
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Phone:
                  </Typography>

                  <Typography fontSize={14}>{order?.phone}</Typography>
                </FlexBox>
                <Divider sx={{ my: 0.5 }} />
                <FlexBox className="pre" ml={4} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Total:
                  </Typography>

                  <Typography fontSize={14}>
                    {currencyFormat(order?.returnOrder?.amount, currency)}
                  </Typography>
                </FlexBox>
                <FlexBox className="pre" ml={4} mb={2} alignItems="center">
                  <Typography fontSize={14} color="grey.600" mr={0.5}>
                    Refund:
                  </Typography>

                  <Typography fontSize={14}>
                    {currencyFormat(order?.returnOrder?.amount, currency)}
                  </Typography>
                </FlexBox>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* SHIPPING AND ORDER SUMMERY */}
        {isLoading == false && (
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} xs={12}>
              <Card
                sx={{
                  p: "20px 30px",
                }}
              >
                <H5 mt={0} mb={2}>
                  Billing Address
                </H5>
                <Typography
                  sx={{ fontWeight: 700, textTransform: "capitalize" }}
                >
                  {selectedAddress?.type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {selectedAddress?.name},{selectedAddress?.addressLine1},
                  {selectedAddress?.addressLine2 !== ""
                    ? selectedAddress?.addressLine2
                    : null}
                  ,{selectedAddress?.state},{selectedAddress?.zip},
                  {selectedAddress?.phone},
                </Typography>
              </Card>
            </Grid>

            <Grid item lg={6} md={6} xs={12}>
              <Card
                sx={{
                  p: "20px 30px",
                }}
              >
                <H5 mt={0} mb={2}>
                  Total Summary
                </H5>

                <FlexBetween mb={1}>
                  <Typography fontSize={14} color="grey.600">
                    Subtotal:
                  </Typography>

                  <H6 my="0px">{currencyFormat(totalPrice, currency)}</H6>
                </FlexBetween>

                <FlexBetween mb={1}>
                  <Typography fontSize={14} color="grey.600">
                    Discount:
                  </Typography>

                  <H6 my="0px">
                    {currencyFormat(order?.discountTotal, currency)}
                  </H6>
                </FlexBetween>

                <Divider
                  sx={{
                    mb: 1,
                  }}
                />

                <FlexBetween mb={2}>
                  <H6 my="0px">Total</H6>
                  <H6 my="0px">
                    {currencyFormat(order?.orderTotal, currency)}
                  </H6>
                </FlexBetween>
              </Card>
            </Grid>
          </Grid>
        )}
      </CustomerDashboardLayout>
    </>
  );
};

export default OrderDetails;

const getOrderDetailsById = async (id) => {
  try {
    const response = await api.get(`order/${id}`);

    const data = response?.data;
    if (data) {
      return {
        order: data?.order,
      };
    } else {
      return {};
    }
  } catch (e) {
    console.log(e);
    return {};
  }
};
