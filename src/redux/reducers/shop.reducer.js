import { createSlice } from "@reduxjs/toolkit";

var initialState = {
  brandsfilter: [],
  products: [],
  cart: {
    products: [],
  },
  addPayments: null,
  wishlistProducts: [],
  productcategory: [],
  appdata: [],
  staticCount: [],
  flashDealsProducts: [],
  categoriesProducts: [],
  topRattedProducts: [],
  newArrivalProducts: [],
  bigDiscountProducts: [],
  relatedProducts: [],
  updateSubject: [],
  countryCode: "in",
  currencies: [],
  currency: null,
  userDetails: [],
  applyCoupon: [],
  reedemPoints: 0
};

const updateProductInState = (products, updatedProduct) => {
  //products
  const productIndex = products.findIndex((x) => x.id == updatedProduct.id);
  if (productIndex != -1) {
    products[productIndex] = updatedProduct;
  }
};

const ShopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    updateCart: (state, action) => {
      state.cart = action.payload;
    },
    addPayment: (state, action) => {
      state.addPayments = action.payload;
    },

    updateStoreProducts: (state, action) => {
      state.products = action.payload;
    },

    updateWhishlistProducts: (state, action) => {
      state.wishlistProducts = action.payload;
    },
    
    removeWhishlistProducts: (state, action) => {
      state.wishlistProducts = {
        ...state.wishlistProducts,
        products: state.wishlistProducts?.products?.filter(
          (product) => product?._id !== action?.payload
        ),
      };
    },

    updateProduct: (state, action) => {
      const product = action.payload;
      updateProductInState(state.products, product);
      updateProductInState(state.flashDealsProducts, product);
      updateProductInState(state.categoriesProducts, product);
      updateProductInState(state.topRattedProducts, product);
      updateProductInState(state.newArrivalProducts, product);
      updateProductInState(state.bigDiscountProducts, product);
      updateProductInState(state.relatedProducts, product);
    },
    updateFlashDealsProducts: (state, action) => {
      state.flashDealsProducts = action.payload;
    },
    updateCategoriesProducts: (state, action) => {
      state.categoriesProducts = action.payload;
    },
    updateTopRattingProducts: (state, action) => {
      state.topRattedProducts = action.payload;
    },
    updateNewArrivalProducts: (state, action) => {
      state.newArrivalProducts = action.payload;
    },
    updateBigDiscountProducts: (state, action) => {
      state.bigDiscountProducts = action.payload;
    },
    updateRelatedProducts: (state, action) => {
      state.relatedProducts = action.payload;
    },

    productcategoryfilter: (state, action) => {
      state.productcategory = action.payload;
    },
    getbrandsfilter: (state, action) => {
      state.brandsfilter = action.payload;
    },
    productsCount: (state, action) => {
      state.productShopCount = action.payload;
    },
    getappdata: (state, action) => {
      state.appdata = action.payload;
    },

    getSubject: (state, action) => {
      state.updateSubject = action.payload;
    },
    staticCount: (state, action) => {
      state.appdata = action.payload;
    },
    getCountryCode: (state, action) => {
      state.countryCode = action.payload;
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setCurrencies: (state, action) => {
      state.currencies = action.payload;
    },
    getCurrency: (state, action) => {
      return state.currency;
    },
    getUserDetails: (state, action) => {
      state.userDetails = action.payload
    },
    getCouponDetails: (state, action) => {
      state.applyCoupon = action.payload
    },
    setReedemPoints: (state, action) => {
      state.reedemPoints = action.payload
    }
  },
});

export const {
  updateCart,
  addPayment,
  productcategoryfilter,
  updateWhishlistProducts,
  updateProduct,
  getbrandsfilter,
  updateBigDiscountProducts,
  updateRelatedProducts,
  updateStoreProducts,
  getappdata,
  updateFlashDealsProducts,
  updateCategoriesProducts,
  updateTopRattingProducts,
  updateNewArrivalProducts,
  removeWhishlistProducts,
  getPolicyPage,
  getSubject,
  productsCount,
  getCountryCod,
  setCountryCode,
  getCurrency,
  setCurrency,
  setCurrencies,
  getUserDetails,
  getCouponDetails,
  setReedemPoints
} = ShopSlice.actions;

export default ShopSlice.reducer;
