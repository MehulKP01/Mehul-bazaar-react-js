import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card1 from "components/Card1";
import useWindowSize from "hooks/useWindowSize";
import { useDispatch, useSelector } from "react-redux";
import {
  placedOrder,
  removeCoupon,
  verifyPayment,
} from "../../../src/redux/action.js";
import Image from "next/image.js";
import RazorPayLogo from "../../../public/assets/images/payment-methods/razorpay.png";
import StripeLogo from "../../../public/assets/images/payment-methods/Stripe.png";
import PayPalLogo from "../../../public/assets/images/payment-methods/paypal.png";
import { api } from "utils/axiosInstance.js";
import { displaySnackBar } from "common/snackBar.js";

const PaymentForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const usersDetails = useSelector((state) => state?.user?.updateProfile);

  const currency = useSelector((state) => state?.shop?.currency);

  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const width = useWindowSize();
  const router = useRouter();
  const isMobile = width < 769;
  const [paymentGatewayData, setPaymentGatewayData] = useState(() => {
    if (currency.currency === "INR") {
      return [
        {
          name: "RazorPay",
          value: "razorpay",
          logo: RazorPayLogo,
        },
      ];
    } else {
      return [
        {
          name: "Stripe",
          value: "stripe",
          logo: StripeLogo,
        },
        {
          name: "PayPal",
          value: "paypal",
          logo: PayPalLogo,
        },
      ];
    }
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  useEffect(() => {
    setPaymentGatewayData(() => {
      if (currency.currency === "INR") {
        return [
          {
            name: "RazorPay",
            value: "razorpay",
            logo: RazorPayLogo,
          },
        ];
      } else {
        return [
          {
            name: "Stripe",
            value: "stripe",
            logo: StripeLogo,
          },
          {
            name: "PayPal",
            value: "paypal",
            logo: PayPalLogo,
          },
        ];
      }
    });
  }, [currency]);
  async function fetchPaymentData() {
    setIsLoading(true);
    try {
      const { data } = await api.get("admin/app");
      if (data && data.status) {
        const { paymentGateway } = data?.app;

        const enabledMethods = Object.keys(paymentGateway)
          .filter((key) => paymentGateway[key].enable)
          .map((key) => {
            // Find the corresponding method in the initial state
            return paymentGatewayData.find((method) => method?.value === key);
          })
          .filter(Boolean); // Remove undefined values
        setPaymentGatewayData(enabledMethods);
        setPaymentMethod(enabledMethods[0]?.value);
      } else {
        displaySnackBar("Something went Wrong", "error", "top", "right");
      }
    } catch (error) {
      displaySnackBar("Something went Wrong", "error", "top", "right");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFormSubmit = async (values) => {
    router.push("/payment");
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
  };

  const placeOrder = async () => {
    let orderData = {
      ...usersDetails,
      gst: "gst",
      note: "nice",
      isGift: false,
      currency: currency?.currency,
      gateway: paymentMethod,
    };

    try {
      const orderDetails = await dispatch(placedOrder(orderData));

      if (orderDetails?.status) {
        if (paymentMethod === "razorpay") {
          displayRazorpay(orderDetails.result, orderDetails.razorpay_key);
        } else if (paymentMethod === "stripe") {
          makeStripePayment(
            orderDetails?.result?.url,
            "pk_test_51L1E9YSFDFHp5bEhFLrxuBRiZ0ifZQE5Nle0k1szQOzv3H3fOG0UXU2QsxbBzvGJYBDqsFN73f0P58hWVpFJYddC00qtpMYQRs"
          );
        } else if (paymentMethod === "paypal") {
          makePaypalPayment(orderDetails.approval_url);
        } else {
          displaySnackBar(
            "Please choose a payment method",
            "error",
            "top",
            "right"
          );
        }
      } else {
        displaySnackBar(
          orderDetails?.message || "Something went wrong",
          "error",
          "top",
          "right"
        );
      }
    } catch (error) {
      displaySnackBar(
        orderDetails?.message ||
          error?.message ||
          "An error occurred while placing the order.",
        "error",
        "top",
        "right"
      );
    }
  };

  const razorpayVerification = async (
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  ) => {
    try {
      const data = await verifyPayment({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      if (data.status) {
        router.push("/paymentstatus/success");
        dispatch(removeCoupon());
      } else {
        router.push("/paymentstatus/fail");
        displaySnackBar(data?.message, "error", "top", "right");
      }
    } catch (error) {
      router.push("/paymentstatus/failed");
      displaySnackBar(data?.message, "error", "top", "right");
    }
  };

  const makePaypalPayment = async (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  const makeStripePayment = async (link) => {
    if (link) {
      window.location.href = link;
    }
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onError = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(order, razoypayKey) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      return;
    }
    const options = {
      key: razoypayKey,
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      description: "Order #" + order.receipt,
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

      prefill: {
        name: usersDetails?.name ?? "",
        email: usersDetails?.email ?? "",
        contact: usersDetails?.phone ?? "",
      },

      handler: function (response) {
        razorpayVerification(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
      },

      modal: {
        ondismiss: function () {
          renderGoogleOptInSurvey();
        },
      },

      theme: {
        color: "#3399cc",
      },
    };

    var razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      router.push("/paymentstatus/fail");
    });

    razorpay.open();
  }

  const renderGoogleOptInSurvey = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/platform.js?onload=renderOptIn";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    window.renderOptIn = function () {
      window.gapi.load("surveyoptin", function () {
        window.gapi.surveyoptin.render({
          // REQUIRED FIELDS
          merchant_id: 5404243108, // Replace with your actual merchant ID
          order_id: "123456", // Replace with actual order ID if available
          email: "tusharpanchal0761@gmail.com", // Replace with actual customer email if available
          delivery_country: "IN", // Replace with actual delivery country if available
          estimated_delivery_date: "2024-07-25", // Replace with actual delivery date if available
        });
      });
    };
  };

  return (
    <Fragment>
      <Card1
        sx={{
          mb: 4,
        }}
      >
        {isLoading ? (
          <CircularProgress></CircularProgress>
        ) : (
          paymentGatewayData?.map((payment) => (
            <RadioGroup
              key={payment?.value}
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={payment?.value}
              name="radio-buttons-group"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <FormControlLabel
                name={payment?.value}
                onChange={() => handlePaymentMethodChange(payment?.value)}
                label={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      alt={payment?.name}
                      width="100%"
                      height={50}
                      src={payment?.logo}
                      style={{ marginRight: "15px" }}
                    />
                    <Typography fontSize={16} fontWeight={600}>
                      Payment With {payment?.name}
                    </Typography>
                  </Box>
                }
                control={
                  <Radio
                    checked={paymentMethod === payment?.value}
                    color="primary"
                    size="small"
                  />
                }
              />
              <Divider sx={{ paddingTop: "5px" }} />
            </RadioGroup>
          ))
        )}
      </Card1>

      <Grid container spacing={7}>
        <Grid item sm={6} xs={12}>
          <Button
            LinkComponent={Link}
            href="/checkout"
            variant="outlined"
            color="primary"
            type="button"
            fullWidth
          >
            Back to checkout details
          </Button>
        </Grid>

        <Grid item sm={6} xs={12}>
          <Button
            onClick={(e) => placeOrder()}
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              color: "white",
              bgcolor: "#3399cc",
              "&:hover": {
                backgroundColor: "#3399cc",
              },
            }}
          >
            Place Order
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};
export default PaymentForm;
