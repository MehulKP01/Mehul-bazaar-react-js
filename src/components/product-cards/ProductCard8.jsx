
import { Box, styled, IconButton, Typography, Chip } from "@mui/material";
import { H3, H5, Span, H6 } from "components/Typography";
import HoverBox from "components/HoverBox";
import { Favorite, RemoveRedEye } from "@mui/icons-material";
import LazyImage from "components/LazyImage";
import BazaarCard from "components/BazaarCard";
import { H4, Small } from "components/Typography";
import BazaarRating from "components/BazaarRating";
import { FlexRowCenter, FlexBox } from "components/flex-box";
import { currencyFormat, getMediaPath } from "lib";
import { useCallback, useMemo, useState } from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ProductViewDialog from "components/products/ProductViewDialog";
import { addToWishList, removeFromWishlist } from "../../redux/action";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { displaySnackBar } from "common/snackBar";

// ======================================================
const StyledBazaarCard = styled(BazaarCard)({
    margin: "auto ",
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
// ======================================================

const ProductCard8 = (props) => {
    const { product } = props;
    const { id, slug, title, name, regularPrice, image, discount, averageRating, type,badgeId	 } = product;
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    const [isWishlist, setIsWishlist] = useState(product?.isInWishlist);

    const currency = useSelector((state) => state?.shop?.currency);
    const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);
    const router = useRouter();

    const handleToggleWishlist = async (productId, val) => {
        if (val) {
            const data = await removeFromWishlist(id);
            setIsWishlist(!isWishlist);
            displaySnackBar(data?.message,data.status ? "success" : "error")
        } else {
            const data = await addToWishList(id);
            setIsWishlist(!isWishlist);
            displaySnackBar(data?.message,data.status ? "success" : "error")
        }
    };
    const onProductView = () => {
        router.push({
            pathname: `/product/${slug}`,
        });
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
        <StyledBazaarCard>
            <Box>
            {badgeId && (
                               
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top:
                                                badgeId?.place ===
                                                    "top-left" ||
                                                badgeId?.place ===
                                                    "top-right"
                                                    ? badgeId?.position?.top
                                                    : null,
                                            left:
                                                badgeId?.place ===
                                                    "top-left" ||
                                                badgeId?.place ===
                                                    "bottom-left"
                                                    ? badgeId?.position?.left
                                                    : null,
                                            right:
                                                badgeId?.place ===
                                                    "top-right" ||
                                                badgeId?.place ===
                                                    "bottom-right"
                                                    ? badgeId?.position?.right
                                                    : null,
                                            bottom:
                                                badgeId?.place ===
                                                    "bottom-right" ||
                                                badgeId?.place ===
                                                    "bottom-left"
                                                    ? badgeId?.position?.bottom
                                                    : null,
                                        }}
                                    >
                                        {badgeId && badgeId?.image && (
                                            <img
                                                src={getMediaPath(
                                                    badgeId?.image?.url ??""
                                                )}
                                                alt="Selected Image"
                                                style={{
                                                    width:
                                                        badgeId?.size * 100??0,
                                                    aspectRatio: "1",
                                                    objectFit: "contain",
                                                }}
                                            />
                                        )}
                                    </Box>
                            )}
                <HoverIconWrapper className="hover-box">
                    <IconButton onClick={toggleDialog}>
                        <RemoveRedEye color="disabled" fontSize="small" />
                    </IconButton>

                    <IconButton onClick={() => handleToggleWishlist(id, isWishlist)}>
                        {isWishlist ? (
                            <Favorite color="primary" fontSize="small" />
                        ) : (
                            <FavoriteBorder fontSize="small" color="primary" />
                        )}
                    </IconButton>
                </HoverIconWrapper>

                <Box onClick={() => router.push(`/product/${slug}`)}>
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
                        <HoverBox mb={2} mx="auto" borderRadius={2}>
                   
                            <LazyImage
                                alt={title}
                                width={380}
                                height={380}
                                src={getMediaPath(image?.url)}
                                style={{
                                    objectFit: "contain",
                                    objectPosition: "center center",
                                }}
                            />
                        </HoverBox>
                    </Box>
                </Box>

                <ProductViewDialog openDialog={openModal} handleCloseDialog={toggleDialog} product={product} />

                <FlexRowCenter mb={1} gap={0.5}>
                    <BazaarRating size="small" value={averageRating} color="warn" readOnly />
                    <Small fontWeight={600}>({product?.reviews ? product?.reviews : 0})</Small>
                </FlexRowCenter>

                <H4 fontSize={14} textAlign="center" mb={1} title={title} ellipsis>
                    {name}
                </H4>

                <FlexBox justifyContent="center" alignItems="center" gap={1} color="primary.main" fontWeight="600" mb={2}>
                    <H5>{currencyFormat(minToMaxPrice?.min, currency)}</H5>
                    
                    <Box>
                        <Typography variant="body2" color="grey.600" fontWeight="600" lineHeight="1">
                            <del>{currencyFormat(regularPrice, currency)}</del>
                        </Typography>
                    </Box>

                </FlexBox>
                <FlexBox>
                    {minToMaxPrice.min !== null && minToMaxPrice.max !== null && (
                        <FlexBox alignItems="center" gap={1} mt={0.5}>
                            <Box fontWeight="600" color="primary.main">
                                {/* {currencyFormat(minToMaxPrice.min, currency)}    */}
                                {/* {minToMaxPrice.min !== minToMaxPrice.max && ` - ${currencyFormat(minToMaxPrice.max, currency)}`} */}
                            </Box>
                        </FlexBox>
                    )}
                </FlexBox>
            </Box>
        </StyledBazaarCard>
    );
};

export default ProductCard8;

