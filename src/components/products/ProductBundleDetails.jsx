import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  useMediaQuery,
  Card,
} from "@mui/material";
import { H1, H2, H3, H4 } from "components/Typography";
import { FlexBox } from "../flex-box/index.js";
import { calculateDiscountPercentage, currencyFormat } from "lib";
import {
  addProductIntoCart,
  changeQuantityInCart,
  refreshCart,
} from "../../redux/action.js";
import { useDispatch, useSelector } from "react-redux";
import { Add, Remove, Star } from "@mui/icons-material";
const ProductViewDialog = dynamic(
  () => import("components/products/ProductViewDialog"),
  { ssr: false }
);
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import dynamic from "next/dynamic.js";
const BundleProductCard = dynamic(()=> import('./BundleCard.jsx'),{ssr : false});
import { displaySnackBar } from "common/snackBar.js";

const ProductDetails = ({ product, selectedVariant }) => {
  const { id, slug, review } = product;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.shop?.cart);
  const currency = useSelector((state) => state?.shop?.currency);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuantity, setIsQuantity] = useState(false);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const setUrlParams = {};
  const router = useRouter();

  const paramsData = router.query;
  const getParamValue = () => {
    for (const key in paramsData) {
      if (key.startsWith("attribute_")) {
        const attributeName = key.replace("attribute_", ""); // Remove 'attribute_' prefix
        setUrlParams[attributeName] = paramsData[key];
      }
    }
  };

  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch, product]);

  const cartProduct = useMemo(() => {
    setIsQuantity(false);
    setIsLoading(false);
    return cart.products.find((p) => p.productId?._id == product._id);
  }, [cart]);
  const salePrice = useMemo(() => {
    return product?.salePrice;
  }, [dispatch]);

  const regularPrice = useMemo(() => {
    return product?.regularPrice;
  }, [dispatch]);


  const handleAddProductIntoCart = async () => {
    setIsLoading(true);
    try {
      const response = await dispatch(
        addProductIntoCart(product?._id, null, 1)
      );

      if (response?.status) {
        displaySnackBar(response?.message,"success","bottom","right")
      } else {
        displaySnackBar(response?.message,"warning","bottom","right")
      }
    } catch (e) {
      displaySnackBar(e?.message ? e?.message : "Something went Wrong","warning","bottom","right")
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleBuyNow = async () => {
    if (cartProduct) {
      router.push("/checkout"); // Redirect to checkout page
    } else {
      try {
        const response = await dispatch(
          addProductIntoCart(product?._id, null, 1)
        );
        if (response?.status) {
        displaySnackBar(response?.message,"success","bottom","right")
          router.push("/checkout"); // Redirect to checkout page
        } else {
        displaySnackBar(response?.message,"error","bottom","right")
        }
      } catch (e) {
        console.log("E here", e);
        displaySnackBar(e?.message,"error","bottom","right")
      }
    }
  };

  const handleChangeQtyCart = async (qty) => {
    setIsLoading(false);
    setIsQuantity(true);
    if (cartProduct) {
      const response = await dispatch(
        changeQuantityInCart(cartProduct._id, qty)
      );
      if (response?.status) {
        displaySnackBar(response?.message,"success","bottom","right")
      } else {
        displaySnackBar(response?.message,"error","bottom","right")
      }
    }
  };

  const getStockColor = (stockLevel) => {
    if (stockLevel <= 0) {
      return "red";
    } else {
      return "green";
    }
  };

  useEffect(() => {
    if (openModal) {
      // Disable scrolling on the background page
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling on the background page
      document.body.style.overflow = "auto";
    }
  }, [openModal]);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const productName = useMemo(() => {
    return product.name;
  }, [product]);
  return (
    <>
      <H1>{productName}</H1>

      <Box
        display="inline-flex"
        alignItems="center"
        borderRadius="2px"
        border="1px solid "
        borderColor="grey.500"
        mb={2}
        padding="2px"
        sx={{
          "&:hover": {
            borderColor: "black",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          ml={1}
          lineHeight={1}
        >
          <Typography
            variant="body2"
            fontSize="16px"
            fontWeight="700"
            component="span"
            mr={1}
          >
            {review?.averageRating || "0"}
          </Typography>
          <Star fontSize="20px" sx={{ color: "primary.main" }} />
        </Box>
        <Box mx={0.5} color="grey.600" alignItems="center">
          |
        </Box>
        <Box mx={1} lineHeight={1} fontSize="small">
          <Typography variant="body2" component="span" color="grey.600">
            {`${review?.totalReviews || 0} Ratings`}
          </Typography>
        </Box>
      </Box>
      <Divider
        sx={{
          mb: 1,
          borderColor: "grey.500",
        }}
      />

      <Box pt={1} mb={1}>
        <Box display={"flex"} gap={1} alignItems={"center"}>
          <H2 color="primary.main" mb={0.5} lineHeight="1">
            {currencyFormat(salePrice, currency)}
          </H2>
          {regularPrice ? ( 
            <>
              <H4 color="grey.500" fontWeight="600" mb={0.5} lineHeight="1">
                MRP
                <del>{currencyFormat(regularPrice, currency)}</del>
              </H4>
              <H4
                color="primary.secondary"
                fontWeight="600"
                mb={0.5}
                lineHeight="1"
              >
                ({calculateDiscountPercentage(salePrice, regularPrice)}% OFF)
              </H4>
            </>
          ) : (
            ""
          )}
        </Box>

        <Typography variant="body2" pt={0} mt={1} color="#03a685">
          Inclusive of all taxes
        </Typography>
      </Box>

      <BundleProductCard currency={currency} products={product.products} />

      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={{
          title: product?.category?.map((category) => category?.name),
          price: product?.salePrice,
          id,
          slug,
          descriptions: product?.description,
          categoryDescriptions: product?.category?.map(
            (category) => category?.description
          ),
          imgGroup: [product?.image?.url, product?.image?.url],
        }}
      />
      <Box pt={0} mb={2} mt={2} color={getStockColor(product?.stock)}>
        {product?.stock > 0 ? "In Stock" : "Out of Stock"}
      </Box>

      <Box>
        <Card></Card>
      </Box>

      {!cartProduct ? (
        <FlexBox gap={1} sx={{ flexWrap: "wrap" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={(e) => handleAddProductIntoCart(1)}
            sx={{
              mb: isMobile ? "1rem" : "4.5rem",
              mt: 1,
              width: isMobile ? "100%" : "30%",
              height: 52,
            }}
            sm={6}
            md={4}
            disabled={
              isLoading ||
              (product?.type === "simple" && product?.stock <= 0) ||
              (product?.type === "variation" &&
                (!selectedVariant || selectedVariant?.stock <= 0))
            }
          >
            {isLoading ? (
              <CircularProgress sx={{ color: "#fff" }} size="1rem" />
            ) : (
              <>
                <ShoppingCartOutlinedIcon />
                Add to Cart
              </>
            )}
          </Button>
          <Button
            borderColor="primary"
            variant="outlined"
            onClick={handleBuyNow}
            sx={{
              mb: isMobile ? "1rem" : "4.5rem",
              width: isMobile ? "100%" : "30%",
              mt: 1,
              height: 50,
              borderColor: "primary.main",
              color: "primary.main",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
              },
            }}
            sm={6}
            md={4}
            disabled={
              (product?.type === "simple" && product?.stock <= 0) ||
              (product?.type === "variation" &&
                (!selectedVariant || selectedVariant?.stock <= 0))
            }
          >
            <ShoppingBagOutlinedIcon />
            Buy Now
          </Button>
        </FlexBox>
      ) : (
        <>
          <FlexBox alignItems="center" mb={4.5}>
            <Button
              size="small"
              sx={{
                p: 1,
              }}
              color="primary"
              variant="outlined"
              onClick={(e) =>
                handleChangeQtyCart((cartProduct?.quantity ?? 0) - 1)
              }
            >
              <Remove fontSize="small" />
            </Button>

            <H3 fontWeight="600" mx={2.5}>
              {isQuantity ? (
                <CircularProgress size="1rem" />
              ) : (
                cartProduct?.quantity?.toString().padStart(2, "0")
              )}
            </H3>

            <Button
              size="small"
              sx={{
                p: 1,
              }}
              color="primary"
              variant="outlined"
              onClick={(e) =>
                handleChangeQtyCart((cartProduct?.quantity ?? 0) + 1)
              }
            >
              <Add fontSize="small" />
            </Button>
          </FlexBox>

          <FlexBox gap={1} sx={{ flexWrap: "wrap" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => handleGoToCart(1)}
              sx={{
                px: isMobile ? "1.6rem" : "3rem",
                mb: isMobile ? "1rem" : "4.5rem",
                mt: 1,
                height: 50,
              }}
              sm={6}
              md={4}
              disabled={
                isLoading ||
                (product?.type === "simple" && product?.stock <= 0) ||
                (product?.type === "variation" &&
                  (!selectedVariant || selectedVariant?.stock <= 0))
              }
            >
              {isLoading ? (
                <CircularProgress sx={{ color: "#fff" }} size="1rem" />
              ) : (
                <>
                  <ShoppingCartOutlinedIcon />
                  Go to Cart
                </>
              )}
            </Button>
            <Button
              borderColor="primary"
              variant="outlined"
              onClick={handleBuyNow}
              sx={{
                mb: isMobile ? "1rem" : "4.5rem",
                mt: 1,
                px: isMobile ? "1.6rem" : "3rem",
                height: 50,
                borderColor: "primary.main",
                color: "primary.main",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "primary.main",
                  color: "white",
                },
              }}
              sm={6}
              md={4}
              disabled={
                (product?.type === "simple" && product?.stock <= 0) ||
                (product?.type === "variation" &&
                  (!selectedVariant || selectedVariant?.stock <= 0))
              }
            >
              <ShoppingBagOutlinedIcon />
              Buy Now
            </Button>
          </FlexBox>
        </>
      )}
      <Divider />
    </>
  );
};

export default ProductDetails;
