"use client";

import React, { useEffect } from "react";
import { Box, Container, Typography, Button, Card, Grid } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useParams, useRouter } from "next/navigation";

const paymentsuccess = () => {
  const router = useRouter();
  const params = useParams();

  const continueshopping = (get) => {
    if (get == "payment") {
      router.push("/shop");
    } else if (get == "orders") {
      router.push("/orders");
    }
  };
  const goBack = () => {
    router.back(); // Go back to the previous page
  };
  const status = params?.status;

  useEffect(() => {
    if (status === "success") {
    } else if (status === "fail") {
    }
  }, [status]);

  return (
    <>
      {status == "success" ? (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
          }}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={8} lg={10}>
              <Card
                sx={{
                  padding: 4,
                  textAlign: "center",
                }}
              >
                <CheckCircleOutlineIcon
                  color="success"
                  sx={{
                    fontSize: 70,
                    marginBottom: 2,
                  }}
                />
                <Typography variant="h5" mb={2} align="center" component="div">
                  Payment Successful
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                  Thank you for your order. Your payment has been successfully
                  processed.
                </Typography>
                <Typography variant="body2" align="center" paragraph>
                  Your order details will be sent to your email.
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: 3,
                    }}
                    onClick={(e) => continueshopping("payment")}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: 3,
                      ml: 3,
                    }}
                    onClick={(e) => continueshopping("orders")}
                  >
                    My Order
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
          }}
        >
          <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={8} lg={10}>
              <Card
                sx={{
                  padding: 4,
                  textAlign: "center",
                }}
              >
                <HighlightOffIcon
                  color="error"
                  sx={{
                    fontSize: 70,
                    marginBottom: 2,
                  }}
                />
                <Typography variant="h5" mb={2} align="center" component="div">
                  Payment Failed
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                  Your payment has been failed to processed.
                </Typography>

                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: 3,
                    }}
                    onClick={(e) => goBack()}
                  >
                    Go Back
                  </Button>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default paymentsuccess;
