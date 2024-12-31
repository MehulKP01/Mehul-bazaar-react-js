// import Link from "next/link";
// import { useEffect, useMemo, useState } from "react";
// import {
//     Add,
//     ExpandMore,
//     Facebook,
//     Instagram,
//     Remove,
//     Twitter,
//     Login,
// } from "@mui/icons-material"; // Added Login icon
// import {
//     Box,
//     Chip,
//     Container,
//     FormControl,
//     IconButton,
//     InputLabel,
//     MenuItem,
//     Select,
//     styled,
// } from "@mui/material";
// import TouchRipple from "@mui/material/ButtonBase";
// import { H4, Span } from "components/Typography";
// import { FlexBetween, FlexBox } from "components/flex-box";
// import BazaarMenu from "components/BazaarMenu";
// import { layoutConstant } from "utils/constants";
// import { useRouter } from "next/navigation";
// import countryList from "../../pages/countryList.json";
// import { makeStyles } from '@material-ui/core/styles';
// import { Stack, height } from "@mui/system";
// import { useDispatch, useSelector } from "react-redux";
// import CallIcon from '@mui/icons-material/Call';
// import EmailIcon from '@mui/icons-material/Email';
// import { getCountryCode, setCurrency } from "../../src/redux/reducers/shop.reducer"
// import { getCurrencyCode } from "../../src/redux/action"
// import { currencyFormat } from "lib";
// // styled component
// const TopbarWrapper = styled(Box, {
//     shouldForwardProp: (props) => props !== "bgColor",
// })(({ theme, bgColor, expand }) => ({
//     fontSize: 12,
//     height: 80,
//     color: theme.palette.secondary.contrastText,
//     background: bgColor || theme.palette.grey[900],
//     transition: "height 300ms ease",
//     "& .menuItem": {
//         minWidth: 100,
//     },
//     "& .marginRight": {
//         marginRight: "1.25rem",
//     },
//     "& .expand": {
//         display: "none",
//         padding: 0,
//     },
//     "& .handler": {
//         height: layoutConstant.topbarHeight,
//     },
//     "& .menuTitle": {
//         fontSize: 12,
//         // marginLeft: "1.5rem",
//         fontWeight: 600,
//         width: "15vh"
//     },
//     [theme.breakpoints.down("sm")]: {
//         height: expand ? 80 : layoutConstant.topbarHeight,
//         "& .topbarRight": {
//             display: expand ? "flex" : "none",
//             paddingBottom: 5,
//         },
//         "& .expand": {
//             display: "block",
//             height: layoutConstant.topbarHeight,
//         },
//         "& .MuiSvgIcon-root": {
//             color: "white",
//         },
//     },
// }));
// const StyledContainer = styled(Container)(({ theme }) => ({
//     height: "100%",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//     [theme.breakpoints.down("sm")]: {
//         alignItems: "start",
//         flexDirection: "column",
//     },
// }));

// const useStyles = makeStyles((theme) => ({
//     formControl: {
//         color: '#fff', // Change label color here
//         '& .MuiInputLabel-root': {
//             color: '#AEB4BE', // Change label color here
//         },
//         '& .MuiOutlinedInput-root': {
//             '& fieldset': {
//                 borderColor: '#AEB4BE', // Change border color here
//             },
//             '&:hover fieldset': {
//                 borderColor: '#fff', // Change border color on hover here
//             },
//             '&.Mui-focused fieldset': {
//                 borderColor: '#fff', // Change border color when focused here
//             },
//         },
//         '& .MuiSelect-select': {
//             color: '#fff', // Change selected value color here
//         },
//         '& .MuiListItem-root.Mui-selected': {
//             backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change selected item background color here
//         },
//         border: 'none',
//     },
// }));

// // ===========================================

// // ===========================================

// const TopCountries = ({ bgColor }) => {
//     const classes = useStyles();

//     const [expandS, setExpandS] = useState(false);

//     // const onCurrencyChange = async (currency) => {
//     //     dispatch(setCurrency(currency))
//     // }

//     return (
//         <TopbarWrapper sx={{backgroundColor:"#3399cc"}} expand={expandS ? 1 : 0}>
//             <StyledContainer>
//                 <FlexBetween width="100%">
//                     <FlexBox alignItems="center" gap={5}>
//                         <H4>Choose another country or region to see content specific to your location and shop online.</H4>
//                     </FlexBox>

//                     <IconButton
//                         disableRipple
//                         className="expand"
//                         onClick={() => setExpandS((state) => !state)}
//                     >
//                         {expandS ? <Remove /> : <Add />}
//                     </IconButton>
//                 </FlexBetween>
//                 <FlexBox className="topbarRight" alignItems="center">
//                     <BazaarMenu
//                         handler={
//                             <TouchRipple className="handler marginRight">
//                                 <Span className="menuTitle">
//                                     {/* {selectedCurrency.currency} */}
//                                 </Span>
//                                 <ExpandMore fontSize="inherit" />
//                             </TouchRipple>
//                         }
//                         sx={{ height: "30vh", minWidth: "10vh", maxHeight: "50vh" }}
//                     >
//                         {/* {currencies?.map((item) => (
//               <MenuItem
//                 sx={{ width: "10vh", padding: "8px 16px", display: "flex", justifyContent: "space-between" }}
//                 key={item?.id}
//                 className="menuItem"
//                 onClick={() => onCurrencyChange(item)}
//               >
//                 <Span className="menuTitle">{item?.currency}</Span>
//               </MenuItem>
//             ))} */}
//                     </BazaarMenu>

//                 </FlexBox>
//             </StyledContainer>
//         </TopbarWrapper>
//     );
// };
// export default TopCountries;