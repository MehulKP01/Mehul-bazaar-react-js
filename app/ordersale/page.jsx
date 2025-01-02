"use client";

import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { api } from "../../src/utils/axiosInstance";
import { getMediaPath } from "../../src/lib";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import moment from "moment";

export default function CustomizedSnackbars() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [orderSales, setOrderSales] = useState([]);
  const [snackbarKeys, setSnackbarKeys] = useState([]);

  useEffect(() => {
    fetchOrderSale();
  }, []);

  const fetchOrderSale = async () => {
    try {
      const { data } = await api.post("order/sale");
      setOrderSales(data?.order || []);

      if (data?.order && data.order.length > 0) {
        data.order.forEach((order, index) => {
          setTimeout(() => {
            const createdAtDate = moment(order?.createdAt).format("YYYY-MM-DD");
            const timeFromNow = moment(order.createdAt)
              .startOf("day")
              .fromNow(); 

            const key = enqueueSnackbar(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minWidth: "300px",
                  maxWidth: "400px",
                }}
              >
                <img
                  src={
                    getMediaPath(`${order?.items[0]?.productId?.image?.url}`) ||
                    "https://via.placeholder.com/50"
                  }
                  alt="Product"
                  style={{
                    width: "50px",
                    height: "50px",
                    marginRight: "10px",
                    borderRadius: "4px",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      marginBottom: "3px",
                      fontSize: "14px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {`${order.name}`} just purchased
                  </span>
                  <span
                    style={{
                      marginBottom: "3px",
                      fontSize: "14px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    {`${order?.items[0]?.productId?.name}`}
                  </span>
                  <span style={{ marginBottom: "3px", color: "#000" }}>
                    {`About ${timeFromNow} `}
                  </span>
                </div>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => closeSnackbarByKey(key)} 
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "8px",
                    color: "#000",
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>,
              {
                style: { backgroundColor: "#fff" },
                autoHideDuration: 5000, 
              }
            );

            // Add the key to the snackbarKeys state
            setSnackbarKeys((prevKeys) => [...prevKeys, key]);
          }, (index + 1) * 5000); // Delay each snackbar by 5 seconds based on index
        });
      }
    } catch (error) {
      console.error("Error fetching order sale data:", error);
    }
  };

  const closeSnackbarByKey = (key) => {
    closeSnackbar(key); // Close the snackbar by its key
    setSnackbarKeys((prevKeys) => prevKeys.filter((k) => k !== key)); // Remove the key from state
  };

  return null; // This component does not render anything itself
}
