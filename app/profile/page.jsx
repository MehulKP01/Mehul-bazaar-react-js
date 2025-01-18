"use client";

import Link from "next/link";
import { Person } from "@mui/icons-material";
import { Avatar, Box, Button, Card, Grid, useMediaQuery } from "@mui/material";
const TableRow = lazy(()=> import("components/TableRow")) ;
import { H3, H5, Small } from "components/Typography";
import { FlexBetween, FlexBox } from "components/flex-box";
const UserDashboardHeader = lazy(() =>
  import("../../src/components/header/UserDashboardHeader")
);
const CustomerDashboardLayout = lazy(() =>
  import("../../src/components/layouts/customer-dashboard")
);
const CustomerDashboardNavigation = lazy(() =>
  import("../../src/components/layouts/customer-dashboard/Navigations")
);
import { useDispatch, useSelector } from "react-redux";
import { lazy, useEffect, useState } from "react";
import { api } from "../../src/utils/axiosInstance";
import { getMediaPath } from "../../src/lib";
import { orderLengthCount } from "../../src/redux/action";
import { updateUserProfile } from "../../src/redux/reducers/user.reducer";
import { useRouter } from "next/navigation";
// ============================================================

const Profile = () => {
  const TableRowItem = ({ title, value }) => {
    return (
      <FlexBox flexDirection="column" p={1}>
        <Small color="grey.600" mb={0.5} textAlign="left">
          {title}
        </Small>
        <span>{value}</span>
      </FlexBox>
    );
  };
  const downMd = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const router = useRouter();
  const [staticCount, setStaticCount] = useState();
  const userProfileData = useSelector((state) => state?.user?.updateProfile);
  const userData = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  const getUserDetails = async () => {
    try {
      const response = await api.post("user/profile");
      const jsonData = response.data.user;
      dispatch(updateUserProfile(jsonData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // SECTION TITLE HEADER LINK
  if (userData?.isGuest) {
    router.push("/login");
    return null;
  }

  useEffect(() => {
    if (!userData?.isGuest) {
      getUserDetails();
    }
  }, [dispatch]);

  const HEADER_LINK = (
    <Button
      LinkComponent={Link}
      href={`/profile/${userProfileData?.id}`}
      sx={{
        px: 4,
        color: "white",
        bgcolor: "#3399cc",
        "&:hover": {
          backgroundColor: "#3399cc",
        },
      }}
    >
      Edit Profile
    </Button>
  );
  const infoList = [
    {
      title: staticCount?.order,
      subtitle: "All Orders",
    },
    {
      title: staticCount?.processing,
      subtitle: "Order In Processing",
    },
    {
      title: staticCount?.completed,
      subtitle: "Completed Order",
    },
    {
      title: staticCount?.delivered,
      subtitle: "Order Delivered",
    },
    {
      title: staticCount?.totalPoints || "0",
      subtitle: "Total Points",
    },
  ];

  const fetchData = async () => {
    const response = await dispatch(orderLengthCount());
    setStaticCount(response);
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <CustomerDashboardLayout>
      {/* TITLE HEADER AREA */}
      <UserDashboardHeader
        icon={Person}
        title="My Profile"
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />

      {/* USER PROFILE INFO */}
      <Box mb={4}>
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <Card
              sx={{
                display: "flex",
                p: "14px 32px",
                height: "100%",
                alignItems: "center",
              }}
            >
              <Avatar
                src={getMediaPath(userProfileData?.profile)}
                sx={{ height: 64, width: 64 }}
              />
              <Box ml={1.5} flex="1 1 0">
                <FlexBetween flexWrap="wrap">
                  <div>
                    <H5 my="0px">{`${
                      userProfileData?.name || "User" || "N/A"
                    }`}</H5>
                  </div>
                </FlexBetween>
              </Box>
            </Card>
          </Grid>

          <Grid item md={6} xs={12}>
            <Grid container spacing={4}>
              {infoList?.map((item) => (
                <Grid item lg={3} sm={6} xs={6} key={item.subtitle}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      p: "1rem 1.25rem",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <H3 color="primary.main" my={0} fontWeight={600}>
                      {item?.title}
                    </H3>

                    <Small color="grey.600" textAlign="center">
                      {item?.subtitle}
                    </Small>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <TableRow
        sx={{
          cursor: "auto",
          p: "0.75rem 1.5rem",
          ...(downMd && {
            alignItems: "start",
            flexDirection: "column",
            justifyContent: "flex-start",
          }),
        }}
      >
        <TableRowItem
          title="Name"
          value={
            userProfileData?.firstName || "N/A"
              ? userProfileData?.name || "N/A"
              : userProfileData?.name || "N/A"
          }
        />
        <TableRowItem title="Email" value={userProfileData?.email || "N/A"} />
        <TableRowItem title="Phone" value={userProfileData?.phone || "N/A"} />
      </TableRow>
    </CustomerDashboardLayout>
  );
};

export default Profile;
