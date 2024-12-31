import axios from "axios";
// import axiosInstance from "../AxiosInstance";
import {getAllOrders} from "../../redux/action.js"
import { useDispatch, useSelector } from "react-redux";

const getOrders = async () => {
  const response = await axios.get("/api/users/orders");
  return response.data;
    
};
const getIds = async () => {
  const response = await axios.get("/api/users/order-ids");
  return response.data;
};
const getOrder = async (id) => {
  // const response = await axios.get("/api/users/order", {
  //   params: {
  //     id,
  //   },
  // });
  // return response.data;
  const { data } = await axiosInstance.get(`order/${id}`);
  // return {};
  // if (data.status) {
    return data?.order;
  // } else {
  //   return null;
  // }

};
export default {
  getOrders,
  getOrder,
  getIds,
};
