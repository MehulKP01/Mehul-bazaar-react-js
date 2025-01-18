
import {
  Box,
  Button,
  Card,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
const Accordion = lazy(()=> import("../../components/accordion/Accordion"));
import { FlexBetween } from "components/flex-box";
import { H5, H6, H3, Span } from "components/Typography";
const AccordionHeader = lazy(()=> import("../../components/accordion/AccordionHeader"));
import { useDispatch, useSelector } from "react-redux";
import {
  getbrandfilterall,
  getproductcategory,
  getAllProducts,
} from "../../redux/action.js";
import { lazy, memo, useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Image from "next/image.js";

const ProductFilterCard = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [checkedValues, setCheckedValues] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const categories = useSelector((state) => state?.shop?.productcategory);
  const brandData = useSelector((state) => state?.shop?.brandsfilter);
  const [isAnyFilterApplied, setIsAnyFilterApplied] = useState(false);
  const router = useRouter();

  const { country_code } = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams);


  useEffect(() => {
    dispatch(getproductcategory());
    dispatch(getbrandfilterall());
  }, [dispatch]);

  useEffect(() => {
    filterProducts(
      selectedCategories,
      selectedBrands,
      minPrice,
      maxPrice,
      checkedValues
    );
  }, [dispatch]);

  useEffect(() => {
      const {
          category,
          brand,
          "min-price": min,
          "max-price": max,
          ratings,
      } = pathname;
      if (category) {
          setIsAnyFilterApplied(true);
          const categories = category?.split("+");
          setSelectedCategories(categories);
      }

      if (min) {
          setIsAnyFilterApplied(true);
          setMinPrice(min);
      }

      if (max) {
          setIsAnyFilterApplied(true);
          setMaxPrice(max);
      }
      if (brand) {
          setIsAnyFilterApplied(true);
          const brandData = brand?.split("+");
          setSelectedBrands(brandData);
      }

      if (ratings) {
          setIsAnyFilterApplied(true);
          const ratingsArray = ratings?.split("+").map(Number);
          setCheckedValues(ratingsArray);
      }
  }, [pathname]);

  const handleCategoryClick = (categoryId, categorySlug) => {
    let selectedCategoryId = categoryId;
    const category = categories?.categories?.find(
      (category) => category?.slug === categorySlug
    );
    if (!selectedCategoryId && categorySlug) {
      selectedCategoryId = category?.id;
    }

    if (selectedCategoryId) {
      setSelectedCategories((prevCategories) => {
        const updatedCategories = prevCategories.includes(categorySlug)
          ? prevCategories.filter((id) => id !== categorySlug)
          : [...prevCategories, categorySlug];

        newParams.set("category", updatedCategories.join("+"));
        router.push(`${pathname}?${newParams}`);

        const isFilterApplied =
          updatedCategories?.length > 0 ||
          selectedBrands?.length > 0 ||
          minPrice !== "" ||
          maxPrice !== "" ||
          checkedValues?.length > 0;
        setIsAnyFilterApplied(isFilterApplied);

        filterProducts(
          updatedCategories,
          selectedBrands,
          minPrice,
          maxPrice,
          checkedValues
        );
        return updatedCategories;
      });
    } else {
      console.error("Category ID or slug is required.");
    }
  };

  const handleBrandClick = (brandId, brandName) => {
    let selectedBrandId = brandId;
    const foundBrand = brandData?.brands?.find(
      (brand) => brand?.name === brandName
    );
    if (!selectedBrandId && brandName) {
      selectedBrandId = foundBrand?.id;
    }
    if (selectedBrandId) {
      setSelectedBrands((prevBrands) => {
        const updatedBrands = prevBrands?.includes(brandName)
          ? prevBrands?.filter((id) => id !== brandName)
          : [...prevBrands, brandName];

        newParams.set("brand", updatedBrands.join("+"));
        router.push(`${pathname}?${newParams}`);

        const isFilterApplied =
          updatedBrands?.length > 0 ||
          selectedCategories?.length > 0 ||
          minPrice !== "" ||
          maxPrice !== "" ||
          checkedValues?.length > 0;
        setIsAnyFilterApplied(isFilterApplied);

        filterProducts(
          selectedCategories,
          updatedBrands,
          minPrice,
          maxPrice,
          checkedValues
        );
        return updatedBrands;
      });
    } else {
      console.error("Brand ID or name is required.");
    }
  };

  const handleCheckboxChange = (value) => (event) => {
    const isChecked = event.target.checked;
    setCheckedValues((prevCheckedValues) => {
      const updatedCheckedValues = isChecked
        ? [...prevCheckedValues, value]
        : prevCheckedValues.filter((item) => item !== value);

      newParams.set("ratings", updatedCheckedValues.join("+"));
      router.push(`${pathname}?${newParams}`);

      const isFilterApplied =
        updatedCheckedValues?.length > 0 ||
        selectedCategories?.length > 0 ||
        minPrice !== "" ||
        maxPrice !== "" ||
        selectedBrands?.length > 0;
      setIsAnyFilterApplied(isFilterApplied);

      filterProducts(
        selectedCategories,
        selectedBrands,
        minPrice,
        maxPrice,
        updatedCheckedValues
      );
      return updatedCheckedValues;
    });
  };

  const filterProducts = (
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    checkedValues
  ) => {
    const categoryIds = categories?.categories
      ?.filter((category) => selectedCategories?.includes(category?.slug))
      ?.map((category) => category?.id);
    const brandIds = brandData?.brands
      ?.filter((brand) => selectedBrands?.includes(brand?.name))
      ?.map((brand) => brand?._id);
    const payload = {
      category: categoryIds,
      minP: minPrice !== "" ? parseInt(minPrice) : 0,
      maxP: maxPrice !== "" ? parseInt(maxPrice) : 0,
      brand: brandIds,
      rating: checkedValues,
      limit: 9,
    };
    dispatch(getAllProducts(payload)).finally(() => {
    });
  };

  const handleResetFilter = () => {
    setIsLoading(true);
    setIsAnyFilterApplied(false);
    setCheckedValues([]);
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    
    newParams.delete('category');
    newParams.delete('brand');

    router.replace(`/${country_code}/shop?sort-by=popularity`);

    
    dispatch(
      getAllProducts({
        limit: 9,
      })
    ).finally(() => {
      setIsLoading(false);
    });
  };

  // Function to toggle showing all categories
  const toggleShowAllCategories = () => {
    setShowAllCategories(!showAllCategories);
  };

  const toggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  const handleMinPriceChange = (newMinPrice) => {
    setMinPrice(newMinPrice);
    newParams.set("min-price",newMinPrice);
    router.push(`${pathname}?${newParams}`);
    const isFilterApplied =
      newMinPrice !== "" ||
      maxPrice !== "" ||
      selectedCategories?.length > 0 ||
      selectedBrands?.length > 0 ||
      checkedValues?.length > 0;
    setIsAnyFilterApplied(isFilterApplied);
    filterProducts(
      selectedCategories,
      selectedBrands,
      newMinPrice,
      maxPrice,
      checkedValues
    );
  };

  const handleMaxPriceChange = (newMaxPrice) => {
    setMaxPrice(newMaxPrice);
    newParams.set("max-price",newMaxPrice);
    router.push(`${pathname}?${newParams}`);
    const isFilterApplied =
      minPrice !== "" ||
      newMaxPrice !== "" ||
      selectedCategories?.length > 0 ||
      selectedBrands?.length > 0 ||
      checkedValues?.length > 0;
    setIsAnyFilterApplied(isFilterApplied);
    filterProducts(
      selectedCategories,
      selectedBrands,
      minPrice,
      newMaxPrice,
      checkedValues
    );
  };

  const updateUrlParams = (params) => {
    const query = { ...router.query, ...params };
    router.push({
      pathname: router.pathname,
      query: query,
    });
  };

  return (
    <>
      <Card
        sx={{
          p: "18px 27px",
          overflow: "auto",
          position: "relative",
        }}
        elevation={1}
      >
        {isLoading && (
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
        <FlexBetween justifyContent="space-between" alignItems="center">
          <H3>FILTERS</H3>
          {isAnyFilterApplied && (
            <Typography
              variant="contained"
              sx={{
                color: "#3399cc",
                fontWeight: "700",
                cursor: "pointer",
              }}
              size="small"
              onClick={handleResetFilter}
            >
              CLEAR ALL
            </Typography>
          )}
        </FlexBetween>
        <Divider
          sx={{
            mt: 2,
            mb: 3,
          }}
        />
        {/* CATEGORY VARIANT FILTER */}
        <H5 mb={1.25}>CATEGORIES</H5>
        {categories?.categories
          ?.slice(0, showAllCategories ? categories?.categories?.length : 5)
          ?.map((category) =>
            category?.subCategories ? (
              <Accordion key={category?._id} expanded>
                <AccordionHeader
                  px={0}
                  py={0.75}
                  color="grey.600"
                  onClick={() =>
                    handleCategoryClick(category?.id, category?.slug)
                  }
                >
                  <Span
                    sx={{
                      cursor: "pointer",
                      mr: "9px",
                    }}
                  >
                    {category?.name}
                  </Span>
                </AccordionHeader>
              </Accordion>
            ) : (
              <FormControlLabel
                key={category?.id}
                control={
                  <Checkbox
                    size="small"
                    color="secondary"
                    sx={{
                      color: "grey.600",
                    }}
                    checked={selectedCategories.includes(category?.slug)}
                    onChange={() => {
                      handleCategoryClick(category?.id, category?.slug);
                    }}
                  />
                }
                label={<Span color="inherit">{category?.name}</Span>}
                sx={{
                  display: "flex",
                  color: "grey.700",
                }}
              />
            )
          )}
        {categories?.categories?.length > 5 && (
          <FlexBetween alignItems="center" sx={{ color: "#3399CC" }}>
            <Button onClick={toggleShowAllCategories}>
              {showAllCategories ? "Show Less" : "Show More"}
            </Button>
            {!showAllCategories && (
              <Span>{categories?.categories?.length}</Span>
            )}
          </FlexBetween>
        )}
        <Divider
          sx={{
            mt: 2,
            mb: 3,
          }}
        />

        {/* PRICE VARIANT FILTER */}
        <H5 mb={2}>PRICE RANGE</H5>
        <FlexBetween>
          <TextField
            placeholder="Min"
            type="number"
            size="small"
            fullWidth
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
          />
          <H5 color="grey.600" px={1}>
            -
          </H5>

          <TextField
            placeholder="Max"
            type="number"
            size="small"
            fullWidth
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
          />
        </FlexBetween>

        <Divider
          sx={{
            my: 3,
          }}
        />

        {/* BRAND VARIANT FILTER */}
        <H5 mb={2}>BRANDS</H5>
        {brandData?.brands
          ?.slice(0, showAllBrands ? brandData?.brands?.length : 5)
          .map((brand) => (
            <FormControlLabel
              key={brand?._id}
              control={
                <Checkbox
                  size="small"
                  color="secondary"
                  sx={{
                    color: "grey.600",
                  }}
                  checked={selectedBrands?.includes(brand?.name)}
                  onChange={() => handleBrandClick(brand?._id, brand?.name)}
                />
              }
              label={<Span color="inherit">{brand?.name}</Span>}
              sx={{ display: "flex", color: "grey.700" }}
            />
          ))}
        {brandData?.brands?.length > 5 && (
          <FlexBetween alignItems="center" sx={{ color: "#3399CC" }}>
            <Button onClick={toggleShowAllBrands}>
              {showAllBrands ? "Show Less" : "Show More"}
            </Button>
            {!showAllBrands && <Span>{brandData?.brands?.length}</Span>}
          </FlexBetween>
        )}
        <Divider
          sx={{
            my: 3,
          }}
        />
        {/* RATINGS FILTER */}
        <H5 mb={1.25}>RATINGS</H5>

        {[5, 4, 3, 2, 1]?.map((item, index) => (
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                color="secondary"
                sx={{
                  color: "grey.600",
                }}
                onChange={handleCheckboxChange(item)}
                checked={checkedValues?.includes(item)}
              />
            }
            label={<Rating size="small" value={item} color="warn" readOnly />}
            sx={{
              display: "flex",
            }}
            key={index}
          />
        ))}
        <Divider
          sx={{
            my: 3,
          }}
        />
      </Card>
      <Image
        style={{ marginTop: "20px" }}
        width={290}
        height={387.14}
        alt="banner"
        src="/assets/images/banners/shop2.jpg"
      />
    </>
  );
};

export default ProductFilterCard;
