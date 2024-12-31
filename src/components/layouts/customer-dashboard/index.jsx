"use client"

import { Container, Grid } from "@mui/material";
import dynamic from "next/dynamic";
const Navigations =  dynamic(()=> import("./Navigations"),{ssr:false});

/**
 *  Used in:
 *  1. wish-list page
 *  2. address and address-details page
 *  3. orders and order-details page
 *  4. payment-methods and payment-method-details page
 *  5. profile and edit profile page
 *  6. support-tickets page
 */
// ======================================================

// ======================================================

const CustomerDashboardLayout = ({ children }) => (
    <Container
      sx={{
        my: "2rem",
      }}
    >
      <Grid container spacing={3}>
        <Grid
          item
          lg={3}
          xs={12}
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },
          }}
        >
          <Navigations />
        </Grid>

        <Grid item lg={9} xs={12}>
          {children}
        </Grid>
      </Grid>
    </Container>
);
export default CustomerDashboardLayout;
