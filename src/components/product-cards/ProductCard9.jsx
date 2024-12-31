import Link from "next/link";
import { Add, Remove, FavoriteBorder, Favorite } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Rating,
  styled,
} from "@mui/material";
const Image = dynamic(()=> import("../../components/BazaarImage"),{ssr : false});
import { H5, Span } from "../../components/Typography";
import { FlexBox } from "../../components/flex-box";
import { currencyFormat, getMediaPath } from "../../lib";
import { addProductIntoCart, addToWishList, changeQuantityInCart, removeFromWishlist } from "../../redux/action";
import { Fragment, memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { updateProduct } from "../../redux/reducers/shop.reducer"
import dynamic from "next/dynamic";
import { displaySnackBar } from "common/snackBar";

// styled components
const Wrapper = styled(Card)({
  width: "100%",
  overflow: "visible",
  position: "relative",
  marginBottom: "1.25rem",
  // padding:"0.5rem",
});

// ===========================================================

// ===========================================================

const ProductCard9 = (props) => {
  // const { image, title, price, off, rating, id, slug, type } = props;
  const { product } = props;
  const {
    id,
    slug,
    name,
    regularPrice,
    averageRating,
    image,
    discount ,
    type,
    isInWishlist
  } = product;
  const cart = useSelector((state) => state?.shop?.cart);
  const currency = useSelector((state) => state?.shop?.currency)
  const dispatch = useDispatch();
  const [productId, setProductId] = useState();
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()


  const handleSlug = (slug) => {
    router.push({
      pathname: slug
    })
  }
  const ViewSlug = (slug) => {
    router.push({
      pathname: slug
    })

  }
  const cartProduct = useMemo(() => {
    setIsLoading(false)
    return cart?.products?.find((p) => p?.productId?._id == productId);
  }, [cart, dispatch]);

  const handleAddProductIntoCarts = async (id, qty) => {
    setIsLoading(true)
    try {
      setProductId(id)
      const variationId = null
      const response = await dispatch(addProductIntoCart(id, variationId, qty))
      if (response?.status) {
        displaySnackBar(response?.message,"success","bottom","right")
      } else {
        displaySnackBar(response?.message,"error","bottom","right")
      }
    } catch (e) {
      setIsLoading(false)
      console.log("error", e)
    }
  }


  const handleChangeQtyCarts = async (qty) => {
    setIsLoading(true)
    if (cartProduct) {
      const response = await dispatch(changeQuantityInCart(cartProduct?._id, qty));
      if (response?.status) {
        displaySnackBar(response?.message,"success","bottom","right")
      } else {
        displaySnackBar(response?.message,"error","bottom","right")
      }
    }
  }
  const handleToggleWishlist = async (isAddToWishlist) => {
    if (!isAddToWishlist) {
      const data = await removeFromWishlist(id);
      if (data?.status) {

        dispatch(updateProduct({ ...product, isInWishlist: false }));
        displaySnackBar(data?.message,"success","bottom","right")
      } else {
        displaySnackBar(data?.message,"error","bottom","right")
      }
    } else {
      const data = await addToWishList(id);

      if (data?.status) {
        displaySnackBar(data?.message,"success","bottom","right")
        dispatch(updateProduct({ ...product, isInWishlist: true }));
      } else {
        displaySnackBar(data?.message,"error","bottom","right")
      }
    }
  };

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

  return (
    <Wrapper>
      
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          top: 15,
          right: 15,
        }}
        onClick={() => handleToggleWishlist(!isInWishlist)}
      >
        {isInWishlist ? (
          <Favorite color="primary" fontSize="small" />
        ) : (
          <FavoriteBorder fontSize="small" color="primary" />
        )}
      </IconButton>
      
      <Grid container spacing={1}>
        <Grid item sm={3} xs={12}>
          <Box position="relative">
            {!!discount && (
              <Chip
                size="small"
                color="primary"
                label={`${discount}% off`}
                sx={{
                  top: 4,
                  left: 8,
                  px: "5px",
                  fontSize: 10,
                  fontWeight: 600,
                  position: "absolute",
                }}
              />
            )}

            <Image src={getMediaPath(image?.url)} alt={name} width="100%" />
          </Box>
        </Grid>

        <Grid item sm={9} xs={12}>
          <FlexBox
            flexDirection="column"
            justifyContent="center"
            height="100%"
            p={2}
          >
            <Link href={`/product/${slug}`}>
              <H5 fontWeight="600" my="0.5rem">
                {name}
              </H5>
            </Link>

            <Rating value={averageRating || 0} color="warn" readOnly />

            <FlexBox mt={1} mb={2} alignItems="center">
              <H5 fontWeight={600} color="primary.main" mr={1}>
                {currencyFormat(minToMaxPrice?.min, currency)}
              </H5>

                <Span fontWeight="600" color="grey.600">
                  <del>{currencyFormat(regularPrice, currency)}</del>
                </Span>
            </FlexBox>
  
            <FlexBox
              width="80px"
              alignItems="center"
              className="add-cart"
              flexDirection="column-reverse"
              justifyContent={!!cartProduct?.quantity ? "space-between" : "flex-start"}
            >
              {!cartProduct ? <>
                {type == "simple" ?
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
                      marginRight: "20px"
                    }}
                    onClick={() => {
                      handleAddProductIntoCarts(id, 1)
                    }}
                  >
                    {isLoading ? <CircularProgress size="1rem" /> : <Add fontSize="small" />}
                  </Button>
                  : <Button color="primary" variant="outlined" style={{ width: "70px", height: "35x", marginRight: "30px" }} onClick={() => {
                    ViewSlug(`/product/${slug}`);
                  }}>
                    view
                  </Button>}
              </> : <>
                <Fragment>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
                      marginRight: "20px"
                    }}
                    onClick={(e) => handleChangeQtyCarts((cartProduct?.quantity ?? 0) - 1)}
                  >
                    <Remove fontSize="small" />
                  </Button>
                  <Box color="text.primary" fontWeight="600" mr={2}>
                    {isLoading ? <CircularProgress size="1rem" /> : cartProduct?.quantity}
                  </Box>
                  <Button
                    color="primary"
                    variant="outlined"
                    sx={{
                      padding: "3px",
                      marginRight: "20px"
                    }}
                    onClick={(e) => handleChangeQtyCarts((cartProduct?.quantity ?? 0) + 1)}
                  >
                    <Add fontSize="small" />
                  </Button>
                </Fragment>
              </>
              }
            </FlexBox>
          </FlexBox>
        </Grid>
      </Grid>

    </Wrapper>
  );
};
export default ProductCard9;
