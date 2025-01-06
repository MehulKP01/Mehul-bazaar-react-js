"use client";

import {
  Button,
  Card,
  Grid,
  styled,
  useTheme,
  Box,
  Typography,
} from "@mui/material";
const SEO = dynamic(() => import("../../src/components/SEO"), { ssr: false });
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import {
  addProductIntoCart,
  applyCoupon,
  changeQuantityInCart,
  refreshCart,
  removeCoupon,
  removeProductFromCart,
} from "../../src/redux/action.js";
import { findProductSalePrice } from "lib";
import { useRouter } from "next/navigation.js";
const Carousel = dynamic(
  () => import("../../src/components/carousel/Carousel"),
  { ssr: false }
);
const CheckoutNavLayout = dynamic(
  () => import("../../src/components/layouts/CheckoutNavLayout"),
  { ssr: false }
);
const ProductCard7 = dynamic(
  () => import("../../src/components/product-cards/ProductCard7"),
  { ssr: false }
);
const CheckoutSection = dynamic(
  () => import("../../src/components/CartPage/CheckoutSection.jsx"),
  { ssr: false }
);
const CartMessage = dynamic(()=> import("./CartMessages.jsx"),{ssr : false})

import { currencyFormat } from "../../src/lib";
import { getMediaPath } from "../../src/lib.js";
import { api } from "../../src/utils/axiosInstance.js";
import dynamic from "next/dynamic.js";
import { displaySnackBar } from "../../src/common/snackBar.js";

const SummaryRow = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: theme.spacing(2),
}));

