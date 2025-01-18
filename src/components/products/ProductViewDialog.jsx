import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
  styled,
  Tabs,
  Tab,
} from "@mui/material";
import BazaarImage from "../../components/BazaarImage";
const Carousel = lazy(() => import("../../components/carousel/Carousel"));
import { getMediaPath } from "../../lib";
import { lazy, useEffect, useMemo, useState } from "react";
const ProductDialogDetails = lazy(() => import("./ProductDialogDetails"));
const ProductSpecification = lazy(() =>
  import("pages-sections/product-details/ProductSpecification")
);
const ProductDescription = lazy(() =>
  import("pages-sections/product-details/ProductDescription")
);

// styled components
const ContentWrapper = styled(Box)(({ theme }) => ({
  "& .carousel:hover": {
    cursor: "pointer",
    "& .carousel__back-button": {
      opacity: 1,
      left: 10,
    },
    "& .carousel__next-button": {
      opacity: 1,
      right: 10,
    },
  },
  "& .carousel__next-button, & .carousel__back-button": {
    opacity: 0,
    boxShadow: "none",
    transition: "all 0.3s",
    background: "transparent",
    color: theme.palette.primary.main,
    ":disabled": {
      color: theme.palette.grey[500],
    },
    ":hover": {
      color: theme.palette.primary.main,
      backgroundColor: "transparent",
    },
  },
  "& .carousel__back-button": {
    left: 0,
  },
  "& .carousel__next-button": {
    right: 0,
  },
}));
const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  // marginTop: 80,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));
// =====================================================

// =====================================================

const ProductViewDialog = (props) => {
  const { product, openDialog, handleCloseDialog } = props;
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_, value) => setSelectedOption(value);
  const [selectedVariant, setSelectVariant] = useState(null);
  useEffect(() => {
    if (product?.variations?.length > 0) {
      setSelectVariant(product.variations[0]);
    }
  }, [product]);

  const [images, setImages] = useState([]);

  useEffect(() => {
    if (selectedVariant) {
      let pastImages = [];
      if (product?.gallery?.length > 0) {
        pastImages = [...product.gallery];
      } else {
        pastImages = [product.image];
      }
      setImages(() => {
        if (selectedVariant.image) {
          return [selectedVariant.image, ...pastImages];
        }
        return pastImages;
      });
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (product) {
      setImages(() => {
        if (product?.gallery?.length > 0) {
          return [...product.gallery];
        } else {
          return [product.image];
        }
      });
    }
  }, [product]);

  const productDescription = useMemo(() => {
    if (product.type === "variation") {
      // return "variation product "
      return selectedVariant ? selectedVariant.description : "";
    }
    return product.description || "";
  }, [product, selectedVariant]);

  return (
    <Dialog
      open={openDialog}
      maxWidth={false}
      onClose={handleCloseDialog}
      sx={{
        zIndex: 1501,
      }}
    >
      <DialogContent
        sx={{
          maxWidth: 900,
          width: "100%",
        }}
      >
        <ContentWrapper>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <Box sx={{ width: "100%" }}>
                <Carousel totalSlides={images?.length} visibleSlides={1}>
                  {images?.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          mx: "auto",
                          width: "100%",
                        }}
                      >
                        <BazaarImage
                          src={getMediaPath(item?.url)}
                          sx={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    );
                  })}
                </Carousel>
              </Box>
            </Grid>

            <Grid item md={8} xs={12}>
              <ProductDialogDetails
                product={product}
                setSelectVariant={setSelectVariant}
              />
            </Grid>
          </Grid>
          <StyledTabs
            textColor="primary"
            value={selectedOption}
            indicatorColor="primary"
            onChange={handleOptionClick}
          >
            <Tab className="inner-tab" label="Description" />
            {product.type !== "simple" && (
              <Tab className="inner-tab" label="Specification" />
            )}
          </StyledTabs>
          <Typography mb={2}>
            {selectedOption === 0 && (
              <ProductDescription
                product={product}
                selectedVariant={selectedVariant}
                setSelectVariant={setSelectVariant}
              />
            )}
            {selectedOption === 1 && product.type !== "simple" && (
              <ProductSpecification
                product={product}
                selectedVariant={selectedVariant}
              />
            )}
          </Typography>

          <Divider
            sx={{
              mb: 2,
            }}
          />
        </ContentWrapper>

        <IconButton
          sx={{
            position: "absolute",
            top: 3,
            right: 3,
          }}
          onClick={handleCloseDialog}
        >
          <Close fontSize="small" color="secondary" />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
};
export default ProductViewDialog;
