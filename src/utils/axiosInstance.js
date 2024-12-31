
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

// Create an instance of Axios
const instance = axios.create({
  baseURL: `https://store.digibulkmarketing.com/api/`
  //withCredentials: true,
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
      // console.log("Request URL:: ", config.url);

      var token = getCookieValue("auth-token");
      // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZGRjY2I3MTU1NjBhMjdiMDdhMzFmNCIsImlhdCI6MTcxNjUzOTA3MywiZXhwIjoxNzE5MTMxMDczfQ.yOQLkVMaMnc_n-P-u-khNo6yzVhtf3WX6J1dFqnuCPI" //state.user.token //state.auth.auth.token;
      const isGuest = getCookieValue("is-guest");
      // console.log("API IS_SERVER:", isServer());
      // console.log("API URL:", config.url);
      // console.log("API TOKEN: " + token);
      // console.log("API IS_GUEST: " + isGuest);


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
    // Do something with request error
    return Promise.reject(error);
  }
);
// Add a response interceptor to handle errors globally
instance.interceptors.response.use(
  (response) => {
    //console.log("RESPONSE API URL:", response.config.url);
    // console.log("Response URL:: ", response.config.url);

    const isLoginPath =
      response.config.url === "/api/auth/verify-otp" ||
      response.config.url === "/api/auth/guest/login";

    if (isLoginPath) {
      const { status, token, user } = response.data;
      // console.log("isLoginPath", status, token, user);

      // if (status) {
      //   setCookieValue("auth-token", token);
      //   setCookieValue("is-guest", user.role === "guest");
      //   setCookieValue("user-id", user.id);
      //   setCookieValue("user", user);
      // }
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

