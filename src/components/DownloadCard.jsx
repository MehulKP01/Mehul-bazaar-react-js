"use client"

import React from 'react'

import BazaarImage from "../../src/components/BazaarImage.jsx";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import {
    Box,
    Button,
    CardContent,
    Tooltip,
    Typography,
  } from "@mui/material";

const DownloadCard = ({
    name,
    version,
    image,
    description,
    download,
  }) => (
    <Box
      sx={{
        mb: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
      }}
    >
      <CardContent>
        <Box sx={{ position: "relative" }}>
          <BazaarImage
            src="/assets/images/banners/sidebarblue.png"
            alt=""
            sx={{ position: "absolute", left: "-25px", height: "auto" }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box mb={7}>
              <Typography
                variant="body1"
                sx={{
                  position: "absolute",
                  top: "14px",
                  left: "16px",
                  color: "#ffff",
                }}
              >
                {version}
              </Typography>
            </Box>
            <Tooltip title={name} placement="top" arrow>
              <InfoOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
            </Tooltip>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row", maxWidth: 600 }}>
            <Box sx={{ flex: 1 }}>
              <BazaarImage
                src={image}
                alt={name}
                sx={{ width: "100%", height: "auto" }}
                className="img-fluid"
              />
            </Box>
            <CardContent sx={{ flex: 1, textAlign: "center" }}>
              <Typography
                variant="body1"
                sx={{ fontWeight: "700" }}
                mb={1}
                margin={"5px -50px"}
              >
                {name}
              </Typography>
              <Typography variant="body2" sx={{ color: "#717171" }} mb={1}>
                {description}
              </Typography>
              <Button
                variant="contained"
                size="small"
                color="success"
                target="_blank"
                sx={{ color: "#FFFFFF", mt: 2 }}
                href={download}
              >
                Download
              </Button>
            </CardContent>
          </Box>
        </Box>
      </CardContent>
    </Box>
  );

export default DownloadCard