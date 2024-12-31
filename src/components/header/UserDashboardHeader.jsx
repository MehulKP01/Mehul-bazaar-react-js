import Menu from "@mui/icons-material/Menu";
import { Box, styled, Typography } from "@mui/material";
const Sidenav = dynamic(()=>import("components/Sidenav"),{ssr:false});
import { FlexBox } from "components/flex-box";
import useWindowSize from "hooks/useWindowSize";
import dynamic from "next/dynamic";
import { memo } from "react";
const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(3),
  "& .headerHold": {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  [theme.breakpoints.up("md")]: {
    "& .sidenav": {
      display: "none",
    },
  },
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

// ==============================================================

// ==============================================================

const UserDashboardHeader = ({ title, button, navigation, ...props }) => {
  const width = useWindowSize();
  const isTablet = width < 1025;
  return (
    <StyledBox>
      <FlexBox mt={2} className="headerHold">
        <FlexBox alignItems="center">
          {props.icon && <props.icon color="primary" fontSize='small'/>}
          <Typography variant="body1" fontSize="large" sx={{ fontWeight: "700" }} ml={1}>
            {title}
          </Typography>
        </FlexBox>

        <Box className="sidenav">
          <Sidenav position="left" handle={<Menu fontSize="small" />}>
            {navigation}
          </Sidenav>
        </Box>

        {!isTablet && button}
      </FlexBox>

      {isTablet && !!button && <Box mt={2}>{button}</Box>}
    </StyledBox>
  );
};
export default memo(UserDashboardHeader);
