"use client"

import { Grid } from "@mui/material";
import { lazy } from "react";
const SEO = lazy(()=> import("../../src/components/SEO"));
const CheckoutForm = lazy(()=> import("../../src/pages-sections/checkout/CheckoutForm")) ;
const CheckoutNavLayout = lazy(()=> import("../../src/components/layouts/CheckoutNavLayout")) ;
const CheckoutSummary = lazy(()=> import("../../src/pages-sections/checkout/CheckoutSummary")) ;


const Checkout = () => {
    return (
        <CheckoutNavLayout>
            <SEO title="Checkout" />
            <Grid container flexWrap="wrap-reverse" spacing={3}>
                <Grid item lg={8} md={8} xs={12}>
                    <CheckoutForm />
                </Grid>

                <Grid item lg={4} md={4} xs={12}>
                    <CheckoutSummary />
                </Grid>
            </Grid>
        </CheckoutNavLayout>    
    );
};
export default Checkout;
