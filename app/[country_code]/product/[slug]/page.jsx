"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Container, Skeleton, styled, Tab, Tabs } from "@mui/material";
const ProductIntro = dynamic(
  () => import("../../../../src/pages-sections/product-details/ProductIntro"),
  { ssr: false }
);
const ProductReview = dynamic(
  () => import("../../../../src/pages-sections/product-details/ProductReview"),
  { ssr: false }
);
const AvailableShops = dynamic(
  () => import("../../../../src/pages-sections/product-details/AvailableShops"),
  { ssr: false }
);
const RelatedProducts = dynamic(
  () =>
    import("../../../../src/pages-sections/product-details/RelatedProducts"),
  { ssr: false }
);
const FrequentlyBought = dynamic(
  () =>
    import("../../../../src/pages-sections/product-details/FrequentlyBought"),
  { ssr: false }
);
const ProductDescription = dynamic(
  () =>
    import("../../../../src/pages-sections/product-details/ProductDescription"),
  { ssr: false }
);
const SEO = dynamic(() => import("../../../../src/components/SEO"), {
  ssr: false,
});
import dynamic from "next/dynamic";
import { api } from "../../../../src/utils/axiosInstance";

// styled component
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));



const ProductDetails = () => {
  //   const {  slug, product,relatedProducts,setting } = props;
  //   const { boughtFrequently,type }= product

  const [selectedVariant, setSelectedVariant] = useState(null);

  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_, value) => setSelectedOption(value);
  const [productData, setProductData] = useState({});
  const [rewardData, setRewardData] = useState({});
  
  const params = useParams();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  useEffect(() => {
    const getPageData = async () => {
      if (params) {
        const response = await getProductByslug(params?.slug);
        response ? setProductData(response) : setProductData({});
      } else {
        setProductData({});
      }

      const rewardsResponse = await getRewardSetting();
      rewardsResponse
        ? setRewardData(rewardsResponse?.point)
        : setRewardData({});
    };

    getPageData();
  }, []);

  return (
    <Container
      sx={{
        my: 4,
      }}
    >
      {Object.keys(productData).length > 0 ? (
        <>
          {/* PRODUCT DETAILS INFO AREA */}
          <ProductIntro
            setting={rewardData}
            product={productData}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />

          <SEO
            title={productData?.meta?.title}
            description={productData?.meta?.description}
            image={
              productData?.meta?.image?.url || "/default-product-image.jpg"
            }
            slug={productData?.slug}
          />

          {productData?.boughtFrequently &&
          productData?.boughtFrequently?.length ? (
            <FrequentlyBought
              product={productData}
              boughtFrequently={productData?.boughtFrequently}
            />
          ) : (
            <></>
          )}

          <StyledTabs
            textColor="primary"
            value={selectedOption}
            indicatorColor="primary"
            onChange={handleOptionClick}
          >
            <Tab className="inner-tab" label="Description" />
            <Tab
              className="inner-tab"
              label={`Review (${productData?.review?.totalReviews || 0})`}
            />
          </StyledTabs>

          <Box mb={6}>
            {selectedOption === 0 && (
              <ProductDescription
                product={productData}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />
            )}
            {selectedOption === 1 && <ProductReview id={productData?._id} />}
          </Box>

          <AvailableShops product={productData} />

          {/* {relatedProducts && <RelatedProducts productsData={relatedProducts} />} */}
          
        </>
      ) : (
        <>
          <Skeleton height={80} />
          <Skeleton animation="wave" height={80} />
          <Skeleton animation={false} height={80} />
          <Skeleton animation="wave" height={80} />
        </>
      )}


    </Container>
  );
};

const getProductByslug = async (slug) => {
  try {
    const { data } = await api.get(`product/slug/${slug}`);
    if (data?.status) {
      return data?.product;
    } else {
      return null;
    }
  } catch (e) {
    console.log("getProductByslug Error:", e);
    return null;
  }
};

const getRewardSetting = async () => {
  try {
    const { data } = await api.get(`user/point-settings`);
    if (data?.status) {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("error in reward setting", error);
    return null;
  }
};

export default ProductDetails;
