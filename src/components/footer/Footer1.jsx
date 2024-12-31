import Link from "next/link";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography,
  Container,
  Grid,
  IconButton,
  styled,
  TextField,
  FormControl,
  useMediaQuery,
  Chip,
  Autocomplete,
  Alert,
} from "@mui/material";
import Image from "components/BazaarImage";
import { FlexBox } from "components/flex-box";
import PhoneInput from "react-phone-input-2";
import { getMediaPath } from "lib";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../utils/axiosInstance";
import CancelIcon from "@mui/icons-material/Cancel";
import { displaySnackBar } from "common/snackBar";
import Twitter from "components/icons/Twitter";
import Youtube from "components/icons/Youtube";
import Facebook from "components/icons/Facebook";
import Instagram from "components/icons/Instagram";
import { companyPolicy } from "common/staticData";
import { customerCareLinks } from "common/staticData";

// styled component
const StyledLink = styled(Link)(({ theme }) => ({
  display: "block",
  borderRadius: 4,
  cursor: "pointer",
  position: "relative",
  padding: "0.3rem 0rem",
  color: theme.palette.grey[500],
  "&:hover": {
    color: theme.palette.grey[100],
  },
}));

const useStyles = makeStyles((theme) => ({
  textField: {
    "& .MuiInputLabel-root": {
      color: "#AEB4BE", // Change label color here
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#AEB4BE", // Change border color here
      },
      "&:hover fieldset": {
        borderColor: "white", // Change border color on hover here
      },
      "&.Mui-focused fieldset": {
        borderColor: "white", // Change border color when focused here
      },
      "& .MuiInputBase-input": {
        color: "#fff", // Change input value color here
      },
    },
  },
  formControl: {
    color: "#fff", // Change label color here
    "& .MuiInputLabel-root": {
      color: "#AEB4BE", // Change label color here
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#AEB4BE", // Change border color here
      },
      "&:hover fieldset": {
        borderColor: "#fff", // Change border color on hover here
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff", // Change border color when focused here
      },
    },
    "& .MuiSelect-select": {
      color: "#fff", // Change selected value color here
    },
    "& .MuiListItem-root.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.2)", // Change selected item background color here
    },
    "& .MuiSelect-icon": {
      color: "#AEB4BE", // Change dropdown arrow color here
    },
  },
}));

