import { Box, Pagination, Grid, CircularProgress } from "@mui/material";
import { FlexBetween } from "components/flex-box";
const ProductCard9 = lazy(() =>
  import("components/product-cards/ProductCard9")
);
import { Span } from "../Typography";
import { Fragment, lazy, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../src/redux/action";
import { useSearchParams } from "next/navigation";
const SEO = lazy(() => import("components/SEO"));
// ==========================================================

const ProductList2 = ({ products, handleChangePage, page }) => {
  const productShopCount = useSelector(
    (state) => state?.shop?.productShopCount
  );
  const allCategories = useSelector((state) => state?.shop?.productcategory);
  const allbrand = useSelector((state) => state?.shop?.brandsfilter);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();
  const rowsPerPage = 9;

  const fetchListData = useCallback(async () => {
    const categories = params.get("category")?.split("+");
    const categoryIds = allCategories?.categories
      ?.filter((category) => categories?.includes(category?.slug))
      ?.map((cat) => cat?._id);
    const brands = params.get("brand")?.split("+");
    const brandIds = allbrand?.brands
      ?.filter((brand) => brands?.includes(brand?.slug))
      ?.map((ban) => ban?._id);
    const ratingFilter = params.get("ratings") || [];
    const minPrice = params.get("min-price") || 0;
    const maxPrice = params.get("max-price") || 0;
    setIsLoading(true);
    const data = {
      limit: rowsPerPage,
      page: page,
      category: categoryIds,
      brand: brandIds,
      rating: ratingFilter,
      minP: minPrice,
      maxP: maxPrice,
    };
    await dispatch(getAllProducts(data));
    setIsLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, dispatch]);

  useEffect(() => {}, [fetchListData]);

  return (
    <Fragment>
      <SEO
        title={products?.meta?.title}
        description={products?.meta?.description}
        image={products?.meta?.image?.url || "/default-products-image.jpg"}
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
        <Grid sx={{ cursor: "pointer" }}>
          {products?.map((item) => (
            <ProductCard9 product={item} key={item?._id} />
          ))}
        </Grid>
      )}

      <Box>
        <FlexBetween flexWrap="wrap" mt={4}>
          <Span color="grey.600">
            Showing {page * rowsPerPage + 1}-
            {Math.min((page + 1) * rowsPerPage, productShopCount)} of{" "}
            {productShopCount} Products
          </Span>
          <Pagination
            variant="outlined"
            color="primary"
            onChange={handleChangePage}
            count={Math.ceil(productShopCount / rowsPerPage)}
            page={page + 1}
          />
        </FlexBetween>
      </Box>
    </Fragment>
  );
};
export default ProductList2;
