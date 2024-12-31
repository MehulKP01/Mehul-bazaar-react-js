"use client";

import { useCallback, useEffect, useState } from "react";
import { Apps, FilterList, ViewList } from "@mui/icons-material";
import {
  Box,
  Card,
  CircularProgress,
  Container,
  Grid,
  Button,
  IconButton,
  MenuItem,
  Modal,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
const Sidenav =  dynamic(()=>import("../../../src/components/Sidenav"),{ssr:false});
import { FlexBox } from "../../../src/components/flex-box";
import { Paragraph } from "../../../src/components/Typography";
const  ProductList1 = dynamic(()=>import( "../../../src/components/products/ProductList1"),{ssr:false});
const ProductList2 = dynamic(()=>import( "../../../src/components/products/ProductList2"),{ssr:false});
const ProductFilterCard = dynamic(()=>import( "../../../src/pages-sections/product-details/ProductFilterCard"),{ssr:false});
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../src/redux/action";
const useMuiTable =  dynamic(()=>import("../../../src/hooks/useMuiTable.js"),{ssr:false});
import InfoIcon from "@mui/icons-material/Info";
import ClearIcon from "@mui/icons-material/Clear";
import { api } from "../../../src/utils/axiosInstance.js";
import { getMediaPath } from "../../../src/lib.js";
import { sortOptions } from "common/staticData.js";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import dynamic from "next/dynamic.js";
import { displaySnackBar } from '../../../src/common/snackBar.js'

const ShopPage = () => {
  const router = useRouter();

  const urlParams = useParams();

  const pathname = usePathname();
  const params = useSearchParams();
  const newParams = new URLSearchParams(params);

  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state?.shop?.productcategory);
  const allbrand = useSelector((state) => state?.shop?.brandsfilter);
  const products = useSelector((state) => state?.shop?.products);
  const productShopCount = useSelector(
    (state) => state?.shop?.productShopCount
  );
  const [loading, setLoading] = useState(false);
  const [unreviewedProducts, setUnreviewedProducts] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const { page, handleChangePage } = useMuiTable({
    listData: products,
    isLimitedData: true,
  });
  const firstOption = sortOptions?.find((option) => option);

  useEffect(() => {
    const sortByParam = params.get("sort-by");
    handleChangeSortOrder(sortByParam);
  }, [dispatch, page]);

  const handleChangeSortOrder = useCallback(
    async (value) => {
      setLoading(true);
      const newSortOrder = value || firstOption.value || "popularity";
      const ratingFilter = params.get("ratings") || [];
      const minPrice = params.get("min-price") || 0;
      const maxPrice = params.get("max-price") || 0;

      newParams.set("sort-by", newSortOrder);
      router.push(`${pathname}?${newParams}`);

      const categories = params.get("category")?.split("+");
      const categoryIds = allCategories?.categories
        ?.filter((category) => categories?.includes(category?.slug))
        ?.map((cat) => cat?._id);

      const brands = params.get("brand")?.split("+");
      const brandIds = allbrand?.brands
        ?.filter((brand) => brands?.includes(brand?.slug))
        ?.map((ban) => ban?._id);

      try {
        const payload = {
          limit: 9,
          page,
          sortOrder: newSortOrder,
          category: categoryIds,
          minP: minPrice,
          maxP: maxPrice,
          brand: brandIds,
          rating: ratingFilter,
        };
        await dispatch(getAllProducts(payload));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, params, page, urlParams]
  );

  const fetchReviewData = async () => {
    try {
      const { data } = await api.post("/order/reviews/products");

      if (data?.status) {
        if(data?.products){
          setReviewData(data?.products);
  
          // Filter products that haven't been reviewed
          const reviewedProductIds = data?.products?.map((product) => product?.id);
          const unreviewed = products?.filter((product) => {
            !reviewedProductIds.includes(product?.id);
          });
          setUnreviewedProducts(unreviewed);
        }
      } else {
        console.error("Failed to fetch review data.");
      }
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };

  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const view = params.get("view") || "grid";

  const toggleView = useCallback(
    (view) => () => {
      newParams.set("view", view);
      router.push(`${pathname}?${newParams}`);
    },
    [params]
  );

  // model state
  const [openModal, setOpenModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [review, setReview] = useState("");
  const [orderId, setOrderId] = useState("");

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setShowReviewForm(false);
    setOpenModal(false);
  };

  const handleOpenReviewForm = (product) => {
    setSelectedProduct(product);
    setOrderId(product?.orderId);
    setRatingValue(product.isReview ? 0 : product.reviews[0]?.rating || 0);
    setReview(product.isReview ? "" : product?.reviews[0]?.comment);
    setOrderId(product.orderId);
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    try {
      const payload = {
        product_id: selectedProduct.id,
        rating: ratingValue,
        comment: review,
        order_id: orderId,
      };

      const response = await api.post("order/submit-review", payload);

      if (response?.status === 200) {
        displaySnackBar(response?.data?.message,"success")

        // Create a new review object to add to the reviewData
        const newReview = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          rating: ratingValue,
          comment: review,
          // image: selectedProduct.image,
        };

        // Update reviewData to include the newly submitted review
        setReviewData((prevReviews) => [...prevReviews, newReview]);

        // Optionally: Remove the product from the unreviewed products list
        const updatedUnreviewedProducts = unreviewedProducts.filter(
          (product) => product.id !== selectedProduct.id
        );
        setUnreviewedProducts(updatedUnreviewedProducts);

        handleCloseModal();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit the review. Please try again.";
        displaySnackBar(errorMessage,"error")
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, []);

  return (
    <Container
      sx={{
        mt: 4,
        mb: 6,
      }}
    >
      {reviewData?.length > 0 && (
        <Card
          elevation={1}
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#3DAEE9",
            p: "10px",
            color: "white",
            mb: "10px",
          }}
        >
          <IconButton
            sx={{
              color: "white",
              mr: "10px",
            }}
          >
            <InfoIcon />
          </IconButton>
          <Typography textAlign={"justify"}>
            We are waiting for the feedback about your previous purchase(s). If
            you want to review all your previously purchased products, then
            please
            <a
              href="#"
              onClick={handleOpenModal}
              style={{
                color: "white",
                textDecoration: "underline",
                margin: "0 5px",
              }}
            >
              <b>click here</b>
            </a>
            .
          </Typography>
        </Card>
      )}


      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="review-modal-title"
        aria-describedby="review-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { md: 600, sm: 500, xs: 320 },
            height: { md: 480, sm: 400, xs: 450 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography
              id="review-modal-title"
              variant="h5"
              fontWeight={600}
              component="h1"
            >
              {showReviewForm
                ? `Review : ${selectedProduct?.name}`
                : "Review Reminder popup"}
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <ClearIcon />
            </IconButton>
          </Box>
          {showReviewForm ? (
            <Box>
              <Typography sx={{ mt: 3 }} fontSize={"16px"} fontWeight={600}>
                Please rate and review the product.
              </Typography>
              <Box display={"flex"} mt={4}>
                <Typography fontWeight={600} fontSize={"16px"}>
                  Rating :
                </Typography>
                <Rating
                  name="rating"
                  size="large"
                  defaultValue={0}
                  precision={0.5}
                  value={ratingValue}
                  onChange={(e) => setRatingValue(e.target.value)}
                  sx={{ ml: 1, mt: 0 }}
                />
              </Box>
              <Box display={"flex"} mt={4}>
                <TextField
                  fullWidth
                  label="Review"
                  placeholder="Write you review here...."
                  multiline
                  rows={4}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </Box>
              <Box mt={4} display={"flex"} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setShowReviewForm(false)}
                  sx={{ mt: 0, height: "50px", width: "120px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{ height: "50px" }}
                  color="primary"
                  onClick={handleSubmitReview}
                >
                  Submit Review
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography fontWeight={600} fontSize={"14px"}>
                You have products awaiting your review. Please check the list
                below:
              </Typography>
              <Box
                sx={{
                  overflowX: "auto",
                  maxHeight: { md: 348, sm: 248, xs: 300 },
                  overflowY: "auto",
                  mt: 2,
                }}
              >
                <Table sx={{ height: 400 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr No</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Product Image</TableCell>{" "}
                      {/* Updated header */}
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reviewData?.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Box
                            component="img"
                            src={getMediaPath(product?.image?.url)}
                            alt={product.name}
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: "cover",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {product.isReview ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenReviewForm(product)}
                              sx={{ width: "80px" }}
                            >
                              Review
                            </Button>
                          ) : (
                            // If isReview is false, show "Review" button
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenReviewForm(product)}
                              sx={{ width: "80px" }}
                            >
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      <Card
        elevation={1}
        sx={{
          mb: "55px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          p: {
            sm: "1rem 1.25rem",
            md: "0.5rem 1.25rem",
            xs: "1.25rem 1.25rem 0.25rem",
          },
        }}
      >
        <Box>
          <Paragraph color="grey.600">
            {productShopCount} results found
          </Paragraph>
        </Box>

        <FlexBox alignItems="center" columnGap={4} flexWrap="wrap" my="0.5rem">
          <FlexBox alignItems="center" gap={1} flex="1 1 0">
            <Paragraph color="grey.600" whiteSpace="pre">
              Sort by:
            </Paragraph>

            <TextField
              select
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Sort by"
              value={params.get("sort-by") || "popularity"}
              onChange={(e) => handleChangeSortOrder(e.target.value)}
              sx={{
                flex: "1 1 0",
                minWidth: "150px",
              }}
            >
              {sortOptions?.map((item) => (
                <MenuItem value={item?.value} key={item?.value}>
                  {item?.label}
                </MenuItem>
              ))}
            </TextField>
          </FlexBox>

          <FlexBox alignItems="center" my="0.25rem">
            <Paragraph color="grey.600" mr={1}>
              View:
            </Paragraph>

            <IconButton onClick={toggleView("grid")}>
              <Apps
                color={view === "grid" ? "primary" : "inherit"}
                fontSize="small"
              />
            </IconButton>

            <IconButton onClick={toggleView("list")}>
              <ViewList
                color={view === "list" ? "primary" : "inherit"}
                fontSize="small"
              />
            </IconButton>

            {downMd && (
              <Sidenav
                handle={
                  <IconButton>
                    <FilterList fontSize="small" />
                  </IconButton>
                }
              >
                <ProductFilterCard />
              </Sidenav>
            )}
          </FlexBox>
        </FlexBox>
      </Card>

      <Grid container spacing={3}>
        <Grid
          item
          md={3}
          sx={{
            display: {
              md: "block",
              xs: "none",
            },
          }}
        >
          <ProductFilterCard />
        </Grid>

        <Grid item md={9} xs={12} position="relative">
          {loading && (
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
          )}
          {products?.length === 0 ? (
            <Box textAlign="center" mt={2}>
              <Paragraph color="grey.600">
                No products found for this category.
              </Paragraph>
            </Box>
          ) : (
            <>
              {view === "grid" ? (
                <ProductList1
                  products={products}
                  handleChangePage={handleChangePage}
                  page={page}
                />
              ) : (
                <ProductList2
                  products={products}
                  handleChangePage={handleChangePage}
                  page={page}
                />
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopPage;
