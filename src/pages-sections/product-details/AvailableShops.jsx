import { Container, Grid } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import ProductCard1 from "components/product-cards/ProductCard1";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { H3 } from "components/Typography";
import { getAllRelatedProducts } from "../../../src/redux/action";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: "0px !important",
  },
}));

const AvailableShops = ({ product }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const relatedProducts = useSelector((state) => state?.shop?.relatedProducts);

  useEffect(() => {
    const payLoad = {
      product_id: product._id,
      limit: 4,
    };
    dispatch(getAllRelatedProducts(payLoad));
  }, [dispatch]);

  return (
    <Container className={classes.container}>
      <H3 mb={3}>Related Products</H3>
      <Grid container spacing={3}>
        {relatedProducts?.map((item) => (
            <Grid item lg={3} md={4} sm={6} xs={12} key={item?.id}>
              <ProductCard1 product={item} hoverEffect />
            </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default AvailableShops;
