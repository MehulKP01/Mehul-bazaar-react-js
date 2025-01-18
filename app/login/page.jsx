"use client";

const SEO = lazy(() => import("../../src/components/SEO"));
const Login = lazy(() => import("../../src/pages-sections/sessions/Login"));

import { FlexRowCenter } from "components/flex-box";
import { useRouter } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import { lazy } from "react";

const LoginPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const onSuccess = () => router.back();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <FlexRowCenter flexDirection="column" p={isMobile ? 2 : 10}>
      <SEO title="Login" />
      <Login onSuccess={onSuccess} isModal={false} />
    </FlexRowCenter>
  );
};
export default LoginPage;
