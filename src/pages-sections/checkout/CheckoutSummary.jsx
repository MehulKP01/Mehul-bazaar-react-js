"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Paper,
  InputAdornment
} from "@mui/material";
import { styled } from "@mui/material/styles";
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { currencyFormat, findProductSalePrice } from "lib";
import { applyCoupon, refreshCart, removeCoupon } from "../../../src/redux/action.js";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { displaySnackBar } from "common/snackBar.js";

const SummaryPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const SummaryRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const CheckoutSummary = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.shop?.cart);
  const currency = useSelector((state) => state?.shop?.currency);
  const coupon = useSelector((state) => state?.shop?.applyCoupon.data);
  const reedemPoints = useSelector((state) => state?.shop?.reedemPoints)
  const [couponCode, setCouponCode] = useState('');
  const [redeemPoint, setRedeemPoint] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isRedeemed, setIsRedeemed] = useState(false)
  
  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch]);


  const calculateTotal = useCallback(() => {
    return cart?.products?.reduce((total, item) => {
      const salePrice = findProductSalePrice(item);
      const addOnTotal = item?.addOnList?.reduce((sum, addOn) => sum + addOn.salePrice, 0);
      return total + (salePrice * item.quantity) + (addOnTotal * item.quantity);
    }, 0);
  }, [cart]);


  const applyRedeem = async (points) => {
    if (!points) {
      displaySnackBar("Please enter a Redeem points","warning")
      return;
    } else {
      setIsRedeemed(true)
    }
  };

  useEffect(() => {
    const conversionRate = 0.1;
    const amount = (redeemPoint * conversionRate).toFixed(2);
    setConvertedAmount(amount);
  }, [redeemPoint])



  const calculateDiscount = () => {
    const total = calculateTotal();
    if (cart.couponId) {
      const { minimumSpend, maximumSpend, discountType, amount } = cart.couponId;

      if (total < minimumSpend || total > maximumSpend) {
        return 0;
      }

      return discountType === "percentage-discount"
        ? total * (amount / 100)
        : amount;
    }
    else if (redeemPoint && isRedeemed) {
      return convertedAmount;
    } else {
      return 0
    }
  }

  const subTotalPrice = useMemo(() => calculateTotal(), [calculateTotal]);

  const discountPrice = useMemo(() => calculateDiscount(), [calculateDiscount]);
  const totalPrice = useMemo(() => subTotalPrice - discountPrice, [subTotalPrice, discountPrice]);

  const applyCouponCode = async () => {
    const result = await dispatch(applyCoupon(couponCode));
    displaySnackBar(result?.message,result?.status ? "success" : "error")
  };
  const removeCouponCode = async () => {
    try {
      const removeCouponCode = await dispatch(removeCoupon());
      setCouponCode('')
      if (removeCouponCode?.status) {
        displaySnackBar(removeCouponCode?.message,"success","top","right")
      }
    } catch (error) {
      console.error("Error removing coupon code:", error);
      displaySnackBar("Failed to remove coupon code", "error","top","right")
    }
  };
  return (
    <SummaryPaper elevation={3}>
      <Divider sx={{ mb: 2 }} />
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Coupon Code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocalOfferIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={applyCouponCode}
        disabled={!couponCode}
      >
        Apply Coupon
      </Button>

      <Divider sx={{ mb: 2 }} />
      <Divider sx={{ mb: 2 }} />
      <Typography variant="subtitle1" gutterBottom>
        Order Summary
      </Typography>


      {reedemPoints > 0 && (
        <>
          <Typography variant="body1">
            Redeem Your Points For a Discount
          </Typography>
          <Typography variant="body1" sx={{ pb: 2 }}>
            You Have <span style={{ color: "Highlight" }}>{reedemPoints} points</span> available to use
          </Typography>

          <Box display="flex" alignItems="center" sx={{ pb: 2 }}>
            <TextField
              size="small"
              label="Enter points to redeem..."
              variant="outlined"
              type="number"
              placeholder="Enter points to redeem..."
              name="points"
              value={redeemPoint}
              onChange={(e) => setRedeemPoint(e.target.value)}
              sx={{ flex: 1, mr: 2 }}
            />
            {!isRedeemed ? <Button
              variant="contained"
              color="primary"
              onClick={() => applyRedeem(redeemPoint)}
              sx={{ height: '40px' }}
            >
              Redeem
            </Button> : <Button
              variant="contained"
              color="error"
              onClick={() => setIsRedeemed(false)}
              sx={{ height: '40px' }}
            >
              Remove
            </Button>}
          </Box>
        </>
      )}

      {redeemPoint > 0 && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {redeemPoint} points = {convertedAmount} ₹
        </Typography>
      )}


      <SummaryRow>
        <Typography color="text.secondary" fontWeight="700">Subtotal:</Typography>
        <Typography variant="body1" fontWeight="600">
          {currencyFormat(subTotalPrice, currency)}
        </Typography>
      </SummaryRow>

      {isRedeemed && <SummaryRow>
        <Typography color="text.secondary" fontWeight="700">Point Discount:</Typography>
        <Typography variant="body1" fontWeight="600">
          - {currencyFormat(convertedAmount, currency)}
        </Typography>
      </SummaryRow>}

      {cart?.couponId && <SummaryRow alignItems="center">
        <Typography color="text.secondary" fontWeight="600">
          Discount: {discountPrice > 0 ? `(${coupon?.coupon?.code})` : ""}
        </Typography>
        <SummaryRow>
          <Typography variant="body1" sx={{ color: "green" }} fontWeight="500" >
            - {currencyFormat(discountPrice, currency)} {discountPrice > 0 && (<DeleteOutlineIcon sx={{ ml: 1, color: "red", cursor: "pointer" }}
              onClick={removeCouponCode}
              fontSize="small"
            />
            )}
          </Typography>
        </SummaryRow>
      </SummaryRow>}
      <Divider sx={{ my: 2 }} />
      <SummaryRow>
        <Typography color="text.secondary" fontWeight="700">Total:</Typography>
        <Typography variant="body1" fontWeight="700">
          {currencyFormat(totalPrice, currency)}
        </Typography>
      </SummaryRow>

      <Divider sx={{ my: 2 }} />


    </SummaryPaper>
  );
};

export default CheckoutSummary;
