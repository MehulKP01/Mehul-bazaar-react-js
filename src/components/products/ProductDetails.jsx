import { lazy, useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  Typography,
  Divider,
  useMediaQuery,
  Checkbox,
} from "@mui/material";
import { H1, H2, H3, H4, H6 } from "components/Typography";
import { FlexBox } from "../../components/flex-box";
import { calculateDiscountPercentage, currencyFormat, getMediaPath } from "lib";
import {
  addProductIntoCart,
  changeQuantityInCart,
  refreshCart,
} from "../../redux/action.js";
import { useDispatch, useSelector } from "react-redux";
import { Add, Remove, Star } from "@mui/icons-material";
const ProductViewDialog = lazy(
  () => import("components/products/ProductViewDialog"));
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SparklesIcon from "@mui/icons-material/AutoAwesome";
import { api } from "utils/axiosInstance";
import { displaySnackBar } from "common/snackBar";

const ProductDetails = ({ product, setSelectedVariant, selectedVariant }) => {
  const { id, slug, review } = product;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.shop?.cart);

  const currency = useSelector((state) => state?.shop?.currency);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuantity, setIsQuantity] = useState(false);
  const [checked, setChecked] = useState([]);

  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const setUrlParams = {};
  const router = useRouter();
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams);

  const getParamValue = () => {
    for (const key in params) {
      if (key.startsWith("attribute_")) {
        const attributeName = key.replace("attribute_", ""); // Remove 'attribute_' prefix
        setUrlParams[attributeName] = params[key];
      }
    }
  };

  useEffect(() => {
    getParamValue();

    if (product?.type == "variation") {
      // Queries in url
      const keys = Object.keys(setUrlParams);
      const selectedAttItem = [];

      // It will return attribute id and attributed item id which is in query
      keys.forEach((key) => {
        // Finding attribute according to key in query
        const attribute = product?.attributes.find((attr) =>
          attr.items?.some((item) => item?.slug === setUrlParams[key])
        );

        // finding attribute item in attribute
        const attrItem = attribute?.items?.find(
          (item) => item?.slug === setUrlParams[key]
        );

        // if both are there push in selectedItem
        if (attribute && attrItem) {
          selectedAttItem?.push({
            attribute: attribute?._id,
            attributeItem: attrItem?._id,
          });
        }
      });

      // Finding variation based on the dimensions
      const selectedVar = product?.variations?.find((variation) => {
        return (
          variation?.dimensions?.length > 0 &&
          selectedAttItem?.every((selec) => {
            return variation?.dimensions?.some(
              (dim) =>
                dim?.attributeId === selec?.attribute &&
                dim?.attributeItemId === selec?.attributeItem
            );
          })
        );
      });
      setSelectedVariant(selectedVar);
      // productGallery(product, selectedVar)
    }
  }, [params]);

  useEffect(() => {
    dispatch(refreshCart());
    addOn();
  }, [dispatch, product]);

  const cartProduct = useMemo(() => {
    setIsQuantity(false);
    setIsLoading(false);
    return cart.products.find(
      (p) =>
        p.productId?._id === product._id &&
        (!selectedVariant || p.variationId === selectedVariant?._id) &&
        p?.addOnList?.length === checked?.length &&
        p?.addOnList?.every((id) => checked.includes(id?.id))
    );
  }, [selectedVariant, cart, checked]);

  const salePrice = useMemo(() => {
    return product?.type == "simple"
      ? product?.salePrice
      : selectedVariant?.salePrice ?? 0;
  }, [selectedVariant, dispatch]);

  const regularPrice = useMemo(() => {
    return product?.type == "simple"
    ? product?.regularPrice
    : selectedVariant?.regularPrice ?? 0;
  }, [selectedVariant, dispatch]);
  
  const isAttributeItemSelected = (attItemId) =>
    product?.variations?.some((varitaion) =>
      varitaion?.dimensions?.some((dim) => dim?.attributeItemId === attItemId)
    );

  const checkAttSelected = (attId, attItemId) => {
    return selectedVariant
      ? selectedVariant?.dimensions?.find(
          (x) => x?.attributeId == attId && x?.attributeItemId == attItemId
        )
      : false;
  };

  const isAttItemSelected = useCallback(
    (attId, attItemId) => {
      return checkAttSelected(attId, attItemId);
    },
    [selectedVariant]
  );

  const findAttItems = (att) => {
    return att.items;
  };

  const attItems = useCallback(
    (att) => {
      return findAttItems(att);
    },
    [dispatch]
  );

  const updateUrlQuery = (attSlug, attitemSlug) => {
    const { slug, country_code, ...existingQuery } = params;

    const newQuery = {
      ...existingQuery,
      [`attribute_${attSlug}`]: attitemSlug,
    };

    newParams.set("", newQuery);
    router.push(`${pathname}?${newParams}`);
    
    getParamValue();
  };

  const handleAddProductIntoCart = async () => {
    setIsLoading(true);
    const response = await dispatch(
      addProductIntoCart(
        product?._id,
        product?.type == "simple" ? null : selectedVariant?._id,
        1,
        checked
      )
    );
    if (response?.status) {
      displaySnackBar(response?.message, "success", "bottom", "right");
    } else {
      displaySnackBar(response?.message, "warning", "bottom", "right");
    }
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleBuyNow = async () => {
    if (cartProduct) {
      router.push("/checkout"); // Redirect to checkout page
    } else {
      const response = await dispatch(
        addProductIntoCart(
          product?._id,
          product?.type == "simple" ? null : selectedVariant?._id,
          1
        )
      );
      if (response?.status) {
        displaySnackBar(response?.message, "success", "bottom", "right");
        router.push("/checkout"); // Redirect to checkout page
      } else {
        displaySnackBar(response?.message, "error", "bottom", "right");
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
      if (response.status) {
        displaySnackBar(response?.message, "success", "bottom", "right");
      } else {
        displaySnackBar(response?.message, "error", "bottom", "right");
      }
    }
  };

  const minToMaxPrice = useMemo(() => {
    const maxPrice = product?.variations?.reduce(
      (max, item) => (item?.salePrice > max ? item?.salePrice : max),
      product?.variations[0]?.salePrice
    );
    const minPrice = product?.variations?.reduce(
      (max, item) => (item?.salePrice < max ? item?.salePrice : max),
      product?.variations[0]?.salePrice
    );
    const minP_maxP = { min: minPrice, max: maxPrice };
    return minP_maxP;
  }, [product]);
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
    if (
      product?.type === "variation" &&
      selectedVariant &&
      product.attributes
    ) {
      return selectedVariant.title;
    }
    return product.name;
  }, [product, selectedVariant]);

  const [addOns, setAddOns] = useState([]);

  const addOn = async () => {
    try {
      const response = await api.post("/product/add-on/all", {
        product_id: id,
      });
      setAddOns(response?.data?.addOns || []);
      setChecked(response?.data?.addOns?.map((a) => a._id) || []);
    } catch (error) {
      console.error("Failed to addon product to cart", error);
    }
  };

  const handleCheckboxChange = (addonId) => {
    setChecked((prevCheckedAddOns) =>
      prevCheckedAddOns?.includes(addonId)
        ? prevCheckedAddOns.filter((id) => id !== addonId)
        : [...prevCheckedAddOns, addonId]
    );
  };

  const totalAddonsPrice = addOns
    .filter((addon) => checked.includes(addon._id))
    .reduce((total, addon) => total + addon?.salePrice, 0);

  const grandTotal = salePrice + totalAddonsPrice;
  const hasAddOns = addOns?.length > 0;

  return (
    <>
      <H1>{productName}</H1>

      <FlexBox alignItems="center" mb={1} gap={1}>
        <Box>Brand: </Box>
        <H6 color="primary.main"> {product?.brandId?.name}</H6>
      </FlexBox>

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
      <Box mb={0.5} color="dark.main">
        <div>
          {product?.type === "simple" ? null : (
            <H6>
              {currencyFormat(minToMaxPrice?.min, currency)} -
              {currencyFormat(minToMaxPrice?.max, currency)}
            </H6>
          )}
        </div>
      </Box>
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

      {product?.type == "variation" &&
        product?.attributes?.map((att) => {
          return (
            <Box key={att?.id} mb={2}>
              <H6 mb={1}>{att?.name.toUpperCase()}</H6>

              {attItems(att).map((attItem) => {
                return (
                  <>
                    {isAttributeItemSelected(attItem?._id) && (
                      <Chip
                        label={attItem?.name}
                        onClick={() => {
                          updateUrlQuery(att?.slug, attItem?.slug);
                        }}
                        sx={{
                          borderRadius: "4px",
                          mr: 1,
                          mb: 0,
                          cursor: "pointer",
                        }}
                        color={
                          isAttItemSelected(att?._id, attItem?._id)
                            ? "primary"
                            : "default"
                        }
                      />
                    )}
                  </>
                );
              })}
            </Box>
          );
        })}

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
      <Box
        pt={0}
        mb={2}
        mt={2}
        color={getStockColor(
          product?.type === "simple"
            ? product?.stock
            : selectedVariant?.stock ?? 0
        )}
      >
        {product?.type === "simple"
          ? product?.stock > 0
            ? "In Stock"
            : "Out of Stock"
          : selectedVariant?.stock > 0
          ? "In Stock"
          : "Out of Stock"}
      </Box>

      <Box display="flex" alignItems="center" mb={2} sx={{ color: "#555" }}>
        <SparklesIcon sx={{ color: "#4caf50", marginRight: 1 }} />
        <Typography variant="body2">
          Purchase this item and get Additional reward points.
        </Typography>
      </Box>
      <>
        {hasAddOns && (
          <Box
            sx={{
              padding: 1,
              border: "1px solid #ddd",
              borderRadius: 2,
              maxWidth: "100%",
              cursor: "pointer",
            }}
          >
            {addOns?.map((addon) => (
              <Box key={addon._id}>
                <Grid container alignItems="center">
                  <Grid item>
                    <Checkbox
                      checked={checked?.includes(addon._id)}
                      onChange={() => handleCheckboxChange(addon._id)}
                      color="primary"
                    />
                  </Grid>
                  <Grid item>
                    <Box
                      component="img"
                      sx={{
                        height: 56,
                        width: 56,
                      }}
                      alt="image"
                      src={getMediaPath(addon.image.url)}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{ ml: "5px" }}
                    >
                      {addon?.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ ml: "5px" }}
                    >
                      {addon?.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight="bold"
                      margin={"2px"}
                    >
                      {currencyFormat(addon?.salePrice, currency)}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ borderColor: "grey.500" }} />
              </Box>
            ))}

            {/* Total Calculation Section */}
            {checked.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Typography>
                  Main Product Price:{" "}
                  <strong>{currencyFormat(salePrice, currency)}</strong>
                </Typography>
                 
                <Typography color="primary">
                  Grand Total:{" "}
                  <strong>{currencyFormat(grandTotal, currency)}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {!cartProduct ? (
          <FlexBox gap={1} sx={{ flexWrap: "wrap" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => handleAddProductIntoCart()}
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
            <FlexBox alignItems="center" mb={4.5} mt={1}>
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
      </>
      <Divider />
    </>
  );
};

export default ProductDetails;
