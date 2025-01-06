import { setAddress, usereditaddress } from "./reducers/user.reducer";
import {
    updateWhishlistProducts,
    updateBigDiscountProducts,
    getappdata,
    updateNewArrivalProducts,
    updateRelatedProducts,
    getbrandsfilter,
    updateStoreProducts,
    productcategoryfilter,
    updateCart,
    updateFlashDealsProducts,
    updateCategoriesProducts,
    updateTopRattingProducts,
    productsCount,
    getSubject,
    getCouponDetails,
} from "./reducers/shop.reducer";
import { api } from "../utils/axiosInstance";
import { getCookie, setCookie } from "cookies-next";
const refreshCart = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.get("order/cart");
            if (data.status) {
                dispatch(updateCart(data.cart));
            } else {
                dispatch(
                    updateCart({
                        products: [],
                    })
                );
            }
        } catch (e) {
            console.log("refreshCart: Error:", e);
        }
    };
};

const addGuestUser = async () => {
    const token = getCookie("auth-token");
    if (!token) {
        try {
            const { data } = await api.post("auth/guest/login");
            if (data.status) {
                setCookie("auth-token", data.token);
                setCookie("is-guest", data.user.role === "guest");
                setCookie("user-id", data.user.id);
                setCookie("guest-id", data.user.id);
                setCookie("user", data.user);
            }
        } catch (error) {
            console.error("Failed to create guest account:", error);
        }
    }
};

const addProductIntoCart = (productId, variationId, quantity, addonList) => {
    return async (dispatch) => {
        const guest = await addGuestUser();
        try {
            const token = getCookie("auth-token");
            if (token) {
                const { data } = await api.post("order/cart/add-product", {
                    type:"product",
                    product_id: productId,
                    variation_id: variationId ? variationId : null,
                    quantity: quantity,
                    addonList:addonList ?? []
                });
                if (data.status) {
                    dispatch(refreshCart());
                }
                return data;
            }
        } catch (e) {
            console.log("addProductIntoCart: Error:", e);
        }
    };
};

const removeProductFromCart = (productItemId) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("order/cart/remove-product", {
                product_item_id: productItemId,
            });
            if (data.status) {
                dispatch(refreshCart());
            }
            return data;
        } catch (e) {
            console.log("removeProductFromCart: Error:", e);
        }
    };
};

const changeQuantityInCart = (productItemId, quantity) => {
    return async (dispatch) => {
        const guest = await addGuestUser();
        try {
            const { data } = await api.post(
                "order/cart/change-product-quantity",
                {
                    product_item_id: productItemId,
                    quantity: quantity,
                }
            );
            if (data.status) {
                dispatch(refreshCart());
            }
            return data;
        } catch (e) {
            console.log("addProductIntoCart: Error:", e);
        }
    };
};

const applyCoupon = (code) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("order/cart/apply-coupon", {
                coupon_code: code,
            });
            dispatch(getCouponDetails(data));
            dispatch(refreshCart());
            return data;
        } catch (e) {
            console.log("applyCoupon: Error:", e);
        }
    };
};
const removeCoupon = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("order/cart/remove-coupon");

            if (data.status) {
                dispatch(refreshCart());
                return data;
            }
        } catch (e) {
            console.log("removeCoupon: Error:", e);
        }
    };
};

const getAddresses = (AddressPayload) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("user/address/all", {
                ...AddressPayload,
            });
            if (data.status) {
                dispatch(setAddress(data.addresses));
                return data;
            }
        } catch (e) {
            console.log("getAddresses: Error:", e);
        }
    };
};
const getUserEditAddresses = (addressEditID) => {
    return async (dispatch) => {
        try {
            const { data } = await api.get(`user/address/${addressEditID}`);
            if (data?.status) {
                dispatch(usereditaddress(data.address));
                return data?.address;
            } else {
                dispatch(getAddresses());
            }
        } catch (e) {
            console.log("getUserEditAddresses: Error:", e);
        }
    };
};

const getWishlistProducts = ({ limit, page }) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/wishlist/all", {
                limit,
                page,
            });
            if (data.success) {
                dispatch(updateWhishlistProducts(data));
            }
        } catch (e) {
            console.log("getWishlistProducts: Error:", e);
        }
    };
};

const addToWishList = async (productId) => {
    const guest = await addGuestUser();

    try {
        const { data } = await api.post("product/wishlist/add", {
            product_id: productId,
        });
        return data;
    } catch (e) {
        console.log("addToWishList: Error:", e);
        return null;
    }
};

const removeFromWishlist = async (productId) => {
    try {
        const { data } = await api.post("product/wishlist/remove", {
            product_id: productId,
        });

        return data;
    } catch (e) {
        console.log("removeFromWishlist: Error:", e);
        return null;
    }
};

const addPayments = (payDetails) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/add-payment", payDetails);
            if (data?.status) {
                dispatch(setAddress(data?.addresses));
                return data?.addresses;
            } else {
                dispatch(setAddress({ addresses: [] }));
            }
        } catch (e) {
            console.log("addPayments: Error:", e);
        }
    };
};
const getCurrencyData = async (countryCode) => {
    try {
        const { data } = await api.post("app/currencies", {
            country_code: countryCode.toUpperCase(),
        });
        if (data?.status) {
            return data?.currencies;
        } else {
            return [];
        }
    } catch (e) {
        console.log("getCurrencyData Error:", e);
        return [];
    }
};
const selectAddresses = (id) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("order/cart/change-address", {
                address_id: id,
            });
            if (data.status) {
                dispatch(refreshCart());
                return data?.addresses;
            }
        } catch (e) {
            console.log("selectAddresses: Error:", e);
        }
    };
};

