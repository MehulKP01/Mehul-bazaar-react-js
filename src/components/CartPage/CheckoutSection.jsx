import Link from "next/link";
import {
  Button,
  Card,
  Divider,
  Grid,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";

const LocalOfferIcon = lazy(() => import("@mui/icons-material/LocalOffer"));

const DeleteOutlineIcon = lazy(() =>
  import("@mui/icons-material/DeleteOutline")
);

import React, { lazy } from "react";
import { currencyFormat } from "../../lib";
import { useSelector } from "react-redux";

const CheckoutSection = ({
  couponCode,
  setCouponCode,
  isRedeemed,
  setIsRedeemed,
  applyCouponCode,
  isCouponApplied,
  redeemPoint,
  couponApplied,
  SummaryRow,
  totalPrice,
  discountPrice,
  setRedeemPoint,
  applyRedeem,
  removeCouponCode,
  convertedAmount,
}) => {
  const currency = useSelector((state) => state?.shop?.currency);

  return (
    <Grid item md={4} xs={12}>
      <Card sx={{ padding: 3 }}>
        <Divider sx={{ mb: 2 }} />

        <TextField
          fullWidth
          size="small"
          label="Coupon Code"
          variant="outlined"
          placeholder="Coupon Code"
          name="couponCode"
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
          disabled={isRedeemed}
        />

        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => applyCouponCode(couponCode)}
          sx={{ mt: 2, mb: 4 }}
          disabled={isRedeemed}
        >
          Apply Coupon
        </Button>

        {isCouponApplied && (
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={removeCouponCode}
            sx={{ mb: 4 }}
          >
            Remove Coupon
          </Button>
        )}

        <Typography variant="body1">
          Redeem Your Points For a Discount
        </Typography>
        <Typography variant="body1">
          You Have <span style={{ color: "Highlight" }}>2000 points</span>{" "}
          available to use
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box display="flex" alignItems="center" sx={{ pb: 2 }}>
          <TextField
            size="small"
            label="Enter points to redeem..."
            variant="outlined"
            type="number"
            placeholder="Enter points to redeem..."
            name="points"
            value={redeemPoint}
            onChange={(e) => {
              const value = e.target.value;
              // Ensure that only digits are allowed and the value is less than or equal to 2000
              if (/^\d*$/.test(value) && Number(value) <= 2000) {
                setRedeemPoint(value);
              }
            }}
            sx={{ flex: 1, mr: 2 }}
            disabled={couponApplied}
          />
          {!isRedeemed ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => applyRedeem(redeemPoint)}
              sx={{ height: "40px" }}
              disabled={couponApplied || redeemPoint === "" || redeemPoint <= 0}
            >
              Redeem
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              onClick={() => setIsRedeemed(false)}
              sx={{ height: "40px" }}
            >
              Remove
            </Button>
          )}
        </Box>

        {redeemPoint > 0 && (
          <Typography variant="body2" sx={{ mb: 1 }}>
            {redeemPoint} points = {convertedAmount} ₹
          </Typography>
        )}

        <SummaryRow>
          <Typography color="text.secondary" fontWeight="700">
            SubTotal:
          </Typography>

          <Typography variant="body1" fontWeight="600">
            {currencyFormat(totalPrice, currency)}
          </Typography>
        </SummaryRow>

        {isRedeemed && (
          <SummaryRow>
            <Typography color="text.secondary" fontWeight="700">
              Point Discount:
            </Typography>

            <Typography variant="body1" fontWeight="600">
              - {currencyFormat(convertedAmount, currency)}
            </Typography>
          </SummaryRow>
        )}

        <SummaryRow>
          <Typography color="text.secondary" fontWeight="600">
            Discount: {discountPrice > 0 ? `(${coupon?.coupon?.code})` : ""}
          </Typography>
          <SummaryRow>
            <Typography
              variant="body1"
              sx={{ color: "green" }}
              fontWeight="500"
            >
              -{" "}
              {isRedeemed
                ? currencyFormat(totalPrice, currency)
                : currencyFormat(totalPrice, currency)}
            </Typography>
            {discountPrice > 0 && (
              <DeleteOutlineIcon
                sx={{ ml: 1, color: "red" }}
                onClick={removeCouponCode}
                fontSize="small"
              />
            )}
          </SummaryRow>
        </SummaryRow>

        <Divider sx={{ mb: 2 }} />

        <SummaryRow>
          <Typography color="text.secondary" fontWeight="700">
            Total:
          </Typography>
          <Typography variant="body1" fontWeight="700">
            {isRedeemed
              ? currencyFormat(totalPrice - convertedAmount, currency)
              : currencyFormat(totalPrice, currency)}
          </Typography>
        </SummaryRow>

        <Divider sx={{ mb: 2 }} />

        <Button
          fullWidth
          href="/checkout"
          variant="contained"
          LinkComponent={Link}
          sx={{
            color: "white",
            bgcolor: "#3399cc",
            "&:hover": {
              backgroundColor: "#3399cc",
            },
          }}
        >
          Checkout Now
        </Button>
      </Card>
    </Grid>
  );
};

export default CheckoutSection;
