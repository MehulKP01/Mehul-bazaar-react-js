
import React, { Fragment, useEffect, useState, useCallback, memo } from "react";
import { Grid, Pagination, CircularProgress, Box } from "@mui/material";
import { FlexBetween } from "components/flex-box";
const ProductCard4 = dynamic(()=> import("components/product-cards/ProductCard4"),{ssr : false});
import { Span } from "components/Typography";
import { useSelector, useDispatch } from "react-redux";
import { getAllProducts } from "../../../src/redux/action";
import { useRouter, useSearchParams } from "next/navigation";
const SEO =  dynamic(()=> import("../../components/SEO"),{ssr : false})
import dynamic from "next/dynamic";

const ProductList1 = ({ products, handleChangePage, page }) => {
  const router = useRouter();
  const params = useSearchParams()
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 9;

  const productShopCount = useSelector((state) => state?.shop?.productShopCount);
  const allCategories = useSelector((state) => state?.shop?.productcategory);
  const allbrand = useSelector((state) => state?.shop?.brandsfilter);

  const fetchData = useCallback(async () => {
    const categories = params.get('category')?.split("+");
    const categoryIds = allCategories?.categories?.filter(category => categories?.includes(category?.slug))?.map(cat => cat?._id);
    const brands = params.get('brand')?.split("+");
    const brandIds = allbrand?.brands?.filter(brand => brands?.includes(brand?.slug))?.map(ban => ban?._id);
    const ratingFilter = params.get('ratings') || [];
    const minPrice = params.get('min-price') || 0;
    const maxPrice = params.get('max-price') || 0;
    setIsLoading(true);
    const payload = {
      limit: rowsPerPage,
      page: page,
      category: categoryIds,
      brand: brandIds,
      rating: ratingFilter,
      minP: minPrice,
      maxP: maxPrice,
    };
    await dispatch(getAllProducts(payload));
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, dispatch]);

  useEffect(() => {
  }, [fetchData]);

  return (
    <Fragment>
       <SEO
        title={products?.meta?.title}
        description={products?.meta?.description}
        image={products?.meta?.image?.url || '/default-products-image.jpg'}
        slug={products?.slug}
      />
      {isLoading ? (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 5,
          }}
        >
          <CircularProgress fontSize="small" />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products && products?.length > 0 ? (
            products?.map((item) => (
              <Grid item lg={4} sm={6} xs={12} key={item?.id} sx={{ cursor: "pointer" }}>
                <ProductCard4 product={item} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <p>No Products Found</p>
            </Grid>
          )}
        </Grid>
      )}

      <FlexBetween flexWrap="wrap" mt={4}>
        <Span color="grey.600">
          {productShopCount > 0 ? (
            <>
              Showing {(page * rowsPerPage) + 1}-
              {Math.min((page + 1) * rowsPerPage, productShopCount)} of {productShopCount} Products
            </>
          ) : (
            <p>No Products Found</p>
          )}
        </Span>
        <Pagination
          variant="outlined"
          color="primary"
          onChange={handleChangePage}
          count={Math.ceil(productShopCount / rowsPerPage)}
          page={page + 1}
        />
      </FlexBetween>
    </Fragment>
  );
};

export default ProductList1;
