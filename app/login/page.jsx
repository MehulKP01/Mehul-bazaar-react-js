"use client";

const SEO = dynamic (()=> import("../../src/components/SEO"),{ ssr : false });
const Login = dynamic (()=> import("../../src/pages-sections/sessions/Login"),{ ssr : false });

import { FlexRowCenter } from "components/flex-box";
import { useRouter } from "next/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import dynamic from "next/dynamic";

const LoginPage = () => {
  const theme = useTheme();
  const router = useRouter();
  const onSuccess = () => router.back();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  
  return (
    <FlexRowCenter
      flexDirection="column"
      p={isMobile ? 2 : 10}
    >
      <SEO title="Login" />
      <Login onSuccess={onSuccess} isModal={false}/>
    </FlexRowCenter>
  );
};
export default LoginPage;
