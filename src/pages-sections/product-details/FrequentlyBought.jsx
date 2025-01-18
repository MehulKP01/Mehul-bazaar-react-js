import { Fragment, lazy, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import { H2, H3, H4, H5, Span } from "components/Typography";
import { FlexBox, FlexRowCenter } from "components/flex-box";
import { currencyFormat, getMediaPath } from "lib";
import LazyImage from "components/LazyImage";
import { useDispatch, useSelector } from "react-redux";
import { api } from "utils/axiosInstance";
import { refreshCart } from "../../../src/redux/action";
import { displaySnackBar } from "common/snackBar";
const WrapperBox = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    "& .card-holder": {
      flexDirection: "column",
    },
  },
}));

// ===========================================================

// ============================================================

const FrequentlyBought = ({ product, boughtFrequently }) => {
  const productData = boughtFrequently[0];
  const dispatch = useDispatch();

  const [shortData, setShortData] = useState({
    title: "",
    products: [],
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [specialDiscount, setSpecialDiscount] = useState(0);
  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
  const totalPrice = shortData?.products?.reduce(
    (acc, item) => acc + item.productId.salePrice,
    0
  );
  const [allSelected, setAllSelected] = useState(false);

  const selectedData = shortData.products.filter((p) =>
    selectedProducts.includes(p.productId._id)
  );

  const handleProductSelection = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const currency = useSelector((state) => state?.shop?.currency);

  useEffect(() => {
    if (shortData && shortData?.title && shortData?.products) {
      setSelectedProducts(shortData.products.map((item) => item.productId._id));
      let totalDiscount = shortData.products.reduce((acc, ele) => {
        if (ele.discountType === "percentage") {
          return (
            acc +
            ele.productId.salePrice -
            (ele.productId.salePrice * ele.discount) / 100
          );
        } else {
          return acc + ele.productId.salePrice - ele.discount;
        }
      }, 0);
      setSpecialDiscount(totalDiscount);
    }
  }, [shortData]);

  useEffect(() => {
    setSelectedTotalPrice(() =>
      selectedProducts
        .filter((id) => id)
        .reduce((acc, id, arr) => {
          const product = shortData.products.find(
            (p) => p.productId._id === id
          );

          return acc + product.productId.salePrice;
        }, 0)
    );

    setAllSelected(
      selectedProducts.filter((id) => id).length ===
        productData?.products?.length
    );
  }, [selectedProducts]);

  useEffect(() => {
    if (!productData) {
      return;
    }

    const { title, products } = productData;

    const productsArray = products?.map((p) => {
      const { discount, discountType, variationId, productId } = p;
      const { _id, type } = productId;

      const data = {
        discount,
        type,
        discountType,
        variationId,
      };

      if (type === "variation") {
        const variation = productId.variations.find(
          (v) => v._id === variationId
        );
        const {
          _id: varId,
          title: name,
          image,
          regularPrice,
          salePrice,
        } = variation;

        const product = {
          varId,
          _id,
          name,
          image,
          regularPrice,
          salePrice,
          type,
        };
        data.productId = product;
      } else {
        const { name, image, regularPrice, salePrice, type } = productId;
        const product = {
          _id,
          name,
          image,
          regularPrice,
          salePrice,
          type,
        };
        data.productId = product;
      }

      return data;
    });
    const newData = {
      title,
      products: productsArray,
    };

    setShortData(newData);

    return () => {};
  }, [boughtFrequently]);

  const addToCart = async () => {
    const payload = {
      data: selectedData?.map((product) => {
        // Find the matching product from productData based on productId
        const matchingProduct = productData?.products?.find(
          (prod) => prod?.productId?._id === product?.productId?._id
        );

        return {
          productId: product?.productId?._id,
          variationId: product?.variationId ?? null,
          frequentItemId: matchingProduct?._id,
          frequentId: productData.id,
          type: "bought-frequently",
        };
      }),
    };

    try {
      const response = await api.post("/order/cart/add-product", payload);
      const result = await response?.data;
      if (response?.status === 200 || response?.status === 201) {
        dispatch(refreshCart());

        displaySnackBar(
          result?.message || "Product added to cart successfully!",
          "success"
        );
      } else {
        displaySnackBar(
          result?.message || "Error adding product to cart",
          "error"
        );
      }
    } catch (error) {
      displaySnackBar(
        error?.response?.data?.message || "Failed to add product to cart",
        "error"
      );
    }
  };

  return (
    <WrapperBox mb={1}>
      <H3 mb={3}>{productData.title}</H3>
      <Typography variant="body1" mb={2} color="secondary.main">
        Buy all products together and get an additional
        <Typography component="span" color="error.main">
          {" "}
          {currencyFormat(totalPrice - specialDiscount, currency)}
        </Typography>{" "}
        Special Discount!
      </Typography>

      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {shortData?.products?.map((item, ind) => (
          <Fragment key={item.id}>
            {/* Product Card */}
            <Grid
              sx={{
                position: "relative",
              }}
              item
              xs={12}
              sm={6}
              md={2.5}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: 0,
                }}
              >
                {ind !== 0 && (
                  <Checkbox
                    checked={selectedProducts.includes(item.productId._id)}
                    onChange={() => handleProductSelection(item.productId._id)}
                  ></Checkbox>
                )}
              </Box>
              <ProductCard item={item} />
            </Grid>

            {/* "+" Symbol */}
            {ind < productData.products.length - 1 && (
              <Grid item xs={12} sm={12} md={0.5}>
                <FlexRowCenter height="100%">
                  <H2 color="grey.600" mx={1}>
                    +
                  </H2>
                </FlexRowCenter>
              </Grid>
            )}
          </Fragment>
        ))}

        <Grid item xs={12} sm={12} md={0.5}>
          <FlexRowCenter height="100%">
            <H2 color="grey.600" mx={1}>
              =
            </H2>
          </FlexRowCenter>
        </Grid>
        <Grid item xs={12} sm={6} md={2.5}>
          <FlexRowCenter
            minHeight={300}
            border="1px solid"
            borderRadius="8px"
            className="gray-box"
            borderColor="grey.400"
            flexDirection="column"
            p={2}
          >
            {allSelected ? (
              <>
                <H3 color="primary.main">
                  {currencyFormat(specialDiscount, currency)}
                </H3>
                <Span mb={2} fontWeight="600" color="grey.600">
                  Save {currencyFormat(totalPrice - specialDiscount, currency)}{" "}
                  on special offer!
                </Span>
              </>
            ) : (
              <>
                <H3 color="primary.main" sx={{ mb: 2 }}>
                  Total {currencyFormat(selectedTotalPrice, currency)}
                </H3>
              </>
            )}

            <FlexBox gap={1.5}>
              <Button variant="contained" color="primary" onClick={addToCart}>
                Add to Cart
              </Button>
            </FlexBox>
          </FlexRowCenter>
        </Grid>
      </Grid>
    </WrapperBox>
  );
};
export default FrequentlyBought;

