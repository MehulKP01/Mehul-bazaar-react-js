import { createSlice } from "@reduxjs/toolkit";

var initialState = {
  loading: true,
  cartItem: null
};

const addToCartSlice = createSlice({
  name: "addcart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      switch (action.type) {
        case "CHANGE_CART_AMOUNT":
          let cartList = state.cart;
          let cartItem = action.payload;
          let exist = cartList.find((item) => item.id === cartItem.id);
            // console.log(exist)  
    
          if (cartItem.qty < 1) {
            const filteredCart = cartList.filter((item) => item.id !== cartItem.id);
            return {
              ...state,
              cart: filteredCart,
            };
          }
    
          // IF PRODUCT ALREADY EXITS IN CART
          if (exist) {
            const newCart = cartList.map((item) =>
              item.id === cartItem.id
                ? {
                    ...item,
                    qty: cartItem.qty,
                  }
                : item
            );
            return {
              ...state,
              cart: newCart,
            };
          }
          return {
            ...state,
            cart: [...cartList, cartItem],
          };
        default: {
          return state;
        }
      }

      // const item = action.payload
      // const existItem = state.cartItem.find((x) => x.id === item.id)
      // if(existItem){
      // }else{
      //   state.cartItem = [...state.cartItem, item]
      // }
    },
    ChangeCart: (state, action) => {
      console.warn("action-=-=-=-=-", action);
      state.cartItem = action.payload
     },
    
  },
});

export const { addToCart, ChangeCart} =
  addToCartSlice.actions;

export default addToCartSlice.reducer;
