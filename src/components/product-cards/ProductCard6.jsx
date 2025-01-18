"use client";

import { Box, Card, Chip, styled } from "@mui/material";
import HoverBox from "../../components/HoverBox";
import LazyImage from "../../components/LazyImage";
import { getMediaPath } from "../../lib";

// styled components
const StyledChip = styled(Chip)({
  zIndex: 2,
  top: "0.875rem",
  fontSize: "10px",
  padding: "0 8px",
  fontWeight: "600",
  position: "absolute",
});

// ========================================================

// ========================================================
const ProductCard6 = ({ title, subtitle, imgUrl, badgeId }) => {
  return (
    <Card
      sx={{
        position: "relative",
      }}
    >
      <StyledChip
        color="primary"
        label={title}
        size="small"
        sx={{
          left: 12,
        }}
      />

      <HoverBox borderRadius={2}>
        <Box
          position="absolute"
          top={20}
          left={20}
          display="flex"
          gap={1}
        ></Box>
        {badgeId && (
          <Box
            sx={{
              position: "absolute",
              top:
                badgeId?.place === "top-left" || badgeId?.place === "top-right"
                  ? badgeId?.position?.top
                  : null,
              left:
                badgeId?.place === "top-left" ||
                badgeId?.place === "bottom-left"
                  ? badgeId?.position?.left
                  : null,
              right:
                badgeId?.place === "top-right" ||
                badgeId?.place === "bottom-right"
                  ? badgeId?.position?.right
                  : null,
              bottom:
                badgeId?.place === "bottom-right" ||
                badgeId?.place === "bottom-left"
                  ? badgeId?.position?.bottom
                  : null,
            }}
          >
            {badgeId && badgeId?.image && (
              <img
                src={getMediaPath(badgeId?.image?.url ?? "")}
                alt="Selected Image"
                style={{
                  width: badgeId?.size * 100 ?? 0,
                  aspectRatio: "1",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
        )}
        <LazyImage priority src={imgUrl} width={500} height={500} alt={title} />
      </HoverBox>
    </Card>
  );
};
export default ProductCard6;
