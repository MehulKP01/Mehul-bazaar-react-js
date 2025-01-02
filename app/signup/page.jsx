"use client"

const SEO = lazy(()=> import("./../../src/components/SEO"));
import { FlexRowCenter } from "../../src/components/flex-box";
const Signup = lazy(()=> import("../../src/pages-sections/sessions/Signup"));
import { lazy } from "react";
const SignUpPage = () => {
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Sign up" />
      <Signup />
    </FlexRowCenter>
  );
};
export default SignUpPage;
