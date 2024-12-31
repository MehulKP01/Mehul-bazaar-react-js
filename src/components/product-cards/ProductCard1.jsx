"use client";

import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  styled,
} from "@mui/material";
import { useSnackbar } from "notistack";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
const LazyImage = dynamic(() => import("../../components/LazyImage"), {
  ssr: false,
});
const BazaarCard = dynamic(() => import("../../components/BazaarCard"), {
  ssr: false,
});
import { H3, H5, Span, H6 } from "../../components/Typography";
const BazaarRating = dynamic(() => import("../../components/BazaarRating"), {
  ssr: false,
});
const ProductViewDialog = dynamic(
  () => import("../../components/products/ProductViewDialog"),
  { ssr: false }
);
import { FlexBox } from "../flex-box";
import { calculateDiscountPercentage, currencyFormat } from "lib";
import { getMediaPath } from "lib";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductIntoCart,
  addToWishList,
  changeQuantityInCart,
  removeFromWishlist,
} from "../../redux/action";
import { removeWhishlistProducts } from "../../../src/redux/reducers/shop.reducer";
import dynamic from "next/dynamic";

// styled components
const StyledBazaarCard = styled(BazaarCard)({
  height: "100%",
  margin: "auto",
  display: "flex",
  overflow: "visible",
  borderRadius: "8px",
  position: "relative",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "all 250ms ease-in-out",
  "& .hover-box": {
    opacity: 1,
  },
});
const BadgeWrapper = styled(Box)({
  zIndex: 2, // Ensure this is added or adjusted
  position: "absolute",
  top: "10px", // Adjust as needed
  left: "10px", // Adjust as needed
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
});

const ImageWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
  overflow: "visible",
}));
const StyledChip = styled(Chip)({
  zIndex: 1,
  top: "10px",
  left: "10px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 600,
  fontSize: "10px",
  position: "absolute",
});
const HoverIconWrapper = styled(Box)({
  zIndex: 2,
  top: "7px",
  opacity: 0,
  right: "15px",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  flexDirection: "column",
  transition: "all 0.3s ease-in-out",
});
const ContentWrapper = styled(Box)({
  padding: "1rem",
  overflow: "visible",
  "& .title, & .categories": {
    overflow: "visible",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});


const ProductCard1 = (props) => {
  const { hoverEffect, product } = props;
  const {
    id,
    slug,
    name,
    regularPrice,
    averageRating,
    hideRating,
    image,
    discount,
    showProductSize,
    type,
    badgeId,
  } = product;

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const cart = useSelector((state) => state?.shop?.cart);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
  const [isWishlist, setIsWishlist] = useState(product?.isInWishlist);
  const currency = useSelector((state) => state?.shop?.currency);
  const cartProduct = useMemo(() => {
    setIsLoading(false);
    return cart.products.find((p) => p?.productId?._id == id);
  }, [dispatch, cart]);

  const router = useRouter();

  const handleToggleWishlist = async (productId, val) => {
    if (val) {
      const data = await removeFromWishlist(id);
      setIsWishlist(!isWishlist);
      if (data?.status) {
        dispatch(removeWhishlistProducts(id));
        enqueueSnackbar(data?.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        enqueueSnackbar(data?.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } else {
      const data = await addToWishList(id);
      setIsWishlist(!isWishlist);

      if (data?.status) {
        enqueueSnackbar(data?.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        enqueueSnackbar(data?.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    }
  };

  const onProductView = () => {
    router.push({
      pathname: `/product/${slug}`,
    });
  };

  const handleAddProductIntoCart = async (qty) => {
    setIsLoading(true);
    try {
      // Dispatch action to add product to cart
      const variationId = null;
      const response = await dispatch(addProductIntoCart(id, variationId, qty)); // Assuming 1 quantity for now, modify as needed
      // Show success message
      if (response?.status) {
        enqueueSnackbar(response?.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          autoHideDuration: 6000,
        });
      } else {
        enqueueSnackbar(response?.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      // Handle error
      setIsLoading(false);
      console.error("Error adding product to cart:", error?.message);
      enqueueSnackbar("Failed to add product to cart", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const handleChangeQtyCart = async (qty) => {
    setIsLoading(true);
    try {
      if (cartProduct) {
        // Dispatch action to change quantity in cart
        const response = await dispatch(
          changeQuantityInCart(cartProduct?._id, qty)
        );
        // Show success message
        if (response.status) {
          enqueueSnackbar(response?.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        } else {
          enqueueSnackbar(response?.message, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        }
      } else {
        console.error("No product found in cart");
        enqueueSnackbar("No product found in cart", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      // Handle error
      console.error("Error changing quantity in cart:", error.message);
      enqueueSnackbar("Failed to update quantity", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const salePrice = useMemo(() => {
    return product?.type == "simple"
      ? product?.salePrice
      : product?.salePrice ?? 0;
  }, [product, dispatch]);

  const minToMaxPrice = useMemo(() => {
    if (product?.type === "simple") {
      const salePrice = product?.salePrice;
      return { min: salePrice, max: salePrice };
    } else if (product?.variations?.length > 0) {
      const prices = product?.variations
        ?.map((variation) => variation?.salePrice)
        ?.filter((price) => price !== undefined);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return { min: minPrice, max: maxPrice };
    } else {
      return { min: null, max: null };
    }
  }, [product]);
  useEffect(() => {
    if (openModal) {
      // Disable scrolling on the background page
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling on the background page
      document.body.style.overflow = "auto";
    }
  }, [openModal]);
  return (
    <StyledBazaarCard hoverEffect={hoverEffect}>
      {badgeId && (
        <Box
          sx={{
            position: "absolute",
            zIndex: 3,
            top:
              badgeId?.place === "top-left" || badgeId?.place === "top-right"
                ? badgeId?.position?.top
                : null,
            left:
              badgeId?.place === "top-left" || badgeId?.place === "bottom-left"
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
              src={getMediaPath(badgeId?.image.url ?? "")}
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
      <ImageWrapper>
        {!!discount && (
          <StyledChip
            color="primary"
            size="small"
            label={`${calculateDiscountPercentage(salePrice, regularPrice)}
          % off`}
          />
        )}

        <HoverIconWrapper className="hover-box">
          <IconButton
            onClick={(e) => {
              setOpenModal(true);
            }}
          >
            <RemoveRedEye color="disabled" fontSize="small" />
          </IconButton>

          <IconButton onClick={() => handleToggleWishlist(id, isWishlist)}>
            {isWishlist != undefined && isWishlist ? (
              <Favorite color="primary" fontSize="small" />
            ) : (
              <FavoriteBorder fontSize="small" color="primary" />
            )}
          </IconButton>
        </HoverIconWrapper>

        <Box
          onClick={() => {
            onProductView();
          }}
        >
          <LazyImage
            priority
            src={getMediaPath(image?.url)}
            width={500}
            height={500}
            alt={name}
          />
          {/* )} */}
        </Box>
        {/* </Link> */}
      </ImageWrapper>
      {openModal ? (
        <ProductViewDialog
          openDialog={openModal}
          handleCloseDialog={toggleDialog}
          product={product}
        />
      ) : null}

      <ContentWrapper>
        <FlexBox>
          <Box flex="1 1 0" minWidth="0px" mr={1}>
            <Box>
              <H3
                mb={1}
                title={name}
                fontSize="14px"
                fontWeight="600"
                className="title"
                color="text.secondary"
                ellipsis
              >
                {name}
              </H3>
            </Box>

            {!hideRating && (
              <BazaarRating value={averageRating || 0} color="warn" readOnly />
            )}

            {showProductSize && (
              <Span color="grey.600" mb={1} display="block">
                {showProductSize}
              </Span>
            )}

            {product.type === "simple" ? (
              <FlexBox
                alignItems="baseline"
                gap={1}
                mt={0.5}
                color="primary.main"
                fontWeight="600"
              >
                <H5>{currencyFormat(minToMaxPrice?.min, currency)}</H5>
                <Box>
                  <H6 color="grey.600" fontWeight="600" mb={0.5} lineHeight="1">
                    <del>{currencyFormat(product?.regularPrice, currency)}</del>
                  </H6>
                </Box>
              </FlexBox>
            ) : (
              minToMaxPrice.min !== null &&
              minToMaxPrice.max !== null && (
                <FlexBox alignItems="center" gap={1} mt={0.5}>
                  <Box fontWeight="600" color="primary.main">
                    {currencyFormat(minToMaxPrice.min, currency)}
                    {minToMaxPrice.min !== minToMaxPrice.max &&
                      ` - ${currencyFormat(minToMaxPrice.max, currency)}`}
                  </Box>
                </FlexBox>
              )
            )}
          </Box>

          <FlexBox
            width="30px"
            alignItems="center"
            className="add-cart"
            flexDirection="column-reverse"
            justifyContent={
              !!cartProduct?.quantity ? "space-between" : "flex-start"
            }
          >
            {!cartProduct ? (
              <>
                {type == "simple" ? (
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
                      marginRight: "20px",
                    }}
                    onClick={() => {
                      handleAddProductIntoCart(1);
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size="1rem" />
                    ) : (
                      <Add fontSize="small" />
                    )}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="outlined"
                    style={{
                      width: "70px",
                      height: "35x",
                      marginRight: "30px",
                    }}
                    onClick={() => {
                      onProductView();
                    }}
                  >
                    view
                  </Button>
                )}
              </>
            ) : (
              <>
                <Fragment>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
                      marginRight: "20px",
                    }}
                    onClick={(e) =>
                      handleChangeQtyCart((cartProduct?.quantity ?? 0) - 1)
                    }
                  >
                    <Remove fontSize="small" />
                  </Button>
                  <Box color="text.primary" fontWeight="600" mr={2}>
                    {isLoading ? (
                      <CircularProgress size="1rem" />
                    ) : (
                      cartProduct?.quantity
                    )}
                  </Box>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
                      marginRight: "20px",
                    }}
                    onClick={(e) =>
                      handleChangeQtyCart((cartProduct?.quantity ?? 0) + 1)
                    }
                  >
                    <Add fontSize="small" />
                  </Button>
                </Fragment>
              </>
            )}
          </FlexBox>
        </FlexBox>
      </ContentWrapper>
    </StyledBazaarCard>
  );
};
export default memo(ProductCard1);
