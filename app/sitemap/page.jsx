"use client";

import React from "react";
import { Box, Container, Typography, Divider } from "@mui/material";
import { AccountTreeOutlined } from "@mui/icons-material";
import { sitemapData } from "../../src/common/staticData";

const SiteMap = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mb: 1,
            justifyContent: "start",
          }}
        >
          <AccountTreeOutlined fontSize="small" color="primary" />
          <Typography
            variant="body1"
            fontSize="large"
            sx={{ fontWeight: "700" }}
            ml={1}
          >
            Sitemap
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            p: 0,
            m: 0,
          }}
        >
          {sitemapData.map((item) => (
            <Box
              key={item.name}
              sx={{
                "&:not(:last-child)": {
                  mr: 2,
                },
              }}
            >
              <a
                href={item.link}
                style={{
                  display: "inline-block",
                  padding: "8px 16px",
                  textDecoration: "none",
                  color: "#000",
                  borderRadius: "4px",
                  transition: "background-color 0.3s, color 0.3s",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                  e.currentTarget.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.color = "#000";
                }}
              >
                <span>{item.name}</span>
              </a>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SiteMap;
