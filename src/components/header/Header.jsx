"use client"

import Link from "next/link";
import { Fragment, useState } from "react";
import {
    Badge,
    Box,
    Button,
    Dialog,
    Drawer,
    Menu,
    Typography,
    styled,
} from "@mui/material";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Clear, PersonOutline } from "@mui/icons-material";
import clsx from "clsx";
import Icon from "components/icons";
import { layoutConstant } from "utils/constants";
import Image from "components/BazaarImage";
import MiniCart from "components/MiniCart";
import { FlexBetween, FlexBox } from "components/flex-box";
import ShoppingBagOutlined from "components/icons/ShoppingBagOutlined";
import { useDispatch, useSelector } from "react-redux";
import { redirect, usePathname, useRouter } from "next/navigation";
import { MenuItem } from "@mui/material";
import { H6 } from "components/Typography";
import { getMediaPath } from "lib";
import MenuIcon from "@mui/icons-material/Menu";
import { api } from "../../utils/axiosInstance";
import { getCookie, setCookie } from "cookies-next";
import LoginModel from "pages-sections/sessions/LoginModel";
import { logout } from "../../redux/reducers/user.reducer";

// styled component
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
const useStyles = styled({
    activeLink: {
        textDecoration: "underline",
    },
});
// ==============================================================

// "../src/redux/reducers/user.reducer";

// ==============================================================

