"use client"

import { features1 } from "common/staticData";
import React, { memo } from "react";

import {
  Typography,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import { styled, keyframes } from "@mui/system";

const fadeInUp = keyframes`
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    `;

const AnimatedPaper = styled(Paper)(({ theme, delay }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  animation: `${fadeInUp} 0.9s ease-out ${delay}s both`,
  transition: "transform 0.9s ease-in-out, box-shadow 0.9s ease-in-out",
  "&:hover": {
    transform: "translateY(-18px)",
    boxShadow: theme.shadows[10],
  },
}));

const IconAnimation = keyframes`
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    `;

const AnimatedIcon = styled(IconButton)(({ theme }) => ({
  animation: `${IconAnimation} 2s infinite`,
  "&:hover": {
    animation: "none",
  },
}));

const ResellerFeature2 = () => {
  return features1?.map((feature, index) => (
    <Grid item xs={12} md={4} key={index}>
      <AnimatedPaper elevation={5}>
        <AnimatedIcon color="primary" aria-label={feature.title} size="large">
          {feature.icon}
        </AnimatedIcon>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          {feature.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {feature.description}
        </Typography>
      </AnimatedPaper>
    </Grid>
  ));
};

export default memo(ResellerFeature2);
