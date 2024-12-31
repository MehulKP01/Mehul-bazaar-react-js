import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Modal,
  styled,
  Button,
  debounce,
  Checkbox,
  TextField,
  IconButton,
  FormControlLabel,
  ClickAwayListener,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  NativeSelect,
} from "@mui/material";
import { H1, Paragraph, Span } from "./Typography";
import { FlexRowCenter } from "./flex-box";
import Facebook from "./icons/Facebook";
import { Twitter, Instagram, Google, Clear } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import {api} from "../utils/axiosInstance";
import { useTheme } from "@emotion/react";
import {newsLetters} from "../../src/redux/reducers/user.reducer"

// styled components
const Wrapper = styled(Box)(({ theme, img }) => ({
  top: "50%",
  padding: 0,
  left: "50%",
  width: "100%",
  maxWidth: 1020,
  height: "auto",
  borderRadius: 8,
  outline: "none",
  position: "absolute",
  boxShadow: theme.shadows[3],
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.between("sm", "md")]: {
    maxWidth: 620,
    padding: 24,
  },
  [theme.breakpoints.up("md")]: {
    padding: 32,
    height: 550,
    backgroundImage: `url(${img})`,
    backgroundRepeat: "no-repeat",
    //   backgroundSize: "contain",
    backgroundPosition: "left",
  },
}));

// ======================================================

// ======================================================

const Newsletter = ({ image = "/assets/images/banners/bulk_whatsapp_sender.png" }) => {
  const dispatch = useDispatch()
  const newsletterStatus = useSelector((state)=>state.user.newsLetter)
  const updatesSubject = useSelector((state)=>state.shop.updateSubject)
  const appdatalogo = useSelector((state) => state.shop.appdata.app)
  const [subscribeData, setSubscribeData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: [],
  });
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    const status = true
    dispatch(newsLetters({status:true}))
    setOpen(false)
  };
  useEffect(() => {
    if(newsletterStatus===false){
    debounce(() => {
      setOpen(true)
    }, 2000)();
  }
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubscribeData({
      ...subscribeData,
      [name]: value,
    });
  };

  const handleSubjectChange = (e) => {
    const {value,checked}= e.target
    
    if(checked)
{
  setSubscribeData({
    ...subscribeData,
    subject: [...subscribeData.subject,value],
  });

}else{

  let subject = subscribeData.subject.filter(id=>id!==value)
  setSubscribeData({
    ...subscribeData,
    subject:subject,
  });
}

    // if(value)

    // const subscribeData = 

  
    // const { value } = e.target;
    // setSubscribeData({
    //   ...subscribeData,
    //   subject: value,
    // });
  };
  const handlePhoneChange = (value) => {
    setSubscribeData({
      ...subscribeData,
      phone: value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    // Handle form submission here
    try {
      const response = await api.post("user/subscribe", {
        name: subscribeData.name,
        email: subscribeData.email,
        phone: subscribeData.phone,
        subjects: subscribeData.subject,
      });
      // const logoData = response.data.app.logo;
      // setLogo(logoData);
    } catch (error) {
      console.error("Error fetching subscribe:", error);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          zIndex: 999999999,
        }}
      >
        <Wrapper img={image} alt="image">
          <Grid container spacing={2}>
            <Grid
              item
              lg={6}
              md={6}
              display={{
                md: "flex",
                xs: "none",
              }}
            />
            <Grid item lg={6} md={6} xs={12} alignItems="center">
              <Box textAlign="center" p={3}>
                <H1 fontSize={22} fontWeight={700} mb={2}>
                  Sign up to <Span color="primary.main">{appdatalogo?.popUp?.title}</Span>
                </H1>
                <Paragraph color="grey.600" mb={2}>
                  {appdatalogo?.popUp?.description}
                </Paragraph>

                <Box sx={{ mt: -0.5 }}>
                  <form onSubmit={handleSubmit} >
                    <Grid container spacing={2} >
                      <Grid item xs={6}>
                        <TextField
                          size="small"
                          placeholder="Name"
                          label="Name"
                          name="name"
                          value={subscribeData.name}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          placeholder="Email"
                          type="email"
                          name="email"
                          label="Email"
                          value={subscribeData.email}
                          onChange={handleInputChange}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Box>
                          <FormControl fullWidth >
                            {/* <InputLabel id="subject-label" size="big">Subject</InputLabel>    */}
                            {updatesSubject?.map((val) => {
                                return(
                                  <FormControlLabel control={<Checkbox  />} 
                                  label={val.title}
                                  value={val._id}
                                  onChange={handleSubjectChange}
                                  />
                                  )
                                }
                              )}
                          </FormControl>
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <PhoneInput
                          inputStyle={{
                            width: "100%",
                            height: "40px",
                            fontSize: "18px",
                            fontFamily: "Monospace",
                            border: '1px solid #AEB4BE', // Change border color here
                            backgroundColor: 'rgba(0, 0, 0, 0)', // Change background color here
                            color: '#AEB4BE'
                          }}
                          dropdownStyle={{
                            // backgroundColor: 'black', // Set dropdown background color
                            color: '#AEB4BE', // Set dropdown text color
                          }}
                          country={"in"}
                          variant="outlined"
                          value={subscribeData.phone}
                          onChange={handlePhoneChange}
                          placeholder="+91"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button fullWidth variant="contained" type="submit" color="primary">
                          Subscribe 
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
                <FlexRowCenter mt={2} mb={2}>
                  <IconButton href={appdatalogo?.socialMedia?.facebook} target="_blank" >
                    <Facebook
                      sx={{
                        fontSize: 20,
                        color: "grey.900",
                      }}
                    />
                  </IconButton>
                      
                  <IconButton href={appdatalogo?.socialMedia?.twitter} target="_blank">
                    <Twitter
                      sx={{
                        fontSize: 20,
                        color: "grey.900",
                      }}
                    />
                  </IconButton>

                  <IconButton href={appdatalogo?.socialMedia?.instagram} target="_blank">
                    <Instagram
                      sx={{
                        fontSize: 20,
                        color: "grey.900",
                      }}
                    />
                  </IconButton>

                  <IconButton href={appdatalogo?.socialMedia?.google} target="_blank">
                    <Google
                      sx={{
                        fontSize: 20,
                        color: "grey.900",
                      }}
                    />
                  </IconButton>
                </FlexRowCenter>

                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="No, Thanks"
                />
              </Box>
            </Grid>
          </Grid>

          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <Clear
              sx={{
                color: "grey.900",
              }}
            />
          </IconButton>
        </Wrapper>
      </Modal>
    </ClickAwayListener>
  );
};
export default Newsletter;
