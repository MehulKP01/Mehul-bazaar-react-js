import { Divider, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import Card1 from "components/Card1";
import { FlexBetween } from "components/flex-box";
import { currencyFormat } from "lib";
import { refreshCart, removeCoupon } from "../../../src/redux/action.js";
import { findProductSalePrice } from "lib";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { displaySnackBar } from "common/snackBar.js";

const PaymentSummary = () => {
  const cart = useSelector((state) => state.shop.cart);
  const currency = useSelector((state) => state?.shop?.currency);
  const [couponMessage, setCouponMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch]);

  const salePrice = useCallback(
    (cartItem) => {
      return findProductSalePrice(cartItem);
    },
    [cart]
  );

  const calculateTotal = () => {
    var total = 0;
    cart.products.map((x) => {
      const salePrice = findProductSalePrice(x);
      const addOnTotal = x?.addOnList?.reduce(
        (sum, itm) => sum + itm?.salePrice,
        0
      );
      total += salePrice * x.quantity + addOnTotal * x.quantity;
    });

    return total;
  };

  const totalPrice = useMemo(() => {
    return calculateTotal();
  }, [cart]);

  const calculateDiscount = () => {
    const total = calculateTotal();
    let discount = 0;
    if (cart.couponId) {
      if (cart.couponId.minimumSpend > total) {
        setCouponMessage(
          `Your cart amount must be more then ${currencyFormat(
            cart?.couponId?.minimumSpend,
            currency
          )}!`
        );
        discount = 0;
      } else if (cart.couponId.maximumSpend < total) {
        setCouponMessage(
          `Your cart amount must be less then ${currencyFormat(
            cart?.couponId?.minimumSpend,
            currency
          )}!`
        );
        discount = 0;
      } else {
        if (cart.couponId.discountType == "percentage-discount") {
          discount = (total * cart.couponId.amount) / 100;
        } else if (cart.couponId.discountType == "fixed-cart") {
          discount = total - cart.couponId.amount;
        }
      }

      return discount;
    } else {
      return (discount = null);
    }
  };

  const subTotalPrice = useMemo(() => {
    return calculateTotal() - calculateDiscount();
  }, [cart]);
  const discountPrice = useMemo(() => {
    return calculateDiscount();
  }, [cart]);

  const removeCouponCode = async () => {
    try {
      const removeCouponCode = await dispatch(removeCoupon());

      if (removeCouponCode?.status) {
        displaySnackBar(removeCouponCode?.message, "success", "top", "right");
      }
    } catch (error) {
      displaySnackBar("Failed to remove coupon code", "error", "top", "right");
    }
  };
  return (
    <Card1>
      <FlexBetween mb={2}>
        <Typography color="text.secondary" fontWeight="700">
          Subtotal:
        </Typography>
        <Typography variant="body1" fontWeight="700">
          {currencyFormat(subTotalPrice, currency)}
        </Typography>
      </FlexBetween>

      <FlexBetween mb={2}>
        <Typography color="text.secondary" fontWeight="600">
          Discount:
        </Typography>
        <Typography variant="body1" sx={{ color: "green" }} fontWeight="500">
          - {currencyFormat(discountPrice, currency)}
          {discountPrice > 0 ? (
            <DeleteOutlineIcon
              sx={{ ml: 1, color: "red" }}
              onClick={(e) => removeCouponCode()}
              fontSize="small"
            />
          ) : (
            ""
          )}
        </Typography>
      </FlexBetween>

      <Divider
        sx={{
          mb: 2,
        }}
      />

      <FlexBetween mb={1}>
        <Typography color="text.secondary" fontWeight="700">
          Total:
        </Typography>
        <Typography variant="body1" fontWeight="700">
          {currencyFormat(totalPrice, currency)}
        </Typography>
      </FlexBetween>
    </Card1>
  );
};
export default PaymentSummary;
