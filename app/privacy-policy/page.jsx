"use client";

import { Box, Container, Skeleton, Typography } from "@mui/material";
import { api } from "../../src/utils/axiosInstance";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import { Paragraph } from "../../src/components/Typography";
import { useEffect, useState } from "react";

const PrivacyPolicy = () => {
  const [refund, setRefund] = useState(null);

  const privcyPolicy = async () => {
    try {
      const { data } = await api.post("page/get-by-slug", {
        slug: "privacy-policy",
      });
      if (data.status) {
        setRefund(data?.page);
      }
    } catch (error) {
      console.log("privcyPolicy Error:", error);
      return null;
    }
  };

  useEffect(() => {
    privcyPolicy();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ minHeight: "50vh", py: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          flexWrap: "wrap",
          mb: 1,
        }}
      >
        <PolicyOutlinedIcon fontSize="small" color="primary" />
        <Typography
          variant="body1"
          fontSize="large"
          sx={{ fontWeight: "700" }}
          ml={1}
        >
          Privacy Policy
        </Typography>
      </Box>
      <div className="ql-editor">
        {refund?.content ? (
          <Paragraph
            my={2}
            dangerouslySetInnerHTML={{ __html: refund?.content }}
          />
        ) : (
          <>
            <Skeleton height={80}/>
            <Skeleton animation="wave" height={80} />
            <Skeleton animation={false} height={80}/>
            <Skeleton animation="wave" height={80} />
          </>
        )}
      </div>
    </Container>
  );
};

export default PrivacyPolicy;
