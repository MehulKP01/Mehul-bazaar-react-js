"use client";

import { memo, useEffect, useState } from "react";
import { Button, Grid, Pagination } from "@mui/material";
import { Favorite } from "@mui/icons-material";
const SEO = dynamic(() => import("../../src/components/SEO"), { ssr: false });
import { FlexBox } from "../../src/components/flex-box";
const ProductCard1 = dynamic(
  () => import("../../src/components/product-cards/ProductCard1"),
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
import { useDispatch, useSelector } from "react-redux";
import { getWishlistProducts } from "../../src/redux/action.js";
import dynamic from "next/dynamic.js";

const WishList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 6;
  const wishlistData = useSelector((state) => state?.shop?.wishlistProducts);
  const dispatch = useDispatch();

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
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
          <Grid container spacing={3}>
            {wishlistData?.products?.map((item) => (
              <Grid item lg={4} sm={6} xs={12} key={item.id}>
                <ProductCard1 product={item} />
              </Grid>
            ))}
          </Grid>
          <FlexBox justifyContent="center" mt={5}>
            <Pagination
              color="primary"
              variant="outlined"
              total={Math.ceil(wishlistData?.total / rowsPerPage)}
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
