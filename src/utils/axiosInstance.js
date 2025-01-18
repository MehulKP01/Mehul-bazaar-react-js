
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

// Create an instance of Axios
const instance = axios.create({
  baseURL: `https://store.digibulkmarketing.com/api/`
});


var context;
const isServer = () => typeof window === "undefined";
const getCookieValue = (name) =>
  isServer()
    ? getCookie(name, { req: context.req, res: context.res })
    : getCookie(name);
const setCookieValue = (name, value) =>
  isServer()
    ? setCookie(name, value, { req: context.req, res: context.res })
    : setCookie(name, value);

// Add a request interceptor to attach the token to each request
instance.interceptors.request.use(
  async (config) => {
    try {

      var token = getCookieValue("auth-token");
      const isGuest = getCookieValue("is-guest");
      

      var isMultipartData = false;
      if (config.headers["Content-Type"] == "multipart/form-data") {
        isMultipartData = true;
      }
      config.headers = {
        "Content-Type": isMultipartData
          ? "multipart/form-data"
          : "application/json",
        Authorization: `Bearer ${token}`,
        "Access-Control-Allow-Origin": "*",
      };
    } catch (e) {
      console.log("axios interceptors error:", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => {

    const isLoginPath =
      response.config.url === "/api/auth/verify-otp" ||
      response.config.url === "/api/auth/guest/login";

    if (isLoginPath) {
      const { status, token, user } = response.data;
    }
    return response;
  },
  (error) => {
    if (error.response) {
      
      const { status, data } = error.response;

      if (status >= 400 && status < 500) {
        console.error("Client Error:", data);
      } else if (status >= 500) {
        console.error("Server Error:", data);
      }
    } else {
      console.error("Network Error:", error);
    }
    return Promise.reject(error);
  }
);


export const setContext = (value) => {
  context = value;
};
export const api = instance;

