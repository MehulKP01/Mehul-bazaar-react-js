"use client";

import { Fragment, lazy, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Card, styled, Typography } from "@mui/material";
import {
  FavoriteBorder,
  Favorite,
  Person,
  Place,
  CardGiftcard,
} from "@mui/icons-material";
import ShoppingBagOutlined from "@mui/icons-material/ShoppingBagOutlined";
import { FlexBox } from "components/flex-box";
const NavLink = lazy(() => import("components/nav-link/NavLink"));
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/reducers/user.reducer";
import { orderLengthCount } from "../../../../src/redux/action.js";

// custom styled components
const MainContainer = styled(Card)(({ theme }) => ({
  paddingBottom: "1.5rem",
  [theme.breakpoints.down("md")]: {
    boxShadow: "none",
    overflowY: "auto",
    height: "calc(100vh - 64px)",
  },
}));
const StyledNavLink = styled(({ children, isCurrentPath, ...rest }) => (
  <NavLink {...rest}>{children}</NavLink>
))(({ theme, isCurrentPath }) => ({
  display: "flex",
  alignItems: "center",
  borderLeft: "4px solid",
  paddingLeft: "1.5rem",
  paddingRight: "1.5rem",
  marginBottom: "1.25rem",
  justifyContent: "space-between",
  borderColor: isCurrentPath ? theme.palette.primary : "transparent",
  "& .nav-icon": {
    color: isCurrentPath ? theme.palette.primary : theme.palette.secondary[600],
  },
  "&:hover": {
    borderColor: theme.palette.primary,
    "& .nav-icon": {
      color: theme.palette.primary,
    },
  },
}));
const Navigations = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [staticCount, setStaticCount] = useState("");
  const pathName = usePathname();

  const linkList = [
    {
      title: "DASHBOARD",
      list: [
        {
          href: "/orders",
          title: "Orders",
          icon: ShoppingBagOutlined,
          count: staticCount?.order,
        },
        {
          href: "/wishlist",
          title: "Wishlist",
          icon: staticCount?.wishlist != 0 ? Favorite : FavoriteBorder,
          count: staticCount?.wishlist,
        },
        {
          href: "/rewards",
          title: "Rewards Points",
          icon: CardGiftcard,
          count: Math.round(staticCount?.userPoint ?? 0) ?? "",
        },
      ],
    },
    {
      title: "ACCOUNT SETTINGS",
      list: [
        {
          href: "/profile",
          title: "Profile Info",
          icon: Person,
        },
        {
          href: "/address",
          title: "Addresses",
          icon: Place,
          count: staticCount?.address,
        },
      ],
    },
  ];
  const router = useRouter();
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    router.push("/home");
  };
  const orderlength = async () => {
    const response = await dispatch(orderLengthCount());
    setStaticCount(response);
  };

  useEffect(() => {
    orderlength();
  }, [dispatch]);
  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem("userToken") !== null;
    return isLoggedIn;
  };
  useEffect(() => {
    const isUserLoggedIn = checkLoginStatus();
    setIsLoggedIn(isUserLoggedIn);
    orderlength();
  }, [dispatch]);
  return (
    <MainContainer>
      {linkList?.map((item) => (
        <Fragment key={item.title}>
          <Typography
            p="26px 30px 1rem"
            color="primary.secondary"
            fontSize="13px"
          >
            {item.title}
          </Typography>

          {item?.list?.map((item) => (
            <StyledNavLink
              href={item.href}
              key={item.title}
              isCurrentPath={pathName == item.href}
              disabled={!isLoggedIn}
            >
              <FlexBox alignItems="center" gap={1}>
                <item.icon
                  color="inherit"
                  fontSize="small"
                  className="nav-icon"
                />
                <span color="primary.secondary" style={{ fontWeight: "600" }}>
                  {item.title}
                </span>
              </FlexBox>

              <span>{item.count}</span>
            </StyledNavLink>
          ))}
        </Fragment>
      ))}
    </MainContainer>
  );
};

export default Navigations;
