"use client";

import React, { memo } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
const GetAppIcon = dynamic(()=> import("@mui/icons-material/GetApp"),{ ssr: false });
import { downloadData } from "../../src/common/staticData";
import dynamic from "next/dynamic.js";
const DownloadCard = dynamic(()=> import('../../src/components/DownloadCard.jsx'),{ ssr: false })

const Download = () => {
  return (
    <>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "start",
            mb: 1,
          }}
        >
          <GetAppIcon color="primary" />
          <Typography
            variant="body1"
            fontSize="large"
            sx={{ fontWeight: "700" }}
            ml={1}
          >
            Download
          </Typography>
        </Box>
      </Container>
      <Container sx={{ mt: 2, mb: 4 }}>
        <Grid container spacing={2}>
          {downloadData?.downloads?.map((download) => (
            <Grid key={download?.name} item lg={4} md={6} sm={6} xs={12}>
              <DownloadCard {...download} />
            </Grid>
          ))}
        </Grid>
      </Container>
      </>
  );
};

export default Download;
