import React, { lazy } from "react";
import { Add, Remove, Star } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { FlexBox } from "components/flex-box";
import { H2, H3, H6, H4 } from "components/Typography";
import {
    calculateDiscountPercentage,
    currencyFormat,
} from "lib";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addProductIntoCart,
    changeQuantityInCart,
} from "../../../src/redux/action";
const ShoppingCartOutlinedIcon = lazy(()=> import("@mui/icons-material/ShoppingCartOutlined"));
const ShoppingBagOutlinedIcon = lazy(()=> import("@mui/icons-material/ShoppingBagOutlined"));
import { useRouter } from "next/navigation";
import { displaySnackBar } from "common/snackBar";

// styled components

// =====================================================

// =====================================================

function ProductDialogDetails(props) {
    const dispatch = useDispatch();
    const { product } = props;
    const { averageRating, reviews } = product;
    const currency = useSelector((state) => state?.shop?.currency);

    const router = useRouter();

    const cart = useSelector((state) => state?.shop?.cart);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const initialVariant = useMemo(() => {
        if (!product?.variations) return null;
        return product?.variations?.find(
            (variation) =>
                variation.dimensions && variation.dimensions.length > 0
        );
    }, [product]);
    //state for variant

    const [selectedVariant, setSelectedVariant] = useState(initialVariant);

    useEffect(() => {
        props.setSelectVariant(selectedVariant);
    }, [selectedVariant, product]);

    const cartProduct = useMemo(() => {
        setIsLoading(false);
        return cart?.products?.find(
            (p) =>
                p.productId?._id == product?._id &&
                p?.variationId == selectedVariant?._id
        );
    }, [selectedVariant, cart]);

    useEffect(() => {
        if (initialVariant) {
            const initialAttributes = initialVariant.dimensions.reduce(
                (acc, dimension) => {
                    acc[dimension.attributeId] = dimension.attributeItemId;
                    return acc;
                },
                {}
            );
            setSelectedAttributes(initialAttributes);
        }
    }, [initialVariant]);

    const handleAddProductIntoCart1 = async (qty) => {
        setIsLoading(true);
        try {
            // Dispatch action to add product to cart
            const response = await dispatch(
                addProductIntoCart(
                    product?.id,
                    selectedVariant ? selectedVariant?._id : null,
                    qty
                )
            );
            // Show success message
            if (response?.status) {
                displaySnackBar(response?.message,"success","bottom","right")
            } else {
                displaySnackBar(response?.message,"warning","bottom","right")
            }
        } catch (error) {
            // Handle error
            setIsLoading(false);
            displaySnackBar("Failed to add product to cart","error","bottom","right")
        }
    };

    const handleGoToCart = () => {
        router.push("/cart")
    }

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
            const message = response?.message || "An unexpected error occurred.";
            if (response?.status) {
            displaySnackBar(message,"success","bottom","right")
                router.push("/checkout"); // Redirect to checkout page
            } else {
            displaySnackBar(message,"error","bottom","right")
            }
        }
    };

    const handleChangeQtyCart1 = async (qty) => {
        setIsLoading(true);
        try {
            if (cartProduct) {
                // Dispatch action to change quantity in cart
                const response = await dispatch(
                    changeQuantityInCart(cartProduct?._id, qty)
                );
                // Show success message
                if (response?.status) {
                    displaySnackBar(response?.message,"success","bottom","right")
                } else {
                    displaySnackBar(response?.message,"error","bottom","right")
                }
            } else {
                displaySnackBar("No product found in cart","error","bottom","right")
            }
        } catch (error) {
            setIsLoading(false);
            displaySnackBar("Failed to update quantity","error","bottom","right")
        }
    };
    const isAttItemSelected = useCallback(
        (attId, attItemId) => {
            return checkAttSelected(attId, attItemId);
        },
        [selectedVariant]
    );

    const isAttributeItemSelected = (attItemId) =>
        product?.variations?.some((varitaion) =>
            varitaion?.dimensions?.some(
                (dim) => dim?.attributeItemId === attItemId
            )
        );
    const onAttItemChange = (attId, attItemId) => {
        setSelectedAttributes((prev) => {
            const updatedAttributes = {
                ...prev,
                [attId]: attItemId,
            };

            const updatedVariant = product?.variations?.find(
                (variation) =>
                    variation?.dimensions?.length > 0 &&
                    variation?.dimensions?.every(
                        (dimension) =>
                            updatedAttributes[dimension.attributeId] ===
                            dimension.attributeItemId
                    )
            );
            setSelectedVariant(updatedVariant);
            return updatedAttributes;
        });
    };

    const checkAttSelected = (attId, attItemId) => {
        return selectedVariant
            ? selectedVariant?.dimensions?.find(
                (x) =>
                    x?.attributeId == attId && x?.attributeItemId == attItemId
            )
            : false;
    };
    const findAttItems = (att) => {
        return att?.items;
    };
    const attItems = useCallback(
        (att) => {
            //return [];
            return findAttItems(att);
        },
        [dispatch]
    );

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

    const getStockColor = (stockLevel) => {
        if (stockLevel <= 0) {
            return "red";
        } else {
            return "green";
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

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    const productName = useMemo(() => {
        if (product.type === "variation" && selectedVariant && product?.attributes) {
            return selectedVariant?.title;
        }
        return product.name;
    }, [product, selectedVariant]);

    return (
        <>
            <H3 mb={1}>{productName}</H3>
            <FlexBox alignItems="center" mb={1} gap={1}>
                <Box>Brand:</Box>{" "}
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
                        {averageRating || "0"}
                    </Typography>
                    <Star fontSize="20px" sx={{ color: "primary.main" }} />
                </Box>
                <Box mx={0.5} color="grey.600" alignItems="center">
                    |
                </Box>
                <Box mx={1} lineHeight={1} fontSize="small">
                    <Typography
                        variant="body2"
                        component="span"
                        color="grey.600"
                    >
                        {`${reviews || 0} Ratings`}
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
                    {product.type === "simple" ? null : (
                        <H6>
                            {currencyFormat(minToMaxPrice?.min, currency)} -{" "}
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
                            <H4
                                color="grey.600"
                                fontWeight="600"
                                mb={0.5}
                                lineHeight="1"
                            >
                                MRP{" "}
                                <del>
                                    {currencyFormat(regularPrice, currency)}
                                </del>
                            </H4>
                            <H4
                                color="primary.secondary"
                                fontWeight="600"
                                mb={0.5}
                                lineHeight="1"
                            >
                                (
                                {calculateDiscountPercentage(
                                    salePrice,
                                    regularPrice,
                                    currency
                                )}
                                % OFF)
                            </H4>{" "}
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
                product?.attributes?.map((att, index) => (
                    <>
                        <Box key={`${att?.id}-${index}`} mb={2}>
                            <H6 mb={1}>{att?.name}</H6>
                            {attItems(att)?.map((attItem) => (
                                <>
                                    {isAttributeItemSelected(attItem?._id) && (
                                        <Chip
                                            label={attItem?.name}
                                            onClick={(e) => {
                                                onAttItemChange(
                                                    att?._id,
                                                    attItem?._id
                                                );
                                            }}
                                            sx={{
                                                borderRadius: "4px",
                                                mr: 1,
                                                mb: 0,
                                                cursor: "pointer",
                                            }}
                                            color={
                                                isAttItemSelected(
                                                    att?._id,
                                                    attItem?._id
                                                )
                                                    ? "primary"
                                                    : "default"
                                            }
                                        />
                                    )}
                                </>
                            ))}
                        </Box>
                    </>
                ))}

            <Box pt={0} mb={2} mt={2} color={getStockColor(
                product?.type === "simple" ? product?.stock : (selectedVariant?.stock ?? 0) )}>
                {product?.type === "simple"
                    ? (product?.stock > 0 ? "In Stock" : "Out of Stock")
                    : (selectedVariant?.stock > 0 ? "In Stock" : "Out of Stock")}
            </Box>
            {!cartProduct ? (
                <FlexBox gap={1}

                    sx={{ flexWrap: 'wrap' }}

                >
                    <Button
                        color="primary"
                        size="large"
                        variant="contained"
                        onClick={() => handleAddProductIntoCart1(1)}
                        sx={{
                            height: 50,
                            color: "white",
                            px: isMobile ? "1rem" : "1.9rem",
                        }}
                        disabled={
                            isLoading ||
                            product?.type === "simple" && product?.stock <= 0 ||
                            (product?.type === "variation" && (!selectedVariant || selectedVariant?.stock <= 0))
                        }
                    >
                        {isLoading ? (
                            <CircularProgress
                                sx={{ color: "#fff" }}
                                size="1rem"
                            />
                        ) : (
                            <Button

                                sx={{
                                    fontSize: isMobile ? '0.8rem' : '0.8rem',
                                    minWidth: isMobile ? 'auto' : '150px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignItems: "center",
                                    gap: '4px',
                                }}
                            >
                                <ShoppingCartOutlinedIcon sx={{ fontSize: isMobile ? '1.2rem' : '1.8rem' }} />
                                <Typography sx={{ fontSize: isMobile ? '0.7rem' : '1rem', fontWeight: 'bold' }}>
                                    Add to Cart
                                </Typography>
                            </Button>
                        )}
                    </Button>
                    <Button
                        borderColor="primary"
                        variant="outlined"
                        onClick={handleBuyNow}
                        sx={{
                            px: "3rem",
                            px: isMobile ? ".5rem" : "3rem",
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
                            product?.type === "simple" && product?.stock <= 0 ||
                            (product?.type === "variation" && (!selectedVariant || selectedVariant?.stock <= 0))
                        }
                    >
                        <ShoppingBagOutlinedIcon />
                        Buy Now
                    </Button>
                </FlexBox>
            ) : (
            <>
                <FlexBox alignItems="center"
                >
                    <Button
                        size="small"
                        variant="outlined"
                        sx={{
                            p: ".6rem",
                            height: 45,
                        }}
                        onClick={(e) =>
                            handleChangeQtyCart1(
                                (cartProduct?.quantity ?? 0) - 1
                            )
                        }
                    >
                        <Remove fontSize="small" />
                    </Button>

                    <H3 fontWeight="600" mx={2.5}>
                        {isLoading ? (
                            <CircularProgress size="1rem" />
                        ) : (
                            cartProduct?.quantity.toString().padStart(2, "0")
                        )}
                    </H3>


                    <Button
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{
                            p: ".6rem",
                            height: 45,
                        }}
                        onClick={(e) =>
                            handleChangeQtyCart1(
                                (cartProduct?.quantity ?? 0) + 1
                            )
                        }
                    >
                        <Add fontSize="small" />
                    </Button>
                </FlexBox>

                <FlexBox gap={1} sx={{ flexWrap: 'wrap' }}                 >
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={(e) => handleGoToCart(1)}
                        sx={{
                            mb: isMobile ? "1rem" : "4.5rem",
                            mt: isMobile ? 2 : 1,
                            px: "3rem",
                            height: 50,
                        }}
                        sm={6}
                        md={4}
                        disabled={
                            isLoading ||
                            product?.type === "simple" && product?.stock <= 0 ||
                            (product?.type === "variation" && (!selectedVariant || selectedVariant?.stock <= 0))
                        }
                    >
                        {isLoading ? (
                            <CircularProgress
                                sx={{ color: "#fff" }}
                                size="1rem"
                            />
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
                            mt: isMobile ? 1 : 1,
                            px: isMobile ? "3.3rem" : "3rem",
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
                            product?.type === "simple" && product?.stock <= 0 ||
                            (product?.type === "variation" && (!selectedVariant || selectedVariant?.stock <= 0))
                        }
                    >
                        <ShoppingBagOutlinedIcon />
                        Buy Now
                    </Button>
                </FlexBox>

            </>
            )}
        </>
    );
}

export default ProductDialogDetails;
