import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Add,
  ExpandMore,
  Facebook,
  Instagram,
  Remove,
  Twitter,
  Login,
  YouTube,
} from "@mui/icons-material"; // Added Login icon
import {
  Box,
  Chip,
  Container,
  IconButton,
  MenuItem,
  styled,
  useMediaQuery,
} from "@mui/material";
import TouchRipple from "@mui/material/ButtonBase";
import { Span } from "components/Typography";
import { FlexBetween } from "components/flex-box";
import BazaarMenu from "components/BazaarMenu";
import { layoutConstant } from "utils/constants";
import { useRouter } from "next/navigation";
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from "react-redux";
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import { setCurrency } from "../../src/redux/reducers/shop.reducer"

// styled component
const TopbarWrapper = styled(Box, {
  shouldForwardProp: (props) => props !== "bgColor",
})(({ theme, bgColor, expand }) => ({
  fontSize: 12,
  height: layoutConstant.topbarHeight,
  color: theme.palette.secondary.contrastText,
  background: bgColor || theme.palette.grey[900],
  transition: "height 300ms ease",
  "& .menuItem": {
    minWidth: 100,
  },
  "& .marginRight": {
    marginRight: "1.25rem",
  },
  "& .expand": {
    display: "none",
    padding: 0,
  },
  "& .handler": {
    height: layoutConstant.topbarHeight,
    width: "60px"
  },
  "& .menuTitle": {
    fontSize: 12,
    // marginLeft: "1.5rem",
    fontWeight: 600,
    width: "15vh"
  },
  [theme.breakpoints.down("sm")]: {
    height: expand ? 80 : layoutConstant.topbarHeight,
    "& .topbarRight": {
      display: expand ? "flex" : "none",
      paddingBottom: 5,
    },
    "& .expand": {
      display: "block",
      height: layoutConstant.topbarHeight,
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
}));
const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    flexDirection: "column",
  },
}));

const useStyles = makeStyles((theme) => ({
  formControl: {
    color: '#fff', // Change label color here
    '& .MuiInputLabel-root': {
      color: '#AEB4BE', // Change label color here
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#AEB4BE', // Change border color here
      },
      '&:hover fieldset': {
        borderColor: '#fff', // Change border color on hover here
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff', // Change border color when focused here
      },
    },
    '& .MuiSelect-select': {
      color: '#fff', // Change selected value color here
    },
    '& .MuiListItem-root.Mui-selected': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change selected item background color here
    },
    border: 'none',
  },
}));

// ===========================================

// ===========================================

const Topbar = ({ bgColor }) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const appdatalogo = useSelector((state) => state?.shop?.appdata?.app)
  const currencies = useSelector((state) => state?.shop?.currencies)
  const selectedCurrency = useSelector((state) => state?.shop?.currency)
  const router = useRouter();

  const [expand, setExpand] = useState(false);

  useMemo(() => {
   
  }, [dispatch])


  const socialLinks = [
    {
      id: 1,
      Icon: Twitter,
      url: appdatalogo?.socialMedia?.twitter,
    },
    {
      id: 2,
      Icon: Facebook,
      url: appdatalogo?.socialMedia?.facebook,
    },
    {
      id: 3,
      Icon: Instagram,
      url: appdatalogo?.socialMedia?.instagram,
    },
    {
      id: 4,
      Icon: YouTube,
      url: appdatalogo?.socialMedia?.youtube,
    },
  ];
  const onCurrencyChange = async (currency) => {
    dispatch(setCurrency(currency))
  }
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  
  return (
    <TopbarWrapper bgColor={bgColor} expand={expand ? 1 : 0}>
      <StyledContainer>
        <FlexBetween width="100%" px={1}>
          <Box sx={{display: isMobile ? "" : "flex" ,alignItems:"center"}} gap={5}
          >

            <Box display="flex" alignItems="center" mb={isMobile ? 0 : 0}>
              <EmailIcon sx={{ fontSize:isMobile ? "18px" : "", mr: 1 }} />
              <Link sx={{ cursor: 'pointer' }} href={"mailto:" + appdatalogo?.generalSetting?.email} >
                {appdatalogo?.generalSetting?.email}
              </Link>
            </Box>
            <Box display="flex" alignItems="center" mb={isMobile ? 0 : 0}>
              <CallIcon sx={{ fontSize:isMobile ? "18px" : "", mr: 1 }} />
              <Link sx={{ cursor: 'pointer' }} href={"tel:" + appdatalogo?.generalSetting?.phone}>
                {appdatalogo?.generalSetting?.phone}
              </Link>
            </Box>
            
          </Box>

          <IconButton
            disableRipple
            className="expand"
            onClick={() => setExpand((state) => !state)}
          >
            {expand ? <Remove /> : <Add />}
          </IconButton>
        </FlexBetween>
        <Box sx={{display:"flex",alignItems:"center"}} className="topbarRight">
          <BazaarMenu
            handler={
              <TouchRipple className="handler marginRight">
                <Span className="menuTitle">
                  {selectedCurrency?.currency}
                </Span>
                <ExpandMore fontSize="inherit" />
              </TouchRipple>
            }
            // sx={{ position: "absolute", left: "4px" }}
          >
            {currencies?.map((item) => (
              <MenuItem
                // sx={{ width: "10vh", padding: "8px 16px", display: "flex", justifyContent: "space-between" }}
                // width="100vh"
                key={item?.id}
                className="menuItem"
                onClick={() => onCurrencyChange(item)}
              >
                <Span className="menuTitle">{item?.currency}</Span>
              </MenuItem>
            ))}
          </BazaarMenu>


          <Box sx={{display:"flex",justifyContent:"start",alignItems:"center"}} gap={1.5}>
            {/* Social Links */}
            {socialLinks?.map(({ id, Icon, url }) => (
              <Link href={url ?? ""} key={id} target="_blank" >
                <Icon
                  sx={{
                    // ml:1,
                    fontSize: 16,
                  }}
                />
              </Link>
            ))}

            {/* Reseller and Master Dropdown */}
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
              {appdatalogo?.socialMedia?.reseller && (
                <Link sx={{ cursor: 'pointer' }} href={appdatalogo?.socialMedia?.reseller}>
                  <Chip
                    label="Reseller"
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      color: "white",
                      fontWeight: 600,
                      backgroundColor: "primary.main",
                      "& .MuiChip-label": {
                        pl: ".8rem",
                        pr: ".8rem",
                      },
                    }}
                  />
                </Link>
              )}
              {appdatalogo?.socialMedia?.master && (
                <Link sx={{ cursor: 'pointer' }} href={appdatalogo?.socialMedia?.master}>
                  <Chip
                    label="Master"
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      color: "white",
                      fontWeight: 700,
                      backgroundColor: "primary.main",
                      "& .MuiChip-label": {
                        pl: ".8rem",
                        pr: ".8rem",
                      },
                    }}
                  />
                </Link>
              )}
           </Box>
          </Box>
        </Box>
      </StyledContainer>
    </TopbarWrapper>
  );
};
export default Topbar;
