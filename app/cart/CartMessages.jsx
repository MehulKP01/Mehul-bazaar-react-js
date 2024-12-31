import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import GiftIcon from "@mui/icons-material/CardGiftcard";
import { useRouter } from "next/navigation";
import { api } from "../../src/utils/axiosInstance";

const cartmessage = () => {
  const theme = useTheme();
  const router = useRouter();
  const [banners, setBanners] = useState([]);

  const goToShop = () => {
    router.push("/shop");
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.post("user/cart-message");

      if (response?.data && Array.isArray(response?.data?.cartMessages)) {
        setBanners(response?.data?.cartMessages);
      } else {
        console.error("Unexpected response format:", response?.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
       {Array.isArray(banners) && banners.length > 0 ? (
        banners?.map((banner, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: theme.spacing(2),
              backgroundColor: banner?.bannerColor || "primary.main",
              color: "#FFFFFF", 
              marginBottom: theme.spacing(1),
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing(2),
              }}
            >

              <GiftIcon />
              <Typography variant="body1">{banner?.message}</Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFFFFF",
                color: banner.buttonColor || "primary.main",
              }}
              onClick={() => goToShop(banner?.buttonUrl)}
            >
              {banner?.buttonText || "GO TO THE SHOP"}
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No banners available</Typography> // Fallback message if no banners
      )}
    </Box>
  );
};

export default cartmessage;
