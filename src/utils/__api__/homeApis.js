
import  {api} from '../axiosInstance';

export const getStatisticData = async () => {
    try {
      const response = await fetch("https://api-test.digibulkmarketing.com/admin/statistics");
      return response.json();
    } catch (e) {
      console.log("getStatisticData Error:", e);
      return null;
    }
};
  
  export const getCarouselData = async () => {

    try {
      const { data } = await api.get("app/carousels");
      return data?.status ? data.carousels : null;
    } catch (e) {
      console.log("getCarouselData Error:", e);
      return null;
    }

  };
  
  export const getProductByslug = async () => {
    try {
      const { data } = await api.post("product/featured");
      return data?.status ? data.products : null;
    } catch (e) {
      console.log("getProductByslug Error:", e);
      return null;
    }
  };
  
  export const getProductcategory = async () => {
    try {
      const { data } = await api.post("product/category/all");
      return data?.status ? data.categories : null;
    } catch (e) {
      console.log("getProductcategory Error:", e);
      return null;
    }
  };
  
  export const getTopRating = async () => {
    try {
      const { data } = await api.post("product/top-rating");
      return data?.status ? data.products : null;
    } catch (e) {
      console.log("gettoprating Error:", e);
      return null;
    }
  };
  
  export const getNewArriavle = async () => {
    try {
      const { data } = await api.get("app/get-last-ten-products");
      return data?.status ? data.data : null;
    } catch (e) {
      console.log("getNewArriavle Error:", e);
      return null;
    }
  };
  
  export const getBigDiscount = async () => {
    try {
      const { data } = await api.post("product/top-discounted");
      return data?.status ? data.result : null;
    } catch (e) {
      console.log("getBigDiscount Error:", e);
      return null;
    }
  };
  
  export const getAllProducts = async () => {
    try {
      const { data } = await api.post("product/all", { limit: 4 });
      return data?.status ? data.products : null;
    } catch (e) {
      console.log("getAllProducts Error:", e);
      return null;
    }
  };