const Cart = () => {
  const theme = useTheme();
  const router = useRouter();
  const cart = useSelector((state) => state?.shop?.cart);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [redeemPoint, setRedeemPoint] = useState("");
  const currency = useSelector((state) => state?.shop?.currency);
  const userData = useSelector((state) => state?.user);
  const coupon = useSelector((state) => state?.shop?.applyCoupon.data);
  const dispatch = useDispatch();
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [isRedeemed, setIsRedeemed] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch]);

  if (userData?.isGuest) {
    router.push("/login");
    return null;
  }

  const handleRemoveProductFromCart = async (productItemId) => {
    const response = await dispatch(removeProductFromCart(productItemId));
    if (response?.status) {
      displaySnackBar(response?.message, "success", "bottom", "left");
    } else {
      displaySnackBar(response?.message, "error", "bottom", "left");
    }
  };

  const handleChangeQtyCart = async (productItemId, qty) => {
    const response = await dispatch(changeQuantityInCart(productItemId, qty));
    if (response?.status) {
      displaySnackBar(response?.message, "success", "bottom", "left");
    } else {
      displaySnackBar(response?.message, "error", "bottom", "left");
    }
  };

  const calculateTotal = () => {
    let total = 0;
    cart?.products?.map((x) => {
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
    if (cart?.couponId) {
      if (cart?.couponId?.minimumSpend > total) {
        setCouponMessage(
          `Your cart amount must be more then ${currencyFormat(
            cart?.couponId?.minimumSpend,
            currency
          )}!`
        );
        discount = 0;
      } else if (cart?.couponId?.maximumSpend < total) {
        setCouponMessage(
          `Your cart amount must be less then ${currencyFormat(
            cart?.couponId?.maximumSpend,
            currency
          )}!`
        );
        discount = 0;
      } else {
        if (cart?.couponId?.discountType == "percentage-discount") {
          discount = (total * cart?.couponId?.amount) / 100;
        } else if (cart?.couponId?.discountType == "fixed-cart") {
          discount = total - cart?.couponId?.amount;
        }
      }
      return discount;
    } else if (redeemPoint && isRedeemed) {
      return convertedAmount;
    } else {
      return 0;
    }
  };

  const subTotalPrice = useMemo(() => {
    return calculateTotal() - calculateDiscount();
  }, [cart]);

  const discountPrice = useMemo(() => {
    return calculateDiscount();
  }, [cart]);

  const applyCouponCode = async (code) => {
    if (!code.trim()) {
      displaySnackBar("Please enter a coupon code", "warning");
      return;
    }
    setCouponApplied(true);
    setIsRedeemed(false);
    setCouponMessage(null);
    setIsCouponApplied(true);

    try {
      const applyDiscount = await dispatch(applyCoupon(code));

      if (applyDiscount.status) {
        displaySnackBar(`Coupon "${code}" applied successfully`, "success");
        setCouponCode("");
      } else {
        displaySnackBar(
          applyDiscount?.message || "Failed to apply coupon",
          "error"
        );
      }
    } catch (error) {
      displaySnackBar("An error occurred while applying the coupon", "error");
    }
  };

  const applyRedeem = async (points) => {
    if (!points) {
      displaySnackBar("Please enter a Redeem points", "warning");
      return;
    } else {
      setIsRedeemed(true);
    }
    setIsRedeemed(true);
    setCouponApplied(false);
  };

  useEffect(() => {
    const conversionRate = 0.1;
    const amount = (redeemPoint * conversionRate).toFixed(2);
    setConvertedAmount(amount);
  }, [redeemPoint]);

  const removeCouponCode = async () => {
    try {
      const removeCouponCode = await dispatch(removeCoupon());

      if (removeCouponCode?.status) {
        displaySnackBar(removeCouponCode?.message, "success", "top", "right");
      }
    } catch (error) {
      displaySnackBar("Failed to remove coupon code", "error", "top", "right");
    }
    setCouponApplied(false);
    setIsCouponApplied(false);
  };

  const [recentViews, setRecentViews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchRecentViews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/user/recent-views");
      setRecentViews(response.data);
      setSnackbarOpen(true);
    } catch (error) {
      setError("Failed to fetch recent views");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentViews();
  }, []);

  const handleAddProductIntoCart1 = async (productId, selectedVariant) => {
    try {
      const response = await dispatch(
        addProductIntoCart(
          productId,
          selectedVariant ? selectedVariant?._id : null,
          1
        )
      );
      if (response?.status) {
        displaySnackBar(response?.message, "success");
      } else {
        displaySnackBar(response?.message, "warning", "bottom", "right");
      }
    } catch (error) {
      displaySnackBar(
        "Failed to add product to cart",
        "error",
        "bottom",
        "right"
      );
    }
  };

  return (
    <CheckoutNavLayout>
      <SEO title="Cart" />
      <CartMessage />
      <h1>{couponMessage}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          {cart?.products?.map((item) => (
            <ProductCard7
              key={item?._id}
              cartItem={item}
              onRemoveProduct={() => handleRemoveProductFromCart(item?._id)}
              onChangeQuantity={(qty) => handleChangeQtyCart(item?._id, qty)}
            />
          ))}

          {recentViews?.recentViews?.length > 0 && (
            <Grid item xs={12}>
              <h2>Recent View product</h2>
              <Carousel
                totalSlides={recentViews?.recentViews?.length}
                visibleSlides={4}
                sx={{
                  "& .css-17sbvug": { marginLeft: "10px" },
                  "& .css-17sbvug:first-of-type": { marginLeft: "0px" },
                }}
              >
                {recentViews?.recentViews?.map((product) => (
                  <Card
                    key={product._id}
                    sx={{ padding: 2, textAlign: "center" }}
                  >
                    <Box
                      component="img"
                      src={getMediaPath(product?.productId?.image?.url)}
                      alt={product.name}
                      sx={{
                        height: 130,
                        width: "90%",
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="h6" sx={{ mt: 1 }} noWrap>
                      {product?.productId?.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      <strike>
                        {currencyFormat(
                          product?.productId?.regularPrice,
                          currency
                        )}
                      </strike>
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {currencyFormat(product?.productId?.salePrice, currency)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2 }}
                      fullWidth
                      onClick={() =>
                        handleAddProductIntoCart1(
                          product?.productId?._id,
                          product?.productId?.variations[0]
                        )
                      }
                    >
                      Add to Cart
                    </Button>
                  </Card>
                ))}
              </Carousel>
            </Grid>
          )}
        </Grid>

        {/* CHECKOUT FORM */}
        <CheckoutSection
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          isRedeemed={isRedeemed}
          setIsRedeemed={setIsRedeemed}
          applyCouponCode={applyCouponCode}
          isCouponApplied={isCouponApplied}
          redeemPoint={redeemPoint}
          couponApplied={couponApplied}
          SummaryRow={SummaryRow}
          totalPrice={totalPrice}
          discountPrice={discountPrice}
          setRedeemPoint={setRedeemPoint}
          applyRedeem={applyRedeem}
          removeCouponCode={removeCouponCode}
          convertedAmount={convertedAmount}
        />
      </Grid>
    </CheckoutNavLayout>
  );
};

export default Cart;
