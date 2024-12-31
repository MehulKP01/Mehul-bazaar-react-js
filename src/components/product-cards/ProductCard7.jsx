import Link from "next/link";
import { Add, Close, Remove } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  styled,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Image from "components/BazaarImage";
import { Span } from "components/Typography";
import { FlexBox } from "components/flex-box";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useMemo, useState } from "react";
import { findProductSalePrice } from "lib";
import { currencyFormat, getMediaPath } from "lib";

// styled components
const Wrapper = styled(Paper)(({ theme }) => ({
  overflow: "visible",
  position: "relative",
  borderRadius: "10px",
  marginBottom: "1.5rem",
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
}));

// =========================================================

const ProductCard7 = ({ cartItem, onRemoveProduct, onChangeQuantity }) => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state?.shop?.currency);
  const salePrice = useMemo(() => findProductSalePrice(cartItem), [dispatch]);

  const addOnsTotalPrice = useMemo(() => {
    return cartItem?.addOnList?.reduce(
      (sum, itm) => sum + itm?.salePrice * cartItem.quantity,
      0
    );
  }, [cartItem]);

  const getVariationMedia = useCallback((variationId, productVariations) => {
    if (variationId) {
      const data = productVariations?.variations.find(
        (varId) => varId._id === variationId
      );
      return getMediaPath(data?.image?.url);
    } else {
      return getMediaPath(productVariations?.image?.url);
    }
  }, []);

  const [localQuantity, setLocalQuantity] = useState(cartItem?.quantity);
  const [loading, setLoading] = useState(false); // New loading state

  // Function to update quantity and trigger loading
  const updateQuantity = (newQuantity) => {
    setLoading(true); // Show loading when API call is in progress
    setLocalQuantity(newQuantity); // Optimistically update quantity

    onChangeQuantity(newQuantity).finally(() => {
      setLoading(false); // Remove loading after API completes
    });
  };

  // Handlers for incrementing and decrementing quantity
  const handleIncrement = () => updateQuantity(localQuantity + 1);
  const handleDecrement = () => {
    if (localQuantity > 1) {
      updateQuantity(localQuantity - 1);
    }
  };

  return (
    <Wrapper>
      {/* Close Icon */}
      <IconButton
        size="small"
        onClick={() => onRemoveProduct()}
        sx={{
          position: "absolute",
          right: 10,
          top: 10,
        }}
      >
        <Close fontSize="small" />
      </IconButton>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {/* Image */}
              <TableCell>
                <Image
                  alt={cartItem.productId.name}
                  width={80}
                  height={80}
                  display="block"
                  src={getVariationMedia(
                    cartItem.variationId,
                    cartItem?.productId
                  )}
                />
              </TableCell>

              {/* Name (Main Product and Add-ons) */}
              <TableCell>
                <FlexBox flexDirection="column">
                  {/* Main Product Name */}
                  <Link href={`/product/${cartItem.productId.slug}`}>
                  <Tooltip title= {cartItem.productId.name} arrow placement="top">

                    <Typography sx={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'100px'}} fontWeight="600" fontSize={18}  >
                      {cartItem.productId.name}
                    </Typography>
                  </Tooltip>
                  </Link>

                  {/* Add-ons Names */}
                  {cartItem?.addOnList?.map((itm) => (
                    <Typography
                      key={itm.id}
                      fontSize="14px"
                      color="textSecondary"
                      sx={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'100px'}}
                    >
                      {itm?.title}
                    </Typography>
                  ))}
                </FlexBox>
              </TableCell>

              {/* Price (Main Product and Add-ons) */}
              <TableCell>
                <FlexBox flexDirection="column">
                  {/* Main Product Price */}
                  <Span fontWeight="600" fontSize={16} color="grey.600">
                    {currencyFormat(salePrice, currency)}
                  </Span>

                  {/* Add-ons Prices */}
                  {cartItem?.addOnList?.map((itm) => (
                    <Typography key={itm.id} fontSize="14px" color="primary">
                      {currencyFormat(itm?.salePrice, currency)}
                    </Typography>
                  ))}
                </FlexBox>
              </TableCell>

              {/* Quantity */}
              <TableCell>
                <FlexBox alignItems="center">
                  <Button
                    color="primary"
                    sx={{ p: "5px" }}
                    variant="outlined"
                    onClick={handleDecrement}
                    // disabled={loading}
                  >
                    <Remove fontSize="small" />
                  </Button>

                  <Box mx={1} fontWeight={600} fontSize={15}>
                    {loading ? <CircularProgress size="1rem" /> : localQuantity}
                  </Box>

                  <Button
                    color="primary"
                    sx={{ p: "5px" }}
                    variant="outlined"
                    onClick={handleIncrement}
                  >
                    <Add fontSize="small" />
                  </Button>
                </FlexBox>
              </TableCell>

              {/* Total (Main Price + Add-ons) */}
              <TableCell>
                <Span fontWeight={600} color="primary.main">
                  {currencyFormat(
                    salePrice * cartItem.quantity + addOnsTotalPrice,
                    currency
                  )}
                </Span>
              </TableCell>
            </TableRow>

            {/* Grand Total Row */}
            {cartItem?.addOnList?.length > 0 && (
            <TableRow>
              <TableCell colSpan={4}>
                <Typography color="primary" fontWeight={600}>
                  Grand Total:
                </Typography>
              </TableCell>
              <TableCell>
                <Typography color="primary" fontWeight={600}>
                  {currencyFormat(
                    salePrice * cartItem.quantity + addOnsTotalPrice,
                    currency
                  )}
                </Typography>
              </TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  );
};

export default ProductCard7;
