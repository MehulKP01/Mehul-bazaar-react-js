import Link from "next/link";
import { Fragment, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { Add, Favorite, Remove, RemoveRedEye } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  styled,
  Tooltip,
} from "@mui/material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import { H3, H5, Span, H6 } from "components/Typography";
const BazaarRating = lazy(()=> import("components/BazaarRating"));
const ProductViewDialog = lazy(()=> import("components/products/ProductViewDialog"));
import { FlexBox } from "../flex-box";
import {
  calculateDiscountPercentage,
  currencyFormat,
} from "lib";
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
import { displaySnackBar } from "common/snackBar";
// ==========================================================

// ==========================================================
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

const ImageWrapper = styled(Box)(({ theme }) => ({
  textAlign: "center",
  position: "relative",
  display: "inline-block",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
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
  "& .title, & .categories": {
    overflow: "visible",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
});
const ProductCard2 = (props) => {
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
        displaySnackBar(data?.message,"success","bottom","right")
      } else {
        displaySnackBar(data?.message,"error","bottom","right")
      }
    } else {
      const data = await addToWishList(id);
      setIsWishlist(!isWishlist);

      if (data?.status) {
        displaySnackBar(data?.message,"success","bottom","right")
      } else {
        displaySnackBar(data?.message,"error","bottom","right")
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
        displaySnackBar(response?.message,"success","bottom","right")
      } else {
        displaySnackBar(response?.message,"success","bottom","right")
      }
    } catch (error) {
      setIsLoading(false);
      displaySnackBar("Failed to add product to cart","error","bottom","right")
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
          displaySnackBar(response?.message,"success","bottom","right")
        } else {
          displaySnackBar(response?.message,"error","bottom","right")
        }
      } else {
        displaySnackBar("No product found in cart","error","bottom","right")
      }
    } catch (error) {
      displaySnackBar("Failed to update quantity","error","bottom","right")
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

        <Link href={`/product/${slug}`}>
          <Box
            onClick={() => {
              onProductView();
            }}
          >
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
                    badgeId?.place === "top-left" ||
                    badgeId?.place === "top-right"
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
            <LazyImage
              priority
              src={getMediaPath(image?.url)}
              width={500}
              height={500}
              alt={name}
            />
            {/* )} */}
          </Box>
        </Link>

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
              <Tooltip title={name} arrow placement="top">
                <H3
                  mb={1}
                  fontSize="14px"
                  width="100px"
                  fontWeight="600"
                  className="title"
                  color="text.secondary"
                  style={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whitespace: "nowrap",
                    width: "200px",
                  }}
                >
                  {name}
                </H3>
              </Tooltip>
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
export default ProductCard2;
