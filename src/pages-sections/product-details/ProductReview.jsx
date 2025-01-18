import {
  Box,
  Button,
  TextField,
  Rating,
  CircularProgress,
  Grid,
} from "@mui/material";
import { FlexBox } from "components/flex-box";
const ProductComment = lazy(()=> import("./ProductComment"));
import { H4, H5 } from "components/Typography";
import { lazy, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { api } from "../../utils/axiosInstance";
import { displaySnackBar } from "common/snackBar";

const ProductReview = ({ id }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [valueRating, setValueRating] = useState(0);
  const [comment, setComment] = useState();
  const [orderId, SetOrderId] = useState();
  const [reviews, setReviews] = useState([]);

  const reviewPending = async () => {
    const { data } = await api.post("product/isreview", { product_id: id });
    SetOrderId(data);
  };

  const getAllreview = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post(`order/review/${id}`);
      setReviews(data?.review);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reviewPending();
    getAllreview();
  }, [dispatch]);

  const sumbitReview = async (e) => {
    e.preventDefault();
    const { data } = await api.post("order/submit-review", {
      order_id: orderId?.order,
      comment: comment,
      product_id: id,
      rating: valueRating,
    });
    if (data?.success) {
      displaySnackBar(data.message, "success", "bottom", "left");
    }
  };
  return (
    <Box>
      {isLoading && (
        <Box ml={6} mt={3}>
          <CircularProgress size="3rem" />
        </Box>
      )}
      {!isLoading && reviews.length === 0 ? (
        <>There is no reviews</>
      ) : (
        <Grid container>
          {reviews?.map((item, ind) => (
            <ProductComment {...item} key={ind} />
          ))}
        </Grid>
      )}

      {orderId?.ispending_Review ? (
        <>
          <H4 fontWeight="600" mt={7} mb={2.5}>
            Write a Review for this product
          </H4>
          <form onSubmit={sumbitReview}>
            <Box mb={2.5}>
              <FlexBox mb={1.5} gap={0.5}>
                <H5 color="grey.700">Your Rating</H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <Rating
                color="warn"
                size="medium"
                value={valueRating}
                onChange={(event, newValue) => {
                  setValueRating(newValue);
                }}
              />
            </Box>

            <Box mb={3}>
              <FlexBox mb={1.5} gap={0.5}>
                <H5 color="grey.700">Your Review</H5>
                <H5 color="error.main">*</H5>
              </FlexBox>

              <TextField
                rows={8}
                multiline
                fullWidth
                name="comment"
                variant="outlined"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a review here..."
              />
            </Box>

            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </form>
        </>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ProductReview;
