import { lazy, useEffect, useState } from "react";
import { Button, Card, Box, styled, Typography } from "@mui/material";
import { Link } from "react-scroll";
import { Formik } from "formik";
import { H1 } from "components/Typography";
import BazaarImage from "components/BazaarImage";
import CircularProgress from "@mui/material/CircularProgress";
import { loginFailure, loginSuccess } from "../../redux/reducers/user.reducer";
import { useDispatch, useSelector } from "react-redux";
const PhoneInput = lazy(() => import("react-phone-input-2"));
import "react-phone-input-2/lib/style.css";
import { api } from "../../utils/axiosInstance";
import { MuiOtpInput } from "mui-one-time-password-input";
import { getMediaPath } from "lib";
import { getAppDataLogo } from "../../redux/action";
import { useMediaQuery } from "@mui/material";
import { getCookie, setCookie } from "cookies-next";
import ClearIcon from "@mui/icons-material/Clear";
import { FlexBetween } from "components/flex-box";
import { displaySnackBar } from "common/snackBar";

const fbStyle = {
  background: "#3B5998",
  color: "white",
};
const googleStyle = {
  background: "#4285F4",
  color: "white",
};
export const Wrapper = styled(({ children, passwordVisibility, ...rest }) => (
  <Card {...rest}>{children}</Card>
))(({ theme, passwordVisibility }) => ({
  width: 500,
  padding: "2rem 3rem",
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  ".passwordEye": {
    color: passwordVisibility
      ? theme.palette.grey[600]
      : theme.palette.grey[400],
  },
  ".facebookButton": {
    marginBottom: 10,
    ...fbStyle,
    "&:hover": fbStyle,
  },
  ".googleButton": {
    ...googleStyle,
    "&:hover": googleStyle,
  },
  ".agreement": {
    marginTop: 12,
    marginBottom: 24,
  },
  ".react-tel-input .country-list": {
    position: "",
  },
}));

