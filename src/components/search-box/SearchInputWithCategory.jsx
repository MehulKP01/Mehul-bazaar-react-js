import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { Box, Container, MenuItem, TextField, Typography, styled, useTheme } from "@mui/material";
import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import TouchRipple from "@mui/material/ButtonBase";
import BazaarMenu from "components/BazaarMenu";
import { FlexBox } from "components/flex-box";
import { SearchOutlinedIcon, SearchResultCard } from "./styled";
import clsx from "clsx";
import api from "utils/__api__/products";
import { layoutConstant } from "utils/constants";
const DropDownHandler = styled(FlexBox)(({ theme }) => ({
  whiteSpace: "pre",
  borderTopRightRadius: 300,
  borderBottomRightRadius: 300,
  borderLeft: `1px solid ${theme.palette.text.disabled}`,
  [theme.breakpoints.down("xs")]: {
    display: "none",
  },
}));
export const HeaderWrapper = styled(Box)(({ theme }) => ({
  zIndex: 3,
  position: "relative",
  height: layoutConstant.headerHeight,
  transition: "height 250ms ease-in-out",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: {
    height: layoutConstant.mobileHeaderHeight,
  },
}));
const StyledContainer = styled(Container)({
  gap: 2,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});
// styled components
const Divider = styled(Box)(({ theme }) => ({
  margin: "1rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`,
}));
const SearchInputWithCategory = ({className}) => {
  const parentRef = useRef();
  const { breakpoints } = useTheme();
  const [_, startTransition] = useTransition();
  const [category, setCategory] = useState("*");
  const [resultList, setResultList] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("All Categories");

  // HANDLE CHANGE THE CATEGORY
  const handleCategoryChange = (cat) => () => {
    setCategory(cat.value);
    setCategoryTitle(cat.title);
  };

  // FETCH PRODUCTS VIA API
  const getProducts = async (searchText, category) => {
    const data = await api.searchProducts(searchText, category);
    setResultList(data);
  };
  const handleSearch = (e) => {
    startTransition(() => {
      const value = e.target?.value;
      if (!value) setResultList([]);
      else if (value && category !== "*") getProducts(value, category);
      else getProducts(value);
    });
  };
  const handleDocumentClick = () => setResultList([]);
  useEffect(() => {
    window.addEventListener("click", handleDocumentClick);
    return () => window.removeEventListener("click", null);
  }, []);

  // CATEGORY MENU DROPDOWN
  const categoryDropdown = (
    <BazaarMenu
      direction="left"
      sx={{
        zIndex: breakpoints.down("md") ? 99999 : 1502,
      }}
      handler={
        <DropDownHandler
          px={3}
          gap={0.5}
          height="100%"
          color="grey.700"
          bgcolor="grey.100"
          alignItems="center"
          component={TouchRipple}
        >
          {categoryTitle}
          <KeyboardArrowDownOutlined fontSize="small" color="inherit" />
        </DropDownHandler>
      }
    >
      {/* {categories.map((item) => (
        <MenuItem key={item.value} onClick={handleCategoryChange(item)}>
          {item.title}
        </MenuItem>
      ))} */}
    </BazaarMenu>
  );
  return (
    <Box
      position="relative"
      flex="1 1 0"
      maxWidth="670px"
      mx="auto"
      {...{
        ref: parentRef,
      }}
    >
      {/* <HeaderWrapper className={clsx(className)}>
        <StyledContainer>
          <FlexBox>

            <>
              <Typography
                className="link"
                color="grey.600"
                p="0.25rem 1.25rem"
              >
                HOME
              </Typography>

              <Typography
                className="link"
                color="grey.600"
                p="0.25rem 1.25rem"
              >
                SHOP
              </Typography>


              <Typography
                className="link"
                color="grey.600"
                p="0.25rem 1.25rem"
              >
                RESELLER PROGRAM
              </Typography>

              <Typography
                className="link"
                color="grey.600"
                p="0.25rem 1.25rem"
              >
                DOWNLOAD
              </Typography>

              <Typography
                className="link"
                color="grey.600"
                p="0.25rem 1.25rem"
              >
                ABOUT
              </Typography>

              <Typography
                className="link"
                color="grey.600"
                p="0.25rem 1.25rem"
              >
                CONTACT
              </Typography>

            </>
          </FlexBox>

        </StyledContainer>
      </HeaderWrapper> */}
    </Box>
  );
};

export default SearchInputWithCategory;
