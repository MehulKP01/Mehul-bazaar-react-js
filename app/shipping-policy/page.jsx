"use client";

import { Box, Container, Skeleton, Typography } from "@mui/material";
import { api } from "../../src/utils/axiosInstance";
import { Paragraph } from "../../src/components/Typography";
import { useEffect, useState } from "react";
import { LocalShippingOutlined } from "@mui/icons-material";

const ShippingPolicy = () => {
  const [shipping, setShipping] = useState(null);

  const shippingPolicy = async () => {
    const { data } = await api.post("page/get-by-slug", {
      slug: "shipping-policy",
    });
    if (data.status) {
      setShipping(data?.page);
    }
  };

  useEffect(() => {
    shippingPolicy();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ minHeight: "50vh", py: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          mb: 1,
          justifyContent: "start",
        }}
      >
        <LocalShippingOutlined fontSize="small" color="primary" />
        <Typography
          variant="body1"
          fontSize="large"
          sx={{ fontWeight: "700" }}
          ml={1}
        >
          Shipping Policy
        </Typography>
      </Box>
      <div className="ql-editor">
        {shipping?.content ? (
          <Paragraph
            my={2}
            dangerouslySetInnerHTML={{ __html: shipping?.content }}
          />
        ) : (
          <>
            <Skeleton height={80} />
            <Skeleton animation="wave" height={80} />
            <Skeleton animation={false} height={80} />
            <Skeleton animation="wave" height={80} />
          </>
        )}
      </div>
    </Container>
  );
};

export default ShippingPolicy;