const ProductCard = ({ item, ind, length }) => {
  const product = item.productId;
  let { name, regularPrice, salePrice, type } = product;
  const currency = useSelector((state) => state?.shop?.currency);

  return (
    <Fragment key={item.id}>
      <Card>
        <LazyImage
          alt={name}
          width={380}
          height={380}
          src={getMediaPath(product?.image?.url || "")}
          style={{
            objectFit: "contain",
            objectPosition: "center center",
            aspectRatio: 1,
          }}
        />
        <CardContent>
          <H4 fontSize={14} textAlign="center" mb={1} title={name} ellipsis>
            {name}
          </H4>
          <FlexBox
            justifyContent="center"
            alignItems="center"
            gap={1}
            color="primary.main"
            fontWeight="600"
            mb={2}
          >
            <H5>{currencyFormat(salePrice, currency)}</H5>

            <Box>
              <Typography
                variant="body2"
                color="grey.600"
                fontWeight="600"
                lineHeight="1"
              >
                <del>{currencyFormat(regularPrice, currency)}</del>
              </Typography>
            </Box>
          </FlexBox>
        </CardContent>
      </Card>

      {ind < length - 1 && (
        <FlexRowCenter>
          <H2 color="grey.600" mx={1}>
            +
          </H2>
        </FlexRowCenter>
      )}
    </Fragment>
  );
};