const Header = ({ className }) => {
    const userData = useSelector((state) => state?.user);
    const cart = useSelector((state) => state?.shop?.cart);

    const router = useRouter();
    const pathName = usePathname()
    const dispatch = useDispatch();
    const theme = useTheme();


    const [dialogOpen, setDialogOpen] = useState(false);
    const [sidenavOpen, setSidenavOpen] = useState(false);
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const appdatalogo = useSelector((state) => state?.shop?.appdata?.app);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const downMd = useMediaQuery(theme.breakpoints.down(475));
    const downlg = useMediaQuery(theme.breakpoints.down(975));

    const toggleSidenav = () => setSidenavOpen(!sidenavOpen);
    const toggleSearchBar = () => setSearchBarOpen(!searchBarOpen);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClose = () => setAnchorEl(null);
    const handleClick = (event) => setAnchorEl(event.currentTarget);

    const onLogout = async () => {
        const guestId = getCookie("guest-id");
        try {
            if (guestId) {
                const { data } = await api.post("auth/logout", {
                    guest_id: guestId,
                });
                if (data?.status) {
                    const isGuest =
                        data?.user?.isGuest == "false" ? true : data?.user?.isGuest;
                    setCookie("auth-token", data?.token);
                    setCookie("is-guest", true);
                    setCookie("user-id", data?.user?.id);
                    setCookie("guest-id", data?.user?.id);
                    setCookie("user", data?.user);


                    dispatch(logout());

                    if (
                        pathName === "/orders" ||
                        pathName === "/checkout" ||
                        pathName === "/checkout-alternative" ||
                        pathName === "/profile" ||
                        pathName === "/profile" && query.id ||
                        pathName === "/payment"
                    ) {
                        redirect("/");
                    }
                }
            }
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            redirect("/");
        }
    };
   
    // active tabs
    const [activeTab, setActiveTab] = useState();

    const handleTabs = (tabName) => {
        setActiveTab(tabName);
    };
    const [loginModel, setLoginModel] = useState(false);
    const toggleLoginModel = () => {
        setLoginModel(!loginModel);
    };

    const toggleDialog = () => {
        if (userData?.isGuest) {
            setLoginModel(true)
        } else {
            router.push("/profile");
            setDialogOpen(!dialogOpen);
        }
    };
    // LOGIN AND MINICART DRAWER
    const DIALOG_DRAWER = (
        <Fragment>
            <Dialog
                scroll="body"
                open={dialogOpen}
                fullWidth={isMobile}
                onClose={toggleDialog}
                sx={{
                    zIndex: 9999,
                }}
            >
                {loginModel ? (
                    <LoginModel
                        closeModel={() => setLoginModel(false)}
                        loginModel={loginModel}
                        toggleLoginModel={toggleLoginModel}
                    ></LoginModel>
                ) : null}
            </Dialog>

            <Drawer
                open={sidenavOpen}
                anchor="right"
                onClose={toggleSidenav}
                sx={{
                    zIndex: 9999,
                }}
            >
                <MiniCart toggleSidenav={toggleSidenav} />
            </Drawer>
        </Fragment>
    );

    // FOR SMALLER DEVICE
    if (downMd) {
        const ICON_STYLE = {
            color: "grey.500",
            fontSize: 18,
        };
        return (
            <HeaderWrapper className={clsx(className)}>
                <StyledContainer>
                    {loginModel ? (
                        <LoginModel
                            closeModel={() => setLoginModel(false)}
                            loginModel={loginModel}
                            toggleLoginModel={toggleLoginModel}
                        ></LoginModel>
                    ) : null}
                    <FlexBetween width="100%">
                        {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
                        <Box flex={1}>
                            {/* <MobileMenu /> */}
                            <Box
                                component={IconButton}
                                onClick={toggleSearchBar}
                            >
                                {/* <Icon.Search sx={ICON_STYLE} /> */}
                                <MenuIcon sx={ICON_STYLE} />
                            </Box>
                        </Box>

                        {/* MIDDLE CONTENT - LOGO */}

                        <Link href="/" prefetch={true}>
                            <Image
                                height={44}
                                src={getMediaPath(appdatalogo?.generalSetting?.logo?.url)}
                                alt="logo"
                                />
                        </Link>

                        {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
                        <FlexBox justifyContent="end" flex={1}>
                            <Box component={IconButton} onClick={toggleDialog}>
                                <Icon.User sx={ICON_STYLE} />
                            </Box>

                            <Box component={IconButton} onClick={toggleSidenav}>
                                <Badge
                                    badgeContent={cart?.products?.length}
                                    color="primary"
                                >
                                    <Icon.CartBag sx={ICON_STYLE} />
                                </Badge>
                            </Box>
                        </FlexBox>
                    </FlexBetween>

                    {/* SEARCH FORM DRAWER */}
                    <Drawer
                        open={searchBarOpen}
                        anchor="top"
                        onClose={toggleSearchBar}
                        sx={{
                            zIndex: 9999,
                        }}
                    >
                        <Box
                            sx={{
                                width: "auto",
                                padding: 2,
                                height: "100vh",
                            }}
                        >
                            <FlexBetween>
                                {/* header menu*/}
                                <FlexBox gap={1.5} flexDirection="column">
                                    <Link href="/" prefetch={true}>
                                        <Image
                                            height={44}
                                            src={getMediaPath(
                                                appdatalogo?.generalSetting?.logo?.url
                                            )}
                                            alt="logo"
                                        />
                                    </Link>
                                    <Link href="/home" prefetch={true}>
                                        <Typography
                                            className="link"
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            HOME
                                        </Typography>
                                    </Link>
                                    <Link href="/shop" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            SHOP
                                        </Typography>
                                    </Link>
                                    <Link href="/reseller" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            RESELLER PROGRAM
                                        </Typography>
                                    </Link>

                                    <Link href="/Download" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            DOWNLOAD
                                        </Typography>
                                    </Link>
                                    <Link href="/about" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            ABOUT
                                        </Typography>
                                    </Link>
                                    <Link href="/contact" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            CONTACT
                                        </Typography>
                                    </Link>
                                </FlexBox>
                                {/*header menu end */}
                            </FlexBetween>
                        </Box>

                        <IconButton onClick={toggleSearchBar}>
                            <Clear color="primary" />
                        </IconButton>
                    </Drawer>

                    {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
                    {DIALOG_DRAWER}
                </StyledContainer>
            </HeaderWrapper>
        );
    }
    if (downlg) {
        const ICON_STYLE_LRAGE = {
            color: "grey.700",
            fontSize: 16,
        };
        return (
            <HeaderWrapper className={clsx(className)}>
                <StyledContainer>
                    {loginModel ? (
                        <LoginModel
                            closeModel={() => setLoginModel(false)}
                            loginModel={loginModel}
                            toggleLoginModel={toggleLoginModel}
                        ></LoginModel>
                    ) : null}
                    <FlexBetween width="100%">
                        {/* LEFT CONTENT - NAVIGATION ICON BUTTON */}
                        <Box flex={1}>
                            {/* <MobileMenu /> */}
                            <Box
                                component={IconButton}
                                onClick={toggleSearchBar}
                            >
                                {/* <Icon.Search sx={ICON_STYLE} /> */}
                                <MenuIcon sx={ICON_STYLE_LRAGE} />
                            </Box>
                        </Box>

                        {/* MIDDLE CONTENT - LOGO */}

                        <Link href="/" prefetch={true}>
                            <Image
                                height={44}
                                src={getMediaPath(appdatalogo?.generalSetting?.logo?.url)}
                                alt="logo"
                            />
                        </Link>

                        {/* RIGHT CONTENT - LOGIN, CART, SEARCH BUTTON */}
                        <FlexBox justifyContent="end" flex={1}>
                            <Box component={IconButton} onClick={toggleDialog}>
                                <Icon.User sx={ICON_STYLE_LRAGE} />
                            </Box>

                            <Box component={IconButton} onClick={toggleSidenav}>
                                <Badge
                                    badgeContent={cart?.products?.length}
                                    color="primary"
                                >
                                    <Icon.CartBag sx={ICON_STYLE_LRAGE} />
                                </Badge>
                            </Box>
                        </FlexBox>
                    </FlexBetween>

                    {/* SEARCH FORM DRAWER */}
                    <Drawer
                        open={searchBarOpen}
                        anchor="top"
                        onClose={toggleSearchBar}
                        sx={{
                            zIndex: 9999,
                        }}
                    >
                        <Box
                            sx={{
                                width: "auto",
                                padding: 2,
                                height: "100vh",
                            }}
                        >
                            <FlexBetween>
                                {/* header menu*/}
                                <FlexBox gap={1.5} flexDirection="column">
                                    <Link href="/" prefetch={true}>
                                        <Image
                                            height={44}
                                            src={getMediaPath(
                                                appdatalogo?.generalSetting?.logo?.url
                                            )}
                                            alt="logo"
                                        />
                                    </Link>
                                    <Link href="/home" prefetch={true}>
                                        <Typography
                                            sx={{
                                                color:
                                                    activeTab === "home"
                                                        ? "primary.main"
                                                        : "gray.500",
                                            }}
                                            onClick={() => handleTabs("home")}
                                            variant="body1"
                                            color="primary.secondary"
                                            p="0.25rem 1.25rem"
                                            fontSize="15px"
                                            fontWeight={500}
                                        >
                                            HOME
                                        </Typography>
                                    </Link>
                                    <Link href="/shop" prefetch={true}>
                                        <Typography
                                            sx={{
                                                color:
                                                    activeTab === "shop"
                                                        ? "primary.main"
                                                        : "gray.500",
                                            }}
                                            onClick={() => handleTabs("shop")}
                                            variant="body1"
                                            p="0.25rem 1.25rem"
                                            fontSize="15px"
                                            fontWeight={500}
                                        >
                                            SHOP
                                        </Typography>
                                    </Link>
                                    <Link href="/reseller" prefetch={true}>
                                        <Typography
                                            sx={{
                                                color:
                                                    activeTab === "reseller"
                                                        ? "primary.main"
                                                        : "gray.500",
                                            }}
                                            onClick={() =>
                                                handleTabs("reseller")
                                            }
                                            p="0.25rem 1.25rem"
                                            fontWeight={500}
                                            fontSize="15px"
                                        >
                                            RESELLER PROGRAM
                                        </Typography>
                                    </Link>

                                    <Link href="/download" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            DOWNLOAD
                                        </Typography>
                                    </Link>
                                    <Link href="/about" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            ABOUT
                                        </Typography>
                                    </Link>
                                    <Link href="/contact" prefetch={true}>
                                        <Typography
                                            color="grey.500"
                                            p="0.25rem 1.25rem"
                                        >
                                            CONTACT
                                        </Typography>
                                    </Link>
                                </FlexBox>
                                {/*header menu end */}
                            </FlexBetween>
                        </Box>

                        <IconButton onClick={toggleSearchBar}>
                            <Clear color="primary" />
                        </IconButton>
                    </Drawer>

                    {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}


                    {DIALOG_DRAWER}
                </StyledContainer>
            </HeaderWrapper>
        );
    }
    return (
        <HeaderWrapper className={clsx(className)}>
            <StyledContainer>
                {loginModel ? (
                    <LoginModel
                        closeModel={() => setLoginModel(false)}
                        loginModel={loginModel}
                        toggleLoginModel={toggleLoginModel}
                    ></LoginModel>
                ) : null}
                {/* LEFT CONTENT - LOGO AND CATEGORY */}
                
                <FlexBox mr={2} minWidth="170px" alignItems="start">
                    <Link href="/" prefetch={true}>
                        <Image
                            height={44}
                            src={getMediaPath(appdatalogo?.generalSetting?.logo?.url)}
                            alt="logo"
                            />
                    </Link>
                    {/* SHOW DROP DOWN CATEGORY BUTTON WHEN HEADER FIXED */}
                </FlexBox>

                {/* header menu*/}
                <FlexBox gap={1.5}>
                    <Link href="/home" prefetch={true}>
                        <Typography
                            sx={{
                                color:
                                    activeTab === "home"
                                        ? "primary.main"
                                        : "gray.500",
                            }}
                            onClick={() => handleTabs("home")}
                            variant="body1"
                            color="primary.secondary"
                            p="0.25rem 1.25rem"
                            fontSize="15px"
                            fontWeight={500}
                        >
                            HOME
                        </Typography>
                    </Link>
                    <Link href="/shop" prefetch={true}>
                        <Typography
                            sx={{
                                color:
                                    activeTab === "shop"
                                        ? "primary.main"
                                        : "gray.500",
                            }}
                            onClick={() => handleTabs("shop")}
                            variant="body1"
                            p="0.25rem 1.25rem"
                            fontSize="15px"
                            fontWeight={500}
                        >
                            SHOP
                        </Typography>
                    </Link>
                    <Link href="/reseller" prefetch={true}>
                        <Typography
                            sx={{
                                color:
                                    activeTab === "reseller"
                                        ? "primary.main"
                                        : "gray.500",
                            }}
                            onClick={() => handleTabs("reseller")}
                            p="0.25rem 1.25rem"
                            fontWeight={500}
                            fontSize="15px"
                        >
                            RESELLER PROGRAM
                        </Typography>
                    </Link>

                    <Link href="/download" prefetch={true}>
                        <Typography
                            sx={{
                                color:
                                    activeTab === "download"
                                        ? "primary.main"
                                        : "gray.500",
                            }}
                            // color="primary.secondary"
                            onClick={() => handleTabs("download")}
                            p="0.25rem 1.25rem"
                            fontWeight={500}
                            fontSize="15px"
                        >
                            DOWNLOAD
                        </Typography>
                    </Link>
                    <Link href="/about" prefetch={true}>
                        <Typography
                            sx={{
                                color:
                                    activeTab === "about"
                                        ? "primary.main"
                                        : "gray.500",
                            }}
                            onClick={() => handleTabs("about")}
                            p="0.25rem 1.25rem"
                            fontWeight={500}
                            fontSize="15px"
                        >
                            ABOUT
                        </Typography>
                    </Link>
                    <Link href="/contact" prefetch={true}>
                        <Typography
                            sx={{
                                color:
                                    activeTab === "contact"
                                        ? "primary.main"
                                        : "gray.500",
                            }}
                            onClick={() => handleTabs("contact")}
                            color="primary.secondary"
                            p="0.25rem 1.25rem"
                            fontWeight={500}
                            fontSize="15px"
                        >
                            CONTACT
                        </Typography>
                    </Link>
                </FlexBox>
                {/*header menu end */}

                {/* LOGIN AND CART BUTTON */}

                {/* LOGIN AND CART BUTTON */}
                <FlexBox gap={1.5} alignItems="center">
                    <Badge badgeContent={cart?.products.length} color="primary">
                        <Box
                            p={1.25}
                            bgcolor="grey.200"
                            component={IconButton}
                            onClick={toggleSidenav}
                        >
                            <ShoppingBagOutlined />
                        </Box>
                    </Badge>


                    {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}
                    {/* {DIALOG_DRAWER} */}
                    {userData?.isGuest ? (
                        <Button
                            variant="outlined"
                            onClick={() => {
                                toggleLoginModel();
                            }}
                            sx={{ border: "none" }}
                        >
                            Login
                        </Button>
                    ) : (
                        <Box>
                            <IconButton
                                sx={{
                                    padding: 0,
                                    mx: 1,
                                }}
                                aria-haspopup="true"
                                onMouseOver={handleClick}
                                aria-expanded={open ? "true" : undefined}
                                aria-controls={open ? "account-menu" : undefined}
                            >
                                <Box
                                    component={IconButton}
                                    p={1.25}
                                    bgcolor="grey.200"
                                    onClick={toggleDialog}
                                >
                                    <PersonOutline />
                                </Box>
                            </IconButton>

                            <Menu
                                open={open}
                                id="account-menu"
                                anchorEl={anchorEl}
                                onClose={handleClose}
                                onClick={handleClose}
                                transformOrigin={{
                                    horizontal: "right",
                                    vertical: "top",
                                }}
                                anchorOrigin={{
                                    horizontal: "right",
                                    vertical: "bottom",
                                }}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        mt: 1,
                                        boxShadow: 2,
                                        minWidth: 200,
                                        borderRadius: "8px",
                                        overflow: "visible",
                                        border: "1px solid",
                                        borderColor: "grey.200",
                                        "& .MuiMenuItem-root:hover": {
                                            backgroundColor: "grey.200",
                                        },
                                        "&:before": {
                                            top: 0,
                                            right: 14,
                                            zIndex: 0,
                                            width: 10,
                                            height: 10,
                                            content: '""',
                                            display: "block",
                                            position: "absolute",
                                            borderTop: "1px solid",
                                            borderLeft: "1px solid",
                                            borderColor: "grey.200",
                                            bgcolor: "background.paper",
                                            transform: "translateY(-50%) rotate(45deg)",
                                        },
                                    },
                                }}
                            >
                                <Box px={2} pt={1}>
                                    <H6>{userData?.user?.name ? userData?.user?.name : "User"}</H6>
                                </Box>

                                <Divider />
                                <MenuItem
                                    onClick={() => {
                                        router.push("/profile");
                                    }}
                                >
                                    Profile
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        router.push("/orders");
                                    }}
                                >
                                    My Orders
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        router.push("/wishlist");
                                    }}
                                >
                                    Wishlist
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        router.push("/rewards");
                                    }}
                                >
                                    Reward Points 
                                </MenuItem>

                                <Divider />
                                <MenuItem onClick={() => onLogout()}>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    )}
                </FlexBox>
                {/* LOGIN FORM DIALOG AND CART SIDE BAR  */}

                {DIALOG_DRAWER}
            </StyledContainer>
        </HeaderWrapper>
    );
};
export default Header;
