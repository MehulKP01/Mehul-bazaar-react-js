import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  CardMedia,
  Checkbox,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const products = [
  {
    id: 1,
    name: "Premium Grocery",
    price: 250.0,
    originalPrice: 162.5,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2F1b1caa48-2d9d-4413-9489-7569e3e5b1de.png&w=640&q=75",
  },
  {
    id: 2,
    name: "Premium Grocery Bank Boom Boom",
    price: 220.0,
    originalPrice: 162.5,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2Fd38f20b7-b01a-43d7-890d-177cb9e0cb2b.png&w=640&q=75",
  },
  {
    id: 3,
    name: "Chole Masala",
    price: 230.0,
    originalPrice: 162.5,
    imageUrl:
      "https://digibulkmarketing.com/_next/image?url=https%3A%2F%2Fdigibulkmarketing.com%2Fmedia%2Fuploads%2F75a2ee76-6ed0-4d70-95bf-4c540656de0b.png&w=640&q=75",
  },
];

const HoverCardMedia = styled(CardMedia)(({ theme }) => ({
  transition: "transform 0.3s, background-color 0.3s",
  "&:hover": {
    backgroundColor: "transparent",
    transform: "scale(1.05)", // Scale the image on hover
  },
}));

const FrequentlyBoughtTogether = () => {
  // Initialize state with the first product pre-checked
  const [selectedProducts, setSelectedProducts] = useState({
    1: products.find((product) => product.id === 1),
  });

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (newSelected[productId]) {
        delete newSelected[productId];
      } else {
        newSelected[productId] = products.find(
          (product) => product.id === productId
        );
      }
      return newSelected;
    });
  };

  const selectedProductIds = Object.keys(selectedProducts);
  const allProductsSelected = selectedProductIds.length === products.length;

  const totalOriginalPrice = products.reduce(
    (acc, product) =>
      acc +
      (selectedProductIds.includes(String(product.id))
        ? product.originalPrice
        : 0),
    0
  );
  const totalPrice = products.reduce(
    (acc, product) =>
      acc +
      (selectedProductIds.includes(String(product.id)) ? product.price : 0),
    0
  );

  // Apply a 5% discount if all products are selected
  const discount = allProductsSelected ? totalPrice * 0.05 : 0;

  return (
    <Box p={3} mb={-10}>
      <Typography variant="h6" mb={2} gutterBottom fontWeight={600}>
        Buy together and save up to 5%
      </Typography>
      {useMediaQuery((theme) => theme.breakpoints.down("sm")) ? (
        <Box>
          {products.map((product) => (
            <Box key={product.id} sx={{ mb: 2 }}>
              <Box display="flex">
                <Checkbox
                  checked={!!selectedProducts[product.id]}
                  onChange={() => handleCheckboxChange(product.id)}
                  sx={{
                    visibility: product.id === 1 ? "hidden" : "visible", // Hide the checkbox for the first product
                    "&.Mui-checked": {
                      color: "primary.main",
                    },
                  }}
                />
                <HoverCardMedia
                  component="img"
                  height="100"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ width: 100, height: 100 }}
                />
                <Box ml={2} flexGrow={1}>
                  <Typography variant="body1">{product.name}</Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1" color="primary.main">
                      ₹{product.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
          <Box textAlign="center" mt={2} sx={{ color: "primary.main" }}>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              Total:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              ₹{(totalPrice - discount).toFixed(2)}
            </Typography>
            <Typography
              variant="body1"
              color="grey"
              sx={{ fontWeight: "bold" }}
            >
              Save ₹{discount.toFixed(2)}
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "primary.main",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
              disabled={selectedProductIds.length === 0}
            >
              Add all to Cart
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container justifyContent="flex-start">
          <Grid
            item
            xs={12}
            sm={6}
            container
            alignItems="center"
            justifyContent="space-between"
            mt={1}
            ml={-1}
          >
            {products.map((product, index) => (
              <React.Fragment key={product.id}>
                <Grid item xs={12} sm={6} md={3.5}>
                  <Box
                    sx={{
                      width: 150,
                      height: 110,
                      position: "relative",
                      zIndex: 0,
                    }}
                  >
                    <HoverCardMedia
                      component="img"
                      height="100%"
                      width="100%"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ padding: "0 18px", cursor: "pointer" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        right: -15,
                        zIndex: 1,
                      }}
                    >
                      {product.id !== 1 && (
                        <Checkbox
                          checked={!!selectedProducts[product.id]}
                          onChange={() => handleCheckboxChange(product.id)}
                          sx={{
                            "&.Mui-checked": {
                              color: "primary.main",
                            },
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box mt={1}>
                    <Box display="flex" flexDirection="column" ml={2}>
                      <Typography variant="body2" noWrap>
                        {product.name}
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        alignItems="center"
                        gap="10px"
                      >
                        <Typography
                          variant="body2"
                          color="primary.main"
                          sx={{ fontSize: "14px", fontWeight: "600" }}
                        >
                          ₹{product.price.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            textDecoration: "line-through",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                        >
                          ₹{product.originalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={0.5} mt={1}>
                  <Box
                    sx={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "grey",
                      ml: -0.5,
                      mt: -5,
                    }}
                  >
                    {index < products.length - 1 ? "+" : "="}
                  </Box>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="space-around"
              height="100%"
              width="100%"
              ml={-2}
            >
              <Box textAlign="center" sx={{ color: "primary.main" }}>
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "600" }}>
                  ₹{(totalPrice - discount).toFixed(2)}
                </Typography>
                <Typography
                  variant="body1"
                  color="grey"
                  sx={{ fontWeight: "bold" }}
                >
                  Save ₹{discount.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button
                  variant="contained"
                  sx={{
                    mb: 2,
                    backgroundColor: "primary.main",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                  disabled={selectedProductIds.length === 0}
                >
                  Add all to Cart
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FrequentlyBoughtTogether;
