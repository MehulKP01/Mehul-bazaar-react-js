import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  Grid,
  styled,
  useMediaQuery,
} from "@mui/material";
import { PRODUCT_PLACEHOLDER, getMediaPath, productGallery } from "lib";
import {
  addToWishList,
  refreshCart,
  removeFromWishlist,
} from "../../redux/action.js";
import { useDispatch } from "react-redux";
import { Favorite } from "@mui/icons-material";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
const ProductDetails = dynamic(
  () => import("components/products/ProductDetails"),
  { ssr: false }
);
const ProductBundleDetails = dynamic(
  () => import("components/products/ProductBundleDetails"),
  { ssr: false }
);
import ReactPlayer from "react-player";
import dynamic from "next/dynamic.js";
import { displaySnackBar } from "common/snackBar.js";

const ZoomableImage = styled(Box)(({ theme }) => ({
  overflow: "hidden",
}));

// ================================================================
const ProductIntro = ({
  product,
  selectedVariant,
  setSelectedVariant,
  setting,
}) => {
  const { id, isInWishlist, badgeId, type } = product;
  const dispatch = useDispatch();
  const [wishlist, setWishlist] = useState(isInWishlist);

  const [selectedImage, setSelectedImage] = useState(0);
  const setUrlParams = {};
  const params = useParams()

  const getParamValue = () => {
    for (const key in params) {
      if (key.startsWith("attribute_")) {
        const attributeName = key.replace("attribute_", "");
        setUrlParams[attributeName] = params[key];
      }
    }
  };

  const handleToggleWishlist = async (isAddToWishlist) => {
    if (!isAddToWishlist) {
      const data = await removeFromWishlist(id);
      if (data?.status) {
        setWishlist(false);
        displaySnackBar(data?.message,"success","bottom","right")
      } else {
        displaySnackBar(data?.message,"error","bottom","right")
      }
    } else {
      const data = await addToWishList(id);
      try {
        if (data && data?.status) {
        displaySnackBar(data?.message,"success","bottom","right")
          setWishlist(true);
        } else {
        displaySnackBar(data?.message,"error","bottom","right")
        }
      } catch (e) {
        displaySnackBar(e?.message,"error","bottom","right")
      }
    }
  };

  useEffect(() => {
    getParamValue();

    if (product?.type == "variation") {
      const keys = Object.keys(setUrlParams);
      const selectedAttItem = [];

      // It will return attribute id and attributed item id which is in query
      keys.forEach((key) => {
        // Finding attribute according to key in query
        const attribute = product?.attributes?.find((attr) =>
          attr?.items?.some((item) => item?.slug === setUrlParams[key])
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

      // Findging variation based on the dimensions
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
    }
  }, [params]);

  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch, product]);

  const images = useMemo(() => {
    if (product.video) {
      const { video } = product;
      video.type = "video";
      return [...productGallery(product, selectedVariant), video];
    }
    return productGallery(product, selectedVariant);
  }, [dispatch, product, selectedVariant]);

  // HANDLE SELECT IMAGE
  const handleImageClick = (ind) => setSelectedImage(ind);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <Box width="100%">
      <Grid container>
        <Grid item md={1} xs={12} order={{ xs: 2, md: 1 }} mb={3}>
          <Box
            display="flex"
            flexDirection={{ xs: "row", md: "column" }}
            gap={1}
            mt={2}
            justifyContent="center"
            alignItems="center"
            overflow="auto"
          >
            {images?.map((image, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={64}
                height={64}
                minHeight={64}
                minWidth={64}
                bgcolor="white"
                border="1px solid"
                borderRadius="10px"
                ml={index === 0 ? "" : 0}
                sx={{ cursor: "pointer", position: "relative" }}
                onClick={() => handleImageClick(index)}
                mr={index === images?.length - 1 ? "" : ""}
                borderColor={
                  selectedImage === index ? "primary.main" : "grey.400"
                }
              >
                {image.type === "video" && (
                  <Box
                    sx={{
                      position: "absolute",
                      zIndex: 1,
                      color: "white",
                      background: "black",
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: "0.5",
                      borderRadius: 2,
                    }}
                  >
                    <PlayCircleOutlineIcon sx={{ fontSize: "35px" }} />
                  </Box>
                )}
                <Avatar
                  src={
                    image.type === "video"
                      ? getMediaPath(image?.thumbnail?.url)
                      : getMediaPath(image?.url)
                  }
                  variant="square"
                  sx={{ height: 40, position: "absolute" }}
                />
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item md={5} xs={12} order={{ xs: 1, md: 2 }}>
          <Box display="flex" justifyContent="center" p={1}>
            <Box position="relative">
              <Box
                position="absolute"
                top={10}
                right={10}
                display="flex"
                gap={1}
              >
                <IconButton onClick={() => handleToggleWishlist(!wishlist)}>
                  {wishlist ? (
                    <Favorite color="primary" fontSize="small" />
                  ) : (
                    <FavoriteBorder fontSize="small" color="primary" />
                  )}
                </IconButton>
              </Box>
              <Box border="1px solid #3399cc" borderRadius="10px" p={1}>
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
                        src={getMediaPath(badgeId?.image?.url || "")}
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
                {images?.length > 0 ? (
                  <>
                    {images[selectedImage].type === "video" ? (
                      <ReactPlayer
                        url={`${images[selectedImage].url}`}
                        width={400}
                        height={400}
                      />
                    ) : (
                      <Image
                        alt={""}
                        width={isMobile ? 300 : 400}
                        height={isMobile ? 300 : 400}
                        src={getMediaPath(images[selectedImage].url)}
                        sx={{
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </>
                ) : (
                  <Image
                    alt={product?.name}
                    width={isMobile ? 300 : 400}
                    height={isMobile ? 300 : 400}
                    src={PRODUCT_PLACEHOLDER}
                    sx={{
                      objectFit: "contain",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
          alignItems="center"
          order={3}
          sx={{ padding: "0 0 0 20px" }}
        >
          {type === "bundle" ? (
            
            <ProductBundleDetails
            setting={setting}
            product={product}
            setSelectedVariant={setSelectedVariant}
            selectedVariant={selectedVariant}
            />
          ) : (
            <ProductDetails
              setting={setting}
              product={product}
              setSelectedVariant={setSelectedVariant}
              selectedVariant={selectedVariant}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProductIntro;
