// import { Avatar, Box, Divider, Typography } from "@mui/material";
// import { FlexBetween } from "components/flex-box";
// import { Paragraph, Span, Tiny } from "components/Typography";
// import { currencyFormat } from "lib";
// import { refreshCart } from "../../../src/redux/action.js";
// import { useDispatch, useSelector } from "react-redux";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { findProductSalePrice, getMediaPath } from "lib";
// import Image from "../../components/BazaarImage.jsx"
// // import { H5, Paragraph, Tiny } from "components/Typography";



// const CheckoutSummary2 = () => {
//   const [couponMessage, setCouponMessage] = useState('');
//   const dispatch = useDispatch()
//   const cart = useSelector((state) => state?.shop?.cart);
//   const currency = useSelector((state) => state?.shop?.currency)
//   useEffect(() => {
//     dispatch(refreshCart())
//   }, [dispatch])

//   const salePrice = useCallback((cartItem) => {
//     return findProductSalePrice(cartItem);
//   }, [cart]);


//   const calculateTotal = () => {
//     var total = 0;
//     cart.products.map((x) => {
//       const salePrice = findProductSalePrice(x);
//       total += salePrice * x.quantity;
//     });

//     return total;
//   }

//   const totalPrice = useMemo(() => {
//     return calculateTotal();
//   }, [cart]);


//   const calculateDiscount = () => {
//     const total = calculateTotal();
//     let discount = 0
//     if (cart.couponId) {

//       if (cart?.couponId?.minimumSpend > total) {
//         setCouponMessage(`Your cart amount must be more then ${currencyFormat(cart.couponId.minimumSpend, currency)}!`);
//         discount = 0;
//       } else if (cart?.couponId?.maximumSpend < total) {
//         setCouponMessage(`Your cart amount must be less then ${currencyFormat(cart.couponId.maximumSpend, currency)}!`);

//         discount = 0;
//       } else {
//         if (cart?.couponId?.discountType == "percentage-discount") {
//           discount = total * cart.couponId.amount / 100


//         } else if (cart?.couponId?.discountType == "fixed-cart") {
//           discount = total - cart?.couponId?.amount;
//         }

//       }
//       return discount;
//     } else {
//       return discount = null;
//     }
//   }

//   const subTotalPrice = useMemo(() => {
//     // let subtotalAmount = 0;
//     // return subtotalAmount

//     return calculateTotal() - calculateDiscount()

//   }, [cart]);
//   const discountPrice = useMemo(() => {
//     return calculateDiscount();
//   }, [cart]);

//   const getVariationMedia = useCallback((variationId, productVariations) => {

//     if (variationId) {
//       const data = productVariations?.variations?.find((varId) => varId._id === variationId)
//       return getMediaPath(data?.image?.url)
//     } else {
//       return getMediaPath(productVariations?.image?.url)
//     }

//   }, [])

//   // return (
//   //   <Box>
//   //     <Paragraph color="secondary.900" fontWeight={700} mb={2}>
//   //       Your order
//   //     </Paragraph>

//   //     {cart.products?.map((item) => (<>
//   //       {console.log("finde check item", item)}
//   //       <FlexBetween mb={1.5} key={item.name}>
//   //         <Typography sx={{ display: "flex", alignItems: "center", gap: "10px" }} >
//   //           <Avatar
//   //             alt={item?.productId?.name}
//   //             src={getVariationMedia(item.variationId, item?.productId)}
//   //             sx={{
//   //               mx: 2,
//   //               width: 76,
//   //               height: 76,
//   //             }}
//   //           />
//   //           <Typography variant="body2" sx={{ display: "flex", flexDirection: "column" }}>
//   //             {item.productId?.name}

//   //             <Tiny color="grey.600">
//   //               {currencyFormat(salePrice(item), currency)} x {item.quantity}
//   //             </Tiny>

