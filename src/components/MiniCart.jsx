import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";

import { Add, Clear, Close, Remove } from "@mui/icons-material";
const LazyImage = lazy(()=> import("components/LazyImage"));
import { FlexBetween, FlexBox } from "components/flex-box";
import { H5, Paragraph, Tiny } from "components/Typography";
import CartBag from "components/icons/CartBag";
import { currencyFormat, getMediaPath } from "lib";
import React, { lazy, memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeQuantityInCart,
  refreshCart,
  removeProductFromCart,
} from "../redux/action.js";
import { findProductSalePrice } from "lib";
import { Tooltip } from "@material-ui/core";
import { displaySnackBar } from "common/snackBar.js";

// =========================================================

const MiniCart = ({ toggleSidenav }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.shop?.cart);
  
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState();
  const currency = useSelector((state) => state?.shop?.currency);
  const { push } = useRouter();
  const { palette } = useTheme();

  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch]);

  const handleRemoveProductFromCart = async (productItemId) => {

    const response = await dispatch(removeProductFromCart(productItemId));
    if (response?.status) {
      displaySnackBar(response?.message, "success", "bottom", "left");
    } else {
      displaySnackBar(response?.message, "error", "bottom", "left");
    }
  };

  const handleChangeQtyCart = async (productItemId, qty) => {
    setIsLoading(true);
    setProductId(productItemId);
    const response = await dispatch(changeQuantityInCart(productItemId, qty));
    if (response?.status) {
      displaySnackBar(response?.message, "success", "bottom", "left");
    } else {
      displaySnackBar(response?.message, "error", "bottom", "left");
    }
  };

  const salePrice = useCallback(
    (cartItem) => {
      return findProductSalePrice(cartItem);
    },
    [cart]
  );

  const getVariationMedia = useCallback((variationId, productVariations) => {
    if (variationId) {
      const data = productVariations?.variations?.find(
        (varId) => varId?._id === variationId
      );
      return getMediaPath(data?.image?.url);
    } else {
      return getMediaPath(productVariations?.image?.url);
    }
  }, []);

  const totalPrice = useMemo(() => {
    setIsLoading(false);
    var total = 0;
    cart?.products?.map((x) => {
      const salePrice = findProductSalePrice(x);
      const addOnTotal = x?.addOnList?.reduce(
        (sum, itm) => sum + itm?.salePrice,
        0
      );
      total += salePrice * x.quantity + addOnTotal * x.quantity;
    });
    return total;
  }, [cart]);

  const handleNavigate = (path) => () => {
    toggleSidenav();
    push(path);
  };

  // tooltip
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Box width="100%" maxWidth={380}>
      <Box
        overflow="auto"
        height={`calc(100vh - ${
          !!cart?.products?.length ? "80px - 3.25rem" : "0px"
        })`}
      >
        <FlexBetween mx={3} height={74}>
          <FlexBox gap={1} alignItems="center" color="secondary.main">
            <CartBag color="inherit" />
            <Paragraph lineHeight={0} fontWeight={600}>
              {cart?.products?.length} item
            </Paragraph>
          </FlexBox>

          <IconButton onClick={toggleSidenav}>
            <Clear />
          </IconButton>
        </FlexBetween>

        <Divider />

        {cart?.products?.length <= 0 && (
          <Box>
            <FlexBox
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
              height="calc(100% - 74px)"
            >
              <LazyImage
                width={90}
                height={100}
                alt="banner"
                src="/assets/images/logos/shopping-bag.svg"
              />
              <Box
                component="p"
                mt={2}
                color="grey.600"
                textAlign="center"
                maxWidth="200px"
              >
                Your shopping bag is empty. Start shopping
              </Box>
            </FlexBox>
          </Box>
        )}

        {cart?.products?.map((item) => (
          <FlexBox
            py={2}
            px={2.5}
            key={item?._id}
            position="relative"
            alignItems="center"
            borderBottom={`1px solid ${palette?.divider}`}
          >
            <IconButton
              size="small"
              onClick={() => handleRemoveProductFromCart(item?._id)}
              sx={{
                position: "absolute", // Position absolute for the Close button
                top: "10px",
                right: "30px", // Top-right corner
              }}
            >
              <Close fontSize="small" />
            </IconButton>

            <FlexBox alignItems="center" flexDirection="column">
              <Button
                color="primary"
                variant="outlined"
                onClick={(e) =>
                  handleChangeQtyCart(item?._id, item?.quantity + 1)
                }
                sx={{
                  height: "28px",
                  width: "28px",
                  borderRadius: "300px",
                }}
              >
                <Add fontSize="small" />
              </Button>

              <Box fontWeight={600} fontSize="15px" my="3px">
                {isLoading && productId === item?._id ? (
                  <CircularProgress size="1rem" />
                ) : (
                  item?.quantity
                )}
              </Box>

              <Button
                color="primary"
                variant="outlined"
                disabled={item?.quantity === 0}
                onClick={(e) =>
                  handleChangeQtyCart(item?._id, item?.quantity - 1)
                }
                sx={{
                  height: "30px",
                  width: "30px",
                  borderRadius: "300px",
                }}
              >
                <Remove fontSize="small" />
              </Button>
            </FlexBox>

            <FlexBox flexDirection="column" ml={1}>
              <FlexBox>
                <Link href={`/product/${item?.productId?.slug}`}>
                  <Avatar
                    alt={item?.productId?.name}
                    src={getVariationMedia(item?.variationId, item?.productId)}
                    sx={{
                      mx: 0,
                      width: 50,
                      height: 50,
                    }}
                  />
                </Link>

                <Box
                  flex="1"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Link href={`/product/${item?.productId?.slug}`}>
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "100px",
                          fontWeight: 600,
                        }}
                        fontSize="12px"
                        className="title"
                        title={item?.productId?.name}
                      >
                        {item?.productId?.name}
                      </Typography>
                  </Link>

                  <FlexBox alignItems="center" mt={0.5} gap={2}>
                    <Tiny color="grey.600">
                      {currencyFormat(salePrice(item), currency)} x
                      {item?.quantity}
                    </Tiny>

                    <Box fontWeight={600} fontSize="12px" color="primary.main">
                      {currencyFormat(
                        salePrice(item) * item?.quantity,
                        currency
                      )}
                    </Box>
                  </FlexBox>
                </Box>
              </FlexBox>

              {item?.addOnList?.map((itm) => (
                <FlexBox
                  key={itm.id}
                  alignItems="center"
                  justifyContent="space-between"
                  gap={2}
                  mt={0.5}
                >
                  <Avatar
                    alt={itm?.title}
                    src={getVariationMedia("", itm)}
                    sx={{
                      mx: 0,
                      width: 30,
                      height: 30,
                    }}
                  />
                  <Tooltip
                    open={open}
                    onClose={handleClose}
                    onOpen={handleOpen}
                    title={itm?.title}
                    arrow
                  >
                    <Typography
                      fontSize="12px"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100px",
                      }}
                      fontWeight={600}
                    >
                      {itm?.title}
                    </Typography>
                  </Tooltip>
                  <Typography
                    fontWeight={600}
                    fontSize="12px"
                    color="primary.main"
                  >
                    {currencyFormat(itm?.salePrice, currency)}
                  </Typography>
                </FlexBox>
              ))}

              <Divider />

              {item?.addOnList?.length > 0 && (
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Typography color="primary">
                    Grand Total:
                    <strong>
                      {currencyFormat(
                        (salePrice(item) +
                          item?.addOnList?.reduce(
                            (sum, itm) => sum + itm?.salePrice,
                            0
                          )) *
                          item?.quantity,
                        currency
                      )}
                    </strong>
                  </Typography>
                </Box>
              )}
            </FlexBox>
          </FlexBox>
        ))}
      </Box>

      {cart.products.length > 0 && (
        <Box p={2.5}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mb: "0.75rem",
              height: "40px",
              color: "white",
              bgcolor: "#3399cc",
              "&:hover": {
                backgroundColor: "#3399cc",
              },
            }}
            onClick={handleNavigate("/checkout")}
          >
            Checkout Now ({currencyFormat(totalPrice, currency)})
          </Button>

          <Button
            fullWidth
            color="primary"
            variant="outlined"
            sx={{
              height: 40,
            }}
            onClick={handleNavigate("/cart")}
          >
            View Cart
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default memo(MiniCart);
