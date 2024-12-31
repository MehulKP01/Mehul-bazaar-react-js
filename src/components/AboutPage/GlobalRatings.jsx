"use client";

import React, { memo, useEffect, useState } from "react";

import {
  Box,
  Card,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { getStatisticData } from "utils/__api__/homeApis";
import { useSelector } from "react-redux";


const useStyles = makeStyles((theme) => ({
  customIcon: {
    color: "#1783FE", // Fire color
    fontSize: "50px",
    marginRight: theme.spacing(1),
    animation: "$fire 1s infinite",
  },
  fadeIn: {
    animation: "$fadeIn 2s",
  },
  bounce: {
    animation: "$bounce 2s infinite",
  },
  "@keyframes fire": {
    "0%": {
      opacity: 1,
      transform: "scale(1)",
    },
    "50%": {
      opacity: 0.9,
      transform: "scale(1.5)", // Simulate flickering by scaling up
    },
    "100%": {
      opacity: 1,
      transform: "scale(1)",
    },
  },
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes bounce": {
    "0%, 20%, 50%, 80%, 100%": {
      transform: "translateY(0)",
    },
    "40%": {
      transform: "translateY(-30px)",
    },
    "60%": {
      transform: "translateY(-15px)",
    },
  },
}));

const GlobalRatings = () => {
  const classes = useStyles();

  const [statsData, setStatsData] = useState();

  const ratings = useSelector((state)=> state.ratings)

  useEffect(() => {
    const getStats = async () => {
      if(ratings){
        setStatsData(ratings)
      }else{
        const data = await getStatisticData();
        if (data) {
          setStatsData(data);
        } else {
          setStatsData({});
        }
      }
    };
    getStats();
  }, []);
  
  return (
    <Box sx={{ backgroundColor: "#1783FE", py: 5 }} className={classes.fadeIn}>
      <Container>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ color: "#FFFF", fontWeight: "600" }}
            >
              Digi Bulk Marketing thrusted by
            </Typography>
            <Typography mb={1} variant="subtitle1" sx={{ color: "#FFFF" }}>
              Over 150,000+ client all over the world
            </Typography>
          </Grid>
          <Grid item lg={6} md={6} sm={6} xs={12}></Grid>
        </Grid>
        <Grid container spacing={3} my={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#EEEEEE",
              }}
            >
              <Box
                p={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                  // ref={countRef}
                >
                  {statsData?.resellers}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  Resellers
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#EEEEEE",
              }}
            >
              <Box
                p={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  {statsData?.activeUsers}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  Total Active Users
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#EEEEEE",
              }}
            >
              <Box
                p={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  {statsData?.totalKeys}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  Total Keys
                </Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "#EEEEEE",
              }}
            >
              <Box
                p={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  {" "}
                  3 +
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "700",
                    color: "#000000",
                  }}
                >
                  Years Of Experience
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default memo(GlobalRatings);
