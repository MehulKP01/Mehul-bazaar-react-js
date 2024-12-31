"use client";

import { Box, Container, Skeleton, Typography } from "@mui/material";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import { api } from "../../src/utils/axiosInstance";
import { Paragraph } from "../../src/components/Typography";

import { useEffect, useState } from "react";

const TermsCondition = () => {
  const [terms, setTerms] = useState(null);
  const termsconditionpolicy = async () => {
    const { data } = await api.post("page/get-by-slug", {
      slug: "terms-and-conditions",
    });
    if (data.status) {
      setTerms(data?.page);
    }
  };

  useEffect(() => {
    termsconditionpolicy();
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
          flexWrap: "wrap",
        }}
      >
        <PolicyOutlinedIcon fontSize="small" color="primary" />
        <Typography
          variant="body1"
          fontSize="large"
          sx={{ fontWeight: "700" }}
          ml={1}
        >
          Terms and Conditions
        </Typography>
      </Box>
      <div className="ql-editor">
        {terms?.content ? (
          <Paragraph
            my={2}
            dangerouslySetInnerHTML={{ __html: terms?.content }}
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

export default TermsCondition;
