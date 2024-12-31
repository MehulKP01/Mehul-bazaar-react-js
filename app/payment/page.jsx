"use client"

import { Grid } from "@mui/material";
import PaymentForm from "../../src/pages-sections/payment/PaymentForm";
import PaymentSummary from "../../src/pages-sections/payment/PaymentSummary";
import CheckoutNavLayout from "../../src/components/layouts/CheckoutNavLayout";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Checkout = () => {
const router = useRouter()

  const userData = useSelector((state) => state?.user);
  if (userData?.isGuest) {
      router.push("/login");
      return null;
  }

  return (
    <CheckoutNavLayout>
      <Grid container flexWrap="wrap-reverse" spacing={3}>
        <Grid item lg={8} md={8} xs={12}>
          <PaymentForm />
        </Grid>

        <Grid item lg={4} md={4} xs={12}>
          <PaymentSummary />
        </Grid>
      </Grid>
    </CheckoutNavLayout>
  );
};
export default Checkout;
