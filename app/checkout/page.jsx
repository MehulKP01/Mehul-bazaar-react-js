"use client"

import { Grid } from "@mui/material";
import dynamic from "next/dynamic";
const SEO = dynamic(()=> import("../../src/components/SEO"),{ssr : false});
const CheckoutForm = dynamic(()=> import("../../src/pages-sections/checkout/CheckoutForm"),{ssr : false}) ;
const CheckoutNavLayout = dynamic(()=> import("../../src/components/layouts/CheckoutNavLayout"),{ssr : false}) ;
const CheckoutSummary = dynamic(()=> import("../../src/pages-sections/checkout/CheckoutSummary"),{ssr : false}) ;


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