//   //             <Box
//   //               fontWeight={600}
//   //               fontSize="14px"
//   //               color="primary.main"
//   //               mt={0.5}
//   //             >
//   //               {currencyFormat(salePrice(item) * item.quantity, currency)}
//   //             </Box>
//   //           </Typography>
//   //           {/* {} */}
//   //         </Typography >
//   //         {/* <Paragraph>{currencyFormat(item.price)}</Paragraph> */}
//   //       </FlexBetween>
//   //     </>
//   //     ))}
//   //     <FlexBetween my={2} >
//   //       <Box
//   //         fontWeight={500}
//   //         fontSize="12px"
//   //         mt={0.5}
//   //         color="grey.600"
//   //       >
//   //         Discount : {currencyFormat(discountPrice, currency)}
//   //       </Box>
//   //       <Box
//   //         fontWeight={500}
//   //         fontSize="12px"
//   //         color="grey.600"
//   //         mt={0.5}
//   //       >Total: {currencyFormat(subTotalPrice, currency)}
//   //       </Box>
//   //     </FlexBetween>
//   //   </Box>
//   // );
//   return (
//     <Box>
//       <Typography variant="h6" gutterBottom>
//        Your Order
//         {/* {customerName} */}
//       </Typography>
//       <Typography variant="body2" gutterBottom>
//         {/* {deliveryAddress} */}
//       </Typography>
//       <Divider />
      
//       {/* <Typography variant="h6" gutterBottom>
//         You are paying for these items
//       </Typography> */}
      
//       {cart.products?.map((item) => (
//         <FlexBetween mb={1.5} key={item.name}>
//           <Avatar
//             alt={item?.productId?.name}
//             src={getVariationMedia(item.variationId, item?.productId)}
//             sx={{ width: 66, height: 66, marginRight: 2 }}
//           />
//           <Box>
//             <Typography variant="body1">{item.productId?.name}</Typography>
//             <Typography variant="body2" color="text.secondary">
//               {/* Estimated delivery by {item.estimatedDelivery} */}
//             </Typography>
//           </Box>
//         </FlexBetween>
//       ))}
      
//       <Divider />
      
//       <Typography variant="h6" gutterBottom>
//         Price Summary
//       </Typography>
      
//       <FlexBetween>
//         <Typography>Total MRP (Incl. of taxes)</Typography>
//         <Typography>{currencyFormat(totalPrice, currency)}</Typography>
//       </FlexBetween>
      
//       <FlexBetween>
//         {/* <Typography>Delivery Fee</Typography> */}
//         {/* <Typography color="success.main">FREE</Typography> */}
//       </FlexBetween>
      
//       <FlexBetween>
//         <Typography>Discount on MRP</Typography>
//         <Typography>- {currencyFormat(discountPrice, currency)}</Typography>
//       </FlexBetween>
      
//       <FlexBetween>
//         <Typography variant="h6">Final amount</Typography>
//         <Typography variant="h6">{currencyFormat(subTotalPrice, currency)}</Typography>
//       </FlexBetween>
      
//       {/* Add icons and payment methods here */}
//     </Box>
//   );

