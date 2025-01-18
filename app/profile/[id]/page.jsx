"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Email, Person, Phone } from "@mui/icons-material";
import { Avatar, Box, Button, InputAdornment, TextField } from "@mui/material";
const Card1 = lazy(() => import("../../../src/components/Card1"));
import { FlexBox } from "../../../src/components/flex-box";
const UserDashboardHeader = lazy(() =>
  import("../../../src/components/header/UserDashboardHeader")
);
const CustomerDashboardLayout = lazy(() =>
  import("../../../src/components/layouts/customer-dashboard")
);
const CustomerDashboardNavigation = lazy(() =>
  import("../../../src/components/layouts/customer-dashboard/Navigations")
);
import { useDispatch, useSelector } from "react-redux";
import { lazy, useEffect, useState } from "react";
import { api } from "../../../src/utils/axiosInstance";
import { makeStyles } from "@material-ui/core/styles";
import { setUseProfile } from "../../../src/redux/reducers/user.reducer";
import { getMediaPath } from "../../../src/lib";
import { displaySnackBar } from "../../../src/common/snackBar";

// ===========================================================
const useStyles = makeStyles((theme) => ({
  success: {
    backgroundColor: "#1976d2",
  },
  profileEditorContainer: {
    padding: theme.spacing(3),
    backgroundColor: "#fff",
    borderRadius: theme.shape.borderRadius,
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  dropZone: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
    border: `1px dashed ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
  },
  submitButton: {
    backgroundColor: "#3399cc",
    color: "white",
    "&:hover": {
      backgroundColor: "#287a9d",
    },
  },
  backButton: {
    backgroundColor: "#3399cc",
    color: "white",
    "&:hover": {
      backgroundColor: "#287a9d",
    },
  },
  formControl: {
    marginBottom: theme.spacing(2),
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiInputAdornment-root": {
      color: theme.palette.primary.main,
    },
  },

  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
}));

const ProfileEditor = () => {
  const classes = useStyles();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [edituserdetails, setEditUserDetails] = useState({});
  const [emailError, setEmailError] = useState("");
  const dispatch = useDispatch();
  const userData = useSelector((state) => state?.user?.user);
  const isGuest = userData?.isGuest || false;

  const params = useParams();

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const validateName = (name) => {
    return name.trim().length > 0 ? "" : "Name is required";
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone) ? "" : "Invalid phone number";
  };
  const userHandleChange = (e) => {
    const { name, value } = e.target;
    setEditUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    let error = "";
    if (name === "email") {
      error = validateEmail(value);
    } else if (name === "name") {
      error = validateName(value);
    } else if (name === "phone") {
      error = validatePhone(value);
    }

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  const getEditUserDetailed = async () => {
    try {
      const response = await api.post("auth/user-profile-by-id");
      const jsonData = response?.data?.user;
      setEditUserDetails(jsonData);
      let img = [{ url: jsonData?.profile }];
      setFile(img);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getEditUserDetailed();
  }, [dispatch, params?.id]);

  const validateEmail = (email) => {
    const gmailRegex =
      /^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/;
    if (!gmailRegex.test(email)) {
      return "Invalid Email";
    }
    return "";
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const errors = {
      name: validateName(edituserdetails?.name),
      email: validateEmail(edituserdetails?.email),
      phone: validatePhone(edituserdetails?.phone),
    };

    setFormErrors(errors);

    if (edituserdetails && edituserdetails?._id) {
      if (file && file.length > 0) {
        const formData = new FormData();
        formData.append("user_id", edituserdetails._id);
        formData.append("name", edituserdetails.name);
        formData.append("email", edituserdetails.email);
        formData.append("phone", edituserdetails.phone);
        formData.append("file", file[0]);
        try {
          const { data } = await api.post("user/profile/save", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (data?.status) {
            dispatch(setUseProfile(data?.user));
            displaySnackBar(data?.message, "success", "top", "right");
            router.push("/profile");
          }
        } catch (error) {
          displaySnackBar(
            "An error occurred while saving the profile",
            "error",
            "top",
            "right"
          );
        }
      } else {
        displaySnackBar(
          "Please select a profile image",
          "error",
          "top",
          "right"
        );
      }
    } else {
      displaySnackBar("Invalid user data", "error", "top", "right");
    }
  };
  const HEADER_LINK = (
    <Button
      href="/profile"
      LinkComponent={Link}
      style={{ background: "#3399cc", color: "white" }}
      sx={{
        px: 4,
      }}
    >
      Back to Profile
    </Button>
  );

  const handleChangeDropZone = (files) => {
    files?.forEach((file) => {
      Object?.assign(file, {
        preview: URL.createObjectURL(file),
      });
    });
    setFile(files);
  };

  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={Person}
        title="Edit Profile"
        button={HEADER_LINK}
        navigation={<CustomerDashboardNavigation />}
      />
      <Card1 className={classes.profileEditorContainer}>
        <FlexBox alignItems="center" flexDirection="column" mb={3}>
          <Avatar
            src={
              file && file[0]
                ? file[0].preview || getMediaPath(file[0].url)
                : ""
            }
            className={classes.avatar}
            alt="avatar"
            sx={{ width: 100, height: 100, marginBottom: 2 }}
          />

          <Box>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-photo"
              type="file"
              onChange={(e) => handleChangeDropZone([e.target.files[0]])}
            />
            <label htmlFor="upload-photo">
              <Button
                variant="contained"
                component="span"
                size="small"
                sx={{ mr: 1 }}
              >
                Change profile
              </Button>
            </label>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setFile(null)}
              disabled={!file || file.length === 0}
            >
              Remove profile
            </Button>
          </Box>
        </FlexBox>
        <form>
          <Box
            mb={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            <TextField
              fullWidth
              name="phone"
              size="small"
              placeholder="Phone Number"
              onChange={userHandleChange}
              label="Phone Number"
              InputProps={{
                shrink: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="primary" />
                  </InputAdornment>
                ),
              }}
              value={edituserdetails?.phone}
              className={classes.formControl}
              disabled={true}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              InputProps={{
                shrink: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
              onChange={userHandleChange}
              value={edituserdetails?.email}
              error={Boolean(emailError)}
              helperText={emailError}
              className={classes.formControl}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              name="name"
              size="small"
              placeholder="Name"
              onChange={userHandleChange}
              label="Name"
              InputProps={{
                shrink: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              value={edituserdetails?.name}
              className={classes.formControl}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitEdit}
              className={classes.submitButton}
            >
              Save Profile
            </Button>
          </Box>
        </form>
      </Card1>
    </CustomerDashboardLayout>
  );
};

export default ProfileEditor;