const Footer1 = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const appdatalogo = useSelector((state) => state?.shop?.appdata?.app);
  const subject = useSelector((state) => state?.shop?.updateSubject);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const iconList = [
    {
      icon: Facebook,
      url: appdatalogo?.socialMedia?.facebook,
    },
    {
      icon: Twitter,
      url: appdatalogo?.socialMedia?.twitter,
    },
    {
      icon: Youtube,
      url: appdatalogo?.socialMedia?.youtube,
    },
    {
      icon: Instagram,
      url: appdatalogo?.socialMedia?.instagram,
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDelete = (id) => {
    // Filter out the selected ID from formData.subject
    const updatedSubjects = formData.subject.filter(
      (selectedId) => selectedId !== id
    );

    // Update formData with the new array of subjects
    setFormData({ ...formData, subject: updatedSubjects });
  };

  const handleSubjectChange = (e, newValue) => {
    setFormData({ ...formData, subject: newValue.map((option) => option._id) });
  };

  const handleSubjectDelete = (idToDelete) => {
    setFormData({
      ...formData,
      subject: formData.subject.filter((id) => id !== idToDelete),
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const { data } = await api.post("user/subscribe", {
        name: formData?.name ?? "",
        email: formData?.email ?? "",
        phone: formData?.phone ?? "",
        subjects: formData?.subject ?? "",
      });

      if (data.status) {
        setSuccessMessage(data.message);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: [],
        });
      } else {
        if (
          data.message ===
          "Your subscription has already been successfully processed. Thank you for being a part of our community!"
        ) {
          setErrorMessage(data.message);
        } else {
          displaySnackBar(data?.message, "error", "bottom", "right");
        }
      }
    } catch (error) {
      displaySnackBar(
        "Subscription failed. Please try again.",
        "error",
        "bottom",
        "right"
      );
    }
  };

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  return (
    <footer>
      <Box bgcolor="#222935">
        <Container
          sx={{
            p: "1rem",
            color: "white",
          }}
        >
          <Box py={3} overflow="hidden">
            <Grid container spacing={2}>
              <Grid item lg={3} md={6} sm={6} xs={12}>
                <Link href="/">
                  <Image
                    width={"50%"}
                    src={getMediaPath(appdatalogo?.generalSetting?.logo?.url)}
                    alt="logo"
                  />
                </Link>
                <Box
                  py={0.6}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                  color="grey.500"
                >
                  <span style={{ color: "#fff" }}>Address :</span> &nbsp;
                  <Link
                    sx={{
                      cursor: "pointer",
                      fontWeight: 700,
                      color: "grey",
                      color: "primary.secondary",
                    }}
                    href=""
                  >
                    {appdatalogo?.generalSetting?.address}
                  </Link>
                </Box>
                <Box
                  py={0.6}
                  color="grey.500"
                  sx={{
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  <span style={{ color: "#fff" }}>Email :</span>&nbsp;
                  <Link
                    sx={{ cursor: "pointer" }}
                    href={"mailto:" + appdatalogo?.generalSetting?.email}
                  >
                    {appdatalogo?.generalSetting?.email}
                  </Link>
                </Box>
                <Box
                  py={0.6}
                  mb={2}
                  color="grey.500"
                  sx={{
                    "&:hover": {
                      color: "#fff",
                    },
                  }}
                >
                  <span style={{ color: "#fff" }}>Phone :</span>&nbsp;
                  <Link
                    color="grey.500"
                    href={"tel:" + appdatalogo?.generalSetting?.phone}
                  >
                    {appdatalogo?.generalSetting?.phone}
                  </Link>
                </Box>
                <FlexBox className="flex" mx={-0.625}>
                  {iconList.map((item, ind) => (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopenner"
                      key={ind}
                    >
                      <IconButton
                        sx={{
                          margin: 0.5,
                          fontSize: 12,
                          padding: "10px",
                          backgroundColor: "rgba(0,0,0,0.2)",
                        }}
                      >
                        <item.icon
                          fontSize="inherit"
                          sx={{
                            color: "white",
                          }}
                        />
                      </IconButton>
                    </a>
                  ))}
                </FlexBox>
                {/* <AppStore /> */}
              </Grid>

              <Grid item lg={2} md={2} sm={2} xs={12}>
                <Box
                  fontSize="18px"
                  fontWeight="600"
                  mb={1.5}
                  lineHeight="1"
                  color="white"
                >
                  Consumer Policy
                </Box>

                <div>
                  {companyPolicy?.map((item, ind) => {
                    return (
                      <StyledLink href={`/${item.value}`} key={ind}>
                        {item.name}
                      </StyledLink>
                    );
                  })}
                </div>
              </Grid>

              <Grid item lg={2} md={6} sm={6} xs={12}>
                <Box
                  fontSize="18px"
                  fontWeight="600"
                  mb={1.5}
                  lineHeight="1"
                  color="white"
                >
                  Useful Link
                </Box>

                <div>
                  {customerCareLinks?.map((item, ind) => (
                    <StyledLink href={`/${item?.value}`} key={ind}>
                      {item?.name}
                    </StyledLink>
                  ))}
                </div>
              </Grid>

              <Grid item lg={5} md={6} sm={6} xs={12}>
                <Box
                  fontSize="18px"
                  fontWeight="600"
                  mb={1.5}
                  lineHeight="1"
                  color="white"
                  // textAlign={"center"}
                >
                  Newsletter
                </Box>

                {errorMessage ? (
                  <Box py={3} overflow="hidden">
                    <Alert variant="standard" severity="info">
                      You are already subscribed to our newsletter.
                    </Alert>
                  </Box>
                ) : successMessage ? (
                  <Box py={3} overflow="hidden">
                    <Alert variant="filled" severity="success">
                      You have successfully subscribed to our newsletter
                    </Alert>
                  </Box>
                ) : (
                  <Box sx={{ mt: -0.5 }}>
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            className={classes.textField}
                            size="small"
                            placeholder="Name"
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            fullWidth
                          />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <PhoneInput
                            fullWidth
                            inputStyle={{
                              width: "100%",
                              height: "39px",
                              fontSize: "15px",
                              fontFamily: "Monospace",
                              border: "1px solid #AEB4BE",
                              backgroundColor: "rgba(0, 0, 0, 0)",
                              color: "white",
                            }}
                            dropdownStyle={{
                              color: "#AEB4BE",
                            }}
                            country={"in"}
                            variant="outlined"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="+91"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            className={classes.textField}
                            size="small"
                            placeholder="Email"
                            type="email"
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl
                            fullWidth
                            className={classes.formControl}
                          >
                            <InputLabel id="subject-label" size="small">
                              Subject
                            </InputLabel>
                            <Autocomplete
                              multiple
                              id="items"
                              options={subject}
                              filterSelectedOptions
                              getOptionLabel={(option) => option?.title}
                              value={subject.filter((item) =>
                                formData.subject.includes(item._id)
                              )}
                              onChange={handleSubjectChange}
                              renderTags={(selected, getTagProps) =>
                                selected.map((option, index) => (
                                  <Chip
                                    key={option._id}
                                    label={option.title}
                                    onDelete={() => handleDelete(option._id)}
                                    deleteIcon={<CancelIcon />}
                                    sx={{
                                      backgroundColor: "#fff",
                                      color: "black",
                                      border: "1px solid #000",
                                    }}
                                    {...getTagProps({ index })}
                                  />
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder="Select Items"
                                />
                              )}
                              sx={{ mg: 2 }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{
                              "&:hover": {
                                backgroundColor: "#3399cc",
                              },
                            }}
                            type="submit"
                            color="primary"
                          >
                            Subscribe
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                )}
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ mb: 2 }}>DISCLAIMER</Typography>
              <Typography
                variant="body2"
                py={0.6}
                color="grey.500"
                textAlign="justify"
              >
                This site is not a part of WhatsApp or Facebook / Meta.
                Mentioned names or logos are properties of their respective
                companies. The information on this website is for educational
                purposes only, we neither support nor be held responsible for
                any misuse of this info. This tool is not affiliated with any
                brand or website. Buyer must use the software responsibly and
                adhere to the website terms or usage policy (or whatever is
                applicable). it’s just a standalone tool that can facilitate and
                extend some options in WhatsApp. it’s not a spam tool and not
                allowed to use it for spamming or violating WhatsApp policies.
                This tool automates a natural human’s behavior to save his/her
                time in manually collecting data already AVAILABLE PUBLICALLY
                and we do not take responsibility for how the buyer uses this
                software. All disputes are subject to Delhi jurisdiction.
              </Typography>
            </Box>
            <Box mt={4}>
              <Typography
                variant="body2"
                color="primary"
                sx={{
                  fontWeight: 700,
                  marginBottom: isMobile ? 5 : 0,
                  textAlign: isMobile ? "center" : "",
                }}
              >
                © Copyright {new Date().getFullYear()}. All Rights Reserved by{" "}
                {appdatalogo?.title}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer1;
