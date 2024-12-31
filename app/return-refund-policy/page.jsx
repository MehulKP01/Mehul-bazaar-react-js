"use client";

import { Box, Container, Skeleton, Typography } from "@mui/material";
import { api } from "../../src/utils/axiosInstance";
import { Paragraph } from "../../src/components/Typography";
import { useEffect, useState } from "react";
import { AssignmentReturnOutlined } from "@mui/icons-material";

const Refund = () => {
  const [refund, setRefund] = useState(null);

  const refundpolicy = async () => {
    const { data } = await api.post("page/get-by-slug", {
      slug: "return-refund-policy",
    });
    if (data.status) {
      setRefund(data?.page);
    }
  };

  useEffect(() => {
    refundpolicy();
  }, []);
  return (
    <Container maxWidth="lg" sx={{ minHeight: "50vh", py: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
          mb: 1,
        }}
      >
        <AssignmentReturnOutlined fontSize="small" color="primary" />
        <Typography
          variant="body1"
          fontSize="large"
          sx={{ fontWeight: "700" }}
          ml={1}
        >
          Return and Refund Policy
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

export default Refund;