const Login = ({ onSuccess, closeModal, isModal = true }) => {
  const userData = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(60);
  const [timer, setTimer] = useState(false);

  const appdatalogo = useSelector((state) => state?.shop?.appdata.app);

  useEffect(() => {
    dispatch(getAppDataLogo());
  }, [dispatch]);
  useEffect(() => {
    const timeCheck =
      isOtpSent === true
        ? setTimeout(() => {
            setTick(tick - 1);
          }, 1000)
        : "";
    if (tick < 1) {
      clearTimeout(timeCheck);
    }
  }, [tick, isOtpSent]);

  const startTimer = () => {
    setTimer(true);
    setTick(60);
  };

  const sendOTP = async () => {
    const guestId = getCookie("guest-id");
    setLoading(true);

    const { data } = await api.post("auth/send-otp", {
      auth_type: "phone",
      phone: "+" + phone,
      guest_id: guestId,
    });
    if (data.status) {
      setIsOtpSent(true);
      startTimer();
      displaySnackBar(data?.message, "success", "top", "right");
    } else {
      displaySnackBar(data?.message, "error", "top", "right");
      setIsOtpSent(false);
    }

    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    const guestId = getCookie("guest-id");

    const { data } = await api.post("auth/verify-otp", {
      auth_type: "phone",
      phone: "+" + phone,
      otp: otp,
      guest_id: guestId,
    });

    if (data?.status) {
      setCookie("is-guest", data?.user?.isGuest);
      setCookie("user", data?.user);
      setCookie("auth-token", data?.token);
      setCookie("user-id", data?.user?.id);
      setCookie("guest-id", data?.user?.id);
      dispatch(
        loginSuccess({
          token: data?.token,
          user: data?.user,
          isGuest:
            data?.user?.role === "user" || data?.user?.role === "admin"
              ? data?.user?.isGuest
              : true,
        })
      );

      if (typeof onSuccess === "function") {
        onSuccess();
      }

      displaySnackBar("Login Success", "success", "top", "right");
    } else {
      dispatch(
        loginFailure({
          error: data.message,
        })
      );
      displaySnackBar(
        data?.message || "An unknown error occurred",
        "error",
        "top",
        "right"
      );
    }

    setLoading(false);
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <Wrapper
      // elevation={3}
      passwordVisibility={false}
    >
      <FlexBetween>
        <BazaarImage
          height={isMobile ? 40 : 44}
          src={getMediaPath(appdatalogo?.generalSetting?.logo?.url)}
          alt="logo"
          sx={{
            m: "auto",
          }}
        />

        {isModal && (
          <ClearIcon
            color="primary"
            onClick={closeModal}
            sx={{ cursor: "pointer" }}
          />
        )}
      </FlexBetween>

      <H1 textAlign="center" mt={1} mb={4} fontSize={isMobile ? 14 : 16}>
        Welcome To {appdatalogo?.title}
      </H1>

      {!isOtpSent ? (
        <Formik
          initialValues={{ phone: phone }}
          validate={(values) => {
            const errors = {};
          }}
          onSubmit={(values, { setSubmitting }) => {
            sendOTP();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Typography
                sx={{
                  color: "grey",
                  fontSize: "14px",
                  marginTop: "-10px",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                Enter Mobile Number
              </Typography>

              <PhoneInput
                containerStyle={{
                  marginBottom: "18px",
                }}
                inputStyle={{
                  width: isMobile ? "100%" : "400px",
                  height: isMobile ? "50px" : "60px",
                  fontSize: "18px",
                  fontFamily: "Monospace",
                  paddingLeft: "50px",
                  color: "#5d5959",
                }}
                dropdownStyle={{
                  width: isMobile ? "230px" : "400px",
                  position: isMobile ? "" : "absolute",
                }}
                country={"in"}
                variant="outlined"
                value={phone}
                onChange={(number) => {
                  setPhone(number);
                  setError("");
                }}
                placeholder="+91"
                buttonStyle={{
                  boxSizing: "none",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />

              {errors.phone && touched.phone && errors.phone}

              {/* Replace Button onClick with type="submit" */}
              <Button
                fullWidth
                type="submit" // Change from onClick to type="submit"
                variant="contained"
                sx={{
                  height: 44,
                  color: "white",
                  bgcolor: "#3399cc",
                  "&:hover": {
                    backgroundColor: "#3399cc",
                  },
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                    }}
                  >
                    <CircularProgress size="2rem" style={{ color: "white" }} />
                  </Box>
                ) : (
                  <>Send OTP</>
                )}
              </Button>
            </form>
          )}
        </Formik>
      ) : (
        <Formik
          initialValues={{ otp: otp }}
          validate={(values) => {
            const errors = {};
          }}
          onSubmit={(values, { setSubmitting }) => {
            verifyOtp();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Typography>
                <Typography>
                  <Typography
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "0px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#000000",
                        fontSize: "14px",
                      }}
                    >
                      {`+${phone}`}
                    </Typography>
                    <Typography
                      sx={{ mx: 2, cursor: "pointer" }}
                      color="primary"
                    >
                      <Link
                        onClick={() => {
                          setIsOtpSent(false);
                          setOtp("");
                        }}
                        rel="noreferrer"
                      >
                        Change Number
                      </Link>
                    </Typography>
                  </Typography>

                  <Typography
                    sx={{
                      color: "grey",
                      fontSize: "14px",
                      textAlign: "center", //
                      marginTop: "10px", //
                      marginBottom: "12px",
                    }}
                  >
                    A 6-digit OTP has been sent to your phone number.
                  </Typography>
                </Typography>
              </Typography>

              <MuiOtpInput
                TextFieldsProps={{
                  type: "text",
                  size: "medium",
                  placeholder: "-",
                }}
                my={3}
                length={6}
                autoFocus
                gap={0.5}
                value={otp}
                onChange={(value) => setOtp(value)}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  height: 44,
                  color: "white",
                  bgcolor: "#3399cc",
                  "&:hover": {
                    backgroundColor: "#3399cc",
                  },
                }}
              >
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItem: "center",
                      color: "white",
                      py: 2,
                    }}
                  >
                    <CircularProgress size="2rem" style={{ color: "white" }} />
                  </Box>
                ) : (
                  <>Verify & Proceed</>
                )}
              </Button>
              <Typography
                color={"#3399cc"}
                // mb={"2px"}
                align={"center"}
                mt={"10px"}
              >
                {tick > 0 ? (tick >= 10 ? `00:${tick}` : `00:0${tick}`) : ""}
              </Typography>
              <Typography
                textAlign={"center"}
                mt={1}
                sx={{ marginBottom: "-16px" }}
              >
                Did not receive OTP?
                <Link
                  onClick={() => {
                    startTimer();
                    displaySnackBar(
                      `Otp Send on this number ${phone}`,
                      "success",
                      "top",
                      "right"
                    );
                  }}
                  style={
                    tick > 0
                      ? {
                          color: "gray",
                          cursor: "not-allowed",
                        }
                      : {
                          color: "#d23f57",
                          cursor: "pointer",
                          fontWeight: 600,
                        }
                  }
                  underline="none"
                >
                  <span> Resend OTP</span>
                </Link>
              </Typography>
            </form>
          )}
        </Formik>
      )}
    </Wrapper>
  );
};

export default Login;
