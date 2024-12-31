"use client";

import {
  Box,
  CircularProgress,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { ShoppingBag } from "@mui/icons-material";
const TableRow = dynamic(() => import("../../src/components/TableRow"), {
  ssr: false,
});
import { FlexBox } from "../../src/components/flex-box";
const OrderRow = dynamic(
  () => import("../../src/pages-sections/orders/OrderRow"),
  { ssr: false }
);
const UserDashboardHeader = dynamic(
  () => import("../../src/components/header/UserDashboardHeader"),
  { ssr: false }
);
const CustomerDashboardLayout = dynamic(
  () => import("../../src/components/layouts/customer-dashboard"),
  { ssr: false }
);
const CustomerDashboardNavigation = dynamic(
  () => import("../../src/components/layouts/customer-dashboard/Navigations"),
  { ssr: false }
);
import { getAllOrders } from "../../src/redux/action.js";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation.js";
import dynamic from "next/dynamic.js";

const Orders = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 5;
  const userData = useSelector((state) => state?.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (userData?.isGuest) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    if (!userData?.isGuest) {
      fetchData();
    }
  }, [dispatch, currentPage]);

  const fetchData = async () => {
    setIsLoading(true);
    const response = await dispatch(
      getAllOrders({
        limit: rowsPerPage,
        page: currentPage - 1,
      })
    );
    if (response.status) {
      setIsLoading(false);
      const { orders, count } = response;
      setOrders(orders);
      setTotal(count);
    }
  };

  const startIndex = (currentPage - 1) * rowsPerPage;
  const totalPages = Math.ceil(total / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const renderOrderContent = () => {
    if (isLoading) {
      return (
        <Box>
          <Skeleton height={70} />
          <Skeleton animation="wave" height={70} />
          <Skeleton animation={false} height={70} />
        </Box>
      );
    }

    if (isMobile) {
      return orders?.map((order, index) => (
        <OrderRow
          key={order.id}
          order={order}
          serialNumber={startIndex + index + 1}
        />
      ));
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ textAlign: "start" }}>Sr. No</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Order Id</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Date Purchase</TableCell>
            <TableCell sx={{ textAlign: "center" }}>Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order, index) => (
            <OrderRow
              key={order.id}
              order={order}
              serialNumber={startIndex + index + 1}
            />
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        title="My Orders"
        icon={ShoppingBag}
        navigation={<CustomerDashboardNavigation />}
      />
      <Box sx={{ overflowX: isMobile ? "visible" : "auto" }}>
        {renderOrderContent()}
      </Box>
      <FlexBox justifyContent="center" mt={5}>
        <Pagination
          color="primary"
          variant="outlined"
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          size={isMobile ? "small" : "medium"}
        />
      </FlexBox>
    </CustomerDashboardLayout>
  );
};

export default Orders;