// };
// export default CheckoutSummary2;
import { Avatar, Box, Divider, Typography, TextField, Button } from "@mui/material";
import { FlexBetween } from "components/flex-box";
import { currencyFormat } from "lib";
import { refreshCart, removeCoupon } from "../../../src/redux/action.js";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { findProductSalePrice, getMediaPath } from "lib";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
const CheckoutSummary2 = () => {
  const [couponMessage, setCouponMessage] = useState('');
  const dispatch = useDispatch();
  const cart = useSelector((state) => state?.shop?.cart);
  const currency = useSelector((state) => state?.shop?.currency);

  useEffect(() => {
    dispatch(refreshCart());
  }, [dispatch]);

  const salePrice = useCallback((cartItem) => {
    return findProductSalePrice(cartItem);
  }, [cart]);

  const calculateTotal = () => {
    let total = 0;
    cart?.products?.map((x) => {
      const salePrice = findProductSalePrice(x);
      const addOnTotal = x?.addOnList?.reduce((sum, itm) => sum + itm?.salePrice, 0);
      total += (salePrice * x.quantity) +  (addOnTotal * x.quantity);
    });
    return total;
  };

  const totalPrice = useMemo(() => {
    return calculateTotal();
  }, [cart]);

  const calculateDiscount = () => {
    const total = calculateTotal();
    let discount = 0;
    if (cart.couponId) {
      if (cart?.couponId?.minimumSpend > total) {
        setCouponMessage(`Your cart amount must be more than ${currencyFormat(cart.couponId.minimumSpend, currency)}!`);
        discount = 0;
      } else if (cart?.couponId?.maximumSpend < total) {
        setCouponMessage(`Your cart amount must be less than ${currencyFormat(cart.couponId.maximumSpend, currency)}!`);
        discount = 0;
      } else {
        if (cart?.couponId?.discountType === "percentage-discount") {
          discount = total * cart.couponId.amount / 100;
        } else if (cart?.couponId?.discountType === "fixed-cart") {
          discount = cart?.couponId?.amount;
        }
      }
      return discount;
    } else {
      return discount;
    }
  };

  const subTotalPrice = useMemo(() => {
    return calculateTotal() - calculateDiscount();
  }, [cart]);

  const discountPrice = useMemo(() => {
    return calculateDiscount();
  }, [cart]);

  const getVariationMedia = useCallback((variationId, productVariations) => {
    if (variationId) {
      const data = productVariations?.variations?.find((varId) => varId._id === variationId);
      return getMediaPath(data?.image?.url);
    } else {
      return getMediaPath(productVariations?.image?.url);
    }
  }, []);

  const removeCouponCode = async () => {
    try {
      const removeCouponCode = await dispatch(removeCoupon());
      setCouponCode('')
      if (removeCouponCode?.status) {
        enqueueSnackbar(removeCouponCode?.message, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      console.error("Error removing coupon code:", error);
      enqueueSnackbar("Failed to remove coupon code", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
      });
    }
  };
  
  return (
    <Box sx={{ padding: 2, borderRadius: 1, backgroundColor: '#fff' }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />
      {cart.products?.map((item) => (
        <FlexBetween mb={1.5} key={item.name}>
          <Avatar
            alt={item?.productId?.name}
            src={getVariationMedia(item.variationId, item?.productId)}
            sx={{ width: 66, height: 66, marginRight: 2 }}
          />
          <Box>
            <Typography variant="body1">{item.productId?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {currencyFormat(salePrice(item), currency)} x {item.quantity}
            </Typography>
          </Box>
        </FlexBetween>
      ))}
      <Divider sx={{ my: 2 }} />
    
     
      <FlexBetween>
        <Typography variant="body2" fontWeight="700" color="primary.secondary">Subtotal:</Typography>
        <Typography variant="body1" fontWeight="700">{currencyFormat(subTotalPrice, currency)}</Typography>
      </FlexBetween>

      <FlexBetween>
        <Typography variant="body2" fontWeight="700">Discount: {discountPrice > 0 ? `(${coupon?.coupon?.code})` : ""}</Typography>
        <Typography variant="body2" color="error">- {currencyFormat(discountPrice, currency)}</Typography>
        {discountPrice > 0 ? < DeleteOutlineIcon sx={{ ml: 1, color: "red" }} onClick={(e) => removeCouponCode()} fontSize="small" /> : ""}
      </FlexBetween>

      <FlexBetween>
        <Typography variant="body2"  fontWeight="700">Total:</Typography>
        <Typography variant="body2"  fontWeight="700">{currencyFormat(totalPrice, currency)}</Typography>
      </FlexBetween>
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        placeholder="Coupon Code"
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 1 }}
      >
        Apply Coupon
      </Button>
    </Box>
  );
};

export default CheckoutSummary2;