const addNewAddress = (newAddresses) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("user/address/add", {
                ...newAddresses,
            });
            if (data.status) {
                dispatch(getAddresses());
            }
            return data;
        } catch (e) {
            console.log("addAddress: Error:", e);
        }
    };
};

const setEditAddress = (updateAddressData) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("user/address/save", {
                ...updateAddressData,
            });
            if (data.status) {
                dispatch(getAddresses());
                return data;
            }
        } catch (e) {
            console.log("setEditAddress: Error:", e);
        }
    };
};
const setDeleteAddress = (id) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("user/address/delete", {
                address_id: id,
            });
            if (data.status) {
                dispatch(getAddresses());
                return data;
            }
        } catch (e) {
            console.log("setDeleteAddress: Error:", e);
        }
    };
};

const verifyPayment = async (orderData) => {
    try {
        const { data } = await api.post(
            "order/razorpay-verification",
            orderData
        );
        return data;
    } catch (e) {
        console.log("verifyPayment: Error:", e);
        return null;
    }
};

const placedOrder = (orderData) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("order/place", orderData );

            dispatch(refreshCart());
            return data;
        } catch (e) {
            console.log("placedOrder: Error:", e);
        }
    };
};

const getAllOrders = ({ limit, page }) => {
    return async () => {
        try {
            const { data } = await api.post("order/all", {
                limit,
                page,
            });
            if (data.status) {
                return data;
            }
        } catch (e) {
            console.log("getAllOrders: Error:", e);
        }
    };
};

const getOrdersById = (id) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post(`order/${id}`);
            if (data.status) {
                return data;
            }
        } catch (e) {
            console.log("getOrdersById: Error:", e);
        }
    };
};
const getproductcategory = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/category/all");
            if (data.status) {
                dispatch(productcategoryfilter(data));
                return data;
            }
        } catch (e) {
            console.log("getproductcategory: Error:", e);
        }
    };
};
const getbrandfilterall = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.get("app/all-brands");
            if (data.status) {
                dispatch(getbrandsfilter(data));
                return data;
            }
        } catch (e) {
            console.log("getbrandfilterall: Error:", e);
        }
    };
};
const orderLengthCount = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("/order/statistics");
            return data;
        } catch (e) {
            console.log("orderLengthCount: Error:", e);
        }
    };
};
const getAllFleshDeal = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/featured");
            if (data && data.status) {
                dispatch(updateFlashDealsProducts(data.products));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
};

const getAllCategory = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/category/all");
            if (data && data.status) {
                dispatch(updateCategoriesProducts(data.categories));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
};
const getAllTopRating = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/top-rating");
            if (data && data.status) {
                dispatch(updateTopRattingProducts(data.products));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
};
const getAllNewArrival = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.get("app/get-last-ten-products");
            dispatch(updateNewArrivalProducts(data.data));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
};
const getAllBigDiscounts = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/top-discounted");
            if (data && data.status) {
                dispatch(updateBigDiscountProducts(data.result));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
};
const getAllRelatedProducts = (payload) => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("product/relatedProducts", {
                product_id: payload.product_id,
                limit: payload.limit,
            });
            if (data.status) {
                dispatch(updateRelatedProducts(data.products));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
};

const getAllProducts = (payLoad) => {
  return async (dispatch) => {
    try {
      const { data } = await api.post("product/all", {
        sort_order: payLoad.sortOrder,
        categories: payLoad.category,
        min_price: payLoad.minP ?? 0,
        max_price: payLoad.maxP ?? 0,
        brands: payLoad.brand,
        rating: payLoad.rating,
        limit: payLoad.limit,
        page: payLoad.page,
      });
      if (data && data.status) {
        dispatch(updateStoreProducts(data?.products));
        dispatch(productsCount(data?.count));
        return data;
      } 
    } catch (e) {
      console.log("getbrandfilterall: Error:", e);
    }
  };
};

const getAppDataLogo = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.get("app/");
            if (data && data.status) {
                dispatch(getappdata(data));
                return data;
            }
        } catch (e) {
            console.log("getAppDataLogo: Error:", e);
        }
    };
};
const getAllSubject = () => {
    return async (dispatch) => {
        try {
            const { data } = await api.post("user/subjects");
            if (data && data.status) {
                dispatch(getSubject(data.subjects));
                return data;
            }
        } catch (e) {
            console.log("getAllSubject: Error:", e);
        }
    };
};
export {
    getAddresses,
    refreshCart,
    addProductIntoCart,
    removeProductFromCart,
    addToWishList,
    setEditAddress,
    changeQuantityInCart,
    applyCoupon,
    addPayments,
    selectAddresses,
    placedOrder,
    getAllOrders,
    getOrdersById,
    // getAddAddresses,
    // getSaveAddresses,
    getUserEditAddresses,
    removeFromWishlist,
    getWishlistProducts,
    getproductcategory,
    getbrandfilterall,
    getAllProducts,
    removeCoupon,
    addNewAddress,
    setDeleteAddress,
    verifyPayment,
    getAllRelatedProducts,
    getAppDataLogo,
    orderLengthCount,
    getAllFleshDeal,
    getAllCategory,
    getAllTopRating,
    getAllNewArrival,
    getAllBigDiscounts,
    getAllSubject,
    addGuestUser,
    getCurrencyData,
};
