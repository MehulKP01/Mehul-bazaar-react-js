
import ceil from "lodash/ceil";
import { differenceInMinutes } from "date-fns";
import currencyJs from "currency.js";

/**
 * GET THE DIFFERENCE DATE FORMAT
 * @param  date - which is created comment data
 * @returns string - formatted from now
 */

function getDateDifference(date) {
    let diff = differenceInMinutes(new Date(), new Date(date));
    if (diff < 60) return diff + " minutes ago";
    diff = ceil(diff / 60);
    if (diff < 24) return `${diff} hour${diff === 0 ? "" : "s"} ago`;
    diff = ceil(diff / 24);
    if (diff < 30) return `${diff} day${diff === 0 ? "" : "s"} ago`;
    diff = ceil(diff / 30);
    if (diff < 12) return `${diff} month${diff === 0 ? "" : "s"} ago`;
    diff = diff / 12;
    return `${diff.toFixed(1)} year${ceil(diff) === 0 ? "" : "s"} ago`;
}

/**
 * RENDER THE PRODUCT PAGINATION INFO
 * @param page - CURRENT PAGE NUMBER
 * @param perPageProduct - PER PAGE PRODUCT LIST
 * @param totalProduct - TOTAL PRODUCT NUMBER
 * @returns
 */

function renderProductCount(page, perPageProduct, totalProduct) {
    let startNumber = (page - 1) * perPageProduct;
    let endNumber = page * perPageProduct;
    if (endNumber > totalProduct) {
        endNumber = totalProduct;
    }
    return `Showing ${
        startNumber - 1
    }-${endNumber} of ${totalProduct} products`;
}

/**
 * CALCULATE PRICE WITH PRODUCT DISCOUNT THEN RETURN NEW PRODUCT PRICES
 * @param  price - PRODUCT PRICE
 * @param  discount - DISCOUNT PERCENT
 * @returns - RETURN NEW PRICE
 */

function calculateDiscount(price, discount, quantity, currency) {
  const afterDiscount = Number((price - price * (discount / 100)).toFixed(2));
  const totalPrice = quantity ? afterDiscount * quantity : afterDiscount;

  if (currency) {
      if (currency.show === "symbol") {
          return currencyFormat(totalPrice, currency);
      } else {
          return currencyFormat(totalPrice, currency) + " " + currency.currency;
      }
  } else {
      return currencyFormat(totalPrice);
  }
}
function calculateDiscountPercentage(salePrice, regularPrice) {
    let percentage = ((regularPrice - salePrice) * 100) / regularPrice;
    if(percentage<0) return 0;
    return percentage.toFixed();
}

/**
 * CHANGE THE CURRENCY FORMAT
 * @param  price - PRODUCT PRICE
 * @param  fraction - HOW MANY FRACTION WANT TO SHOW
 * @returns - RETURN PRICE WITH CURRENCY
 */

function currencyFormat(price, currency) {
    if (currency) {
        return currencyJs(price * currency.rate).format({
            precision: currency.decimal,
            symbol:
                currency.show == "symbol" ? currency.symbol : currency.currency,
        });
    } else {
        return currencyJs(price * 0.012).format({
            precision: 2,
            symbol: "$",
        });
    }
}
const getMediaPath = (path)=>{

return `https://store.digibulkmarketing.com/${path??'media/product-placeholder.png'}`

}

const findProductSalePrice = (cartItem) => {
  if (cartItem?.productId?.type == "simple" ||cartItem?.productId?.type ==  "bundle") {
    return cartItem.productId.salePrice;
  } else {
    const variation = cartItem?.productId?.variations?.find(
      (x) => x._id == cartItem?.variationId
    );
    if (variation) {
      return variation?.salePrice;
    } else {
      return 0;
    }
  }
}


const productGallery = (product, selectedVariant) => {
  var gallery = [];
  if (product?.image) {
    gallery.push(
      selectedVariant?.image ? selectedVariant?.image : product?.image
    );
  }
  gallery = [...gallery, ...(product?.gallery ?? [])];
  return gallery;
};

const PRODUCT_PLACEHOLDER = "https://store.digibulkmarketing.com/media/product-placeholder.png";

export {
    renderProductCount,
    calculateDiscount,
    currencyFormat,
    getDateDifference,
    getMediaPath,
    PRODUCT_PLACEHOLDER,
    findProductSalePrice,
    productGallery,
    calculateDiscountPercentage,
};
