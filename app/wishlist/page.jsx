"use client";

import { lazy, memo, useEffect, useState } from "react";
import { Box, Button, Grid, Pagination } from "@mui/material";
import { Favorite } from "@mui/icons-material";
const SEO = lazy(() => import("../../src/components/SEO"));
import { FlexBox } from "../../src/components/flex-box";
const ProductCard1 = lazy(() =>
  import("../../src/components/product-cards/ProductCard1")
);
const UserDashboardHeader = lazy(() =>
  import("../../src/components/header/UserDashboardHeader")
);
const CustomerDashboardLayout = lazy(() =>
  import("../../src/components/layouts/customer-dashboard")
);
const CustomerDashboardNavigation = lazy(() =>
  import("../../src/components/layouts/customer-dashboard/Navigations")
);
import { useDispatch, useSelector } from "react-redux";
import { getWishlistProducts } from "../../src/redux/action.js";
import Skeleton from "@mui/material/Skeleton";

const WishList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 6;
  const wishlistData = useSelector((state) => state?.shop?.wishlistProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    async function fetchDataWishlist() {
      try {
        const response = await dispatch(
          getWishlistProducts({
            limit: rowsPerPage,
            page: currentPage - 1,
          })
        );
        const { total } = response;
        setTotal(total);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
        setIsLoading(false);
      }
    }

    fetchDataWishlist();
  }, [dispatch, currentPage]);

  const totalPages = Math.ceil(total / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * rowsPerPage;

  const isEmptyWishlist =
    !wishlistData?.products || wishlistData?.products?.length === 0;

  const HEADER_BUTTON = (
    <Button color="primary" sx={{ px: 4, bgcolor: "primary.light" }}>
      Add All to Cart
    </Button>
  );

  return (
    <CustomerDashboardLayout>
      <SEO title="Wishlist" />
      <UserDashboardHeader
        icon={Favorite}
        title="My Wish List"
        button={HEADER_BUTTON}
        navigation={<CustomerDashboardNavigation />}
      />
      {isEmptyWishlist ? (
        <FlexBox justifyContent="center" mt={5}>
          <p>Your wishlist is currently empty.</p>
        </FlexBox>
      ) : (
        <>
          {isLoading ? (
            <Box sx={{ display: "flex", flexDirection: "row", gap: "30px" }}>
              <Skeleton width={"300px"} height={"300px"} />
              <Skeleton animation="wave" width={"300px"} height={"300px"} />
              <Skeleton animation={false} width={"300px"} height={"300px"} />
              <Skeleton animation="wave" width={"300px"} height={"300px"} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {wishlistData?.products?.map((item) => (
                <Grid item lg={4} sm={6} xs={12} key={item.id}>
                  <ProductCard1 product={item} />
                </Grid>
              ))}
            </Grid>
          )}
          <FlexBox justifyContent="center" mt={5}>
            <Pagination
              color="primary"
              variant="outlined"
              count={Math.ceil(wishlistData?.total / rowsPerPage)}
              page={currentPage}
              onChange={handleChangePage}
              disabled={totalPages === 1}
            />
          </FlexBox>
        </>
      )}
    </CustomerDashboardLayout>
  );
};

export default memo(WishList);
