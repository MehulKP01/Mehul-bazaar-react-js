"use client";

import React, { memo } from "react";
import {
  Box,
  Card,
  Container,
  Grid,
  Rating,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { testimonials } from "../../common/staticData";
import dynamic from "next/dynamic";

const BazaarImage = dynamic(() => import("../../components/BazaarImage.jsx"), {
  ssr: false,
});

const Testimonials = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ backgroundColor: "#EEEEEE", py: 2 }} mt={3}>
      <Container>
        <Grid container spacing={3} my={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box p={4} sx={{ alignItems: "center" }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "700", color: "#1783FE" }}
              >
                TESTIMONIALS
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "700",
                  color: "#000000",
                  fontSize: "20px",
                }}
              >
                What Customers Feedback About Us
              </Typography>
              {testimonials?.map((testimonial, index) => (
                <Box key={index} sx={{ mt: 3 }}>
                  {testimonial.photos.map((photo, photoIndex) => (
                    <Box
                      key={photoIndex}
                      sx={{
                        display: "inline-block",
                      }}
                    >
                      <BazaarImage
                        src={photo}
                        sx={{
                          height: "35px",
                          width: "35px",
                          borderRadius: "50%",
                        }}
                      />
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Rating value={testimonial.rating} readOnly />
                        <span>(4.8/5)</span>
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#676767" }}>
                        Based on 1,258 reviews
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
              position="relative"
            >
              <BazaarImage
                src="/assets/images/banners/comments.png"
                sx={{
                  mx: "auto",
                  maxWidth: "100%",
                  width: isSmallScreen ? "10%" : "15%",
                  position: "absolute",
                  zIndex: 1,
                  top: isSmallScreen ? "-20px" : "-20px",
                  left: isSmallScreen ? "80%" : "300px",
                }}
              />
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Box p={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#000000" }}
                    mb={1}
                  >
                    Professional SEO
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#1783FE" }}
                    mb={3}
                  >
                    ANTHO./Businessman
                  </Typography>
                  <Typography variant="subtitle1">
                    Mentions consultaion discover her apartments.ndulgence offer
                    positions folliy death wrote cause take responses. plan upon
                    yet get spot action week amimont do am or limits find the
                    business solution always.
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 3,
              }}
              position="relative"
            >
              <BazaarImage
                src="/assets/images/banners/comments.png"
                sx={{
                  mx: "auto",
                  maxWidth: "100%",
                  width: isSmallScreen ? "10%" : "15%",
                  position: "absolute",
                  zIndex: 1,
                  top: isSmallScreen ? "-9px" : "-20px",
                  left: isSmallScreen ? "80%" : "300px",
                }}
              />
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Box p={4}>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#000000" }}
                    mb={1}
                  >
                    Website Perfomance
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "700",
                      color: "#1783FE",
                    }}
                    mb={3}
                  >
                    <Typography>METHO K../Developer </Typography>
                  </Typography>
                  <Typography variant="subtitle1">
                    Mentions consultaion discover her apartments.ndulgence offer
                    positionsfolliy death wrote cause take responses.plan upon
                    yet get spot actionweek amimont do am or limits find
                    thebusiness solution always.
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(Testimonials);
