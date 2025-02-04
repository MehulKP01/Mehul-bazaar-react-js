import { Grid, styled } from "@mui/material";
import BazaarImage from "../../components/BazaarImage";
import { FlexBetween } from "../../components/flex-box";
import { Paragraph } from "../../components/Typography";
import { getMediaPath } from "../../lib";
import { memo } from "react";

// styled component
const StyledBox = styled(FlexBetween)(({ theme }) => ({
  ".title": {
    fontSize: 50,
    marginTop: 0,
    lineHeight: 1.2,
    marginBottom: "1.35rem",
  },
  [theme.breakpoints.up("sm")]: {
    ".grid-item": {
      minHeight: 424,
      display: "flex",
      alignItems: "baseline",
      flexDirection: "column",
      justifyContent: "center",
    },
  },
  [theme.breakpoints.down("sm")]: {
    marginLeft: 0,
    paddingLeft: 0,
    ".title": {
      fontSize: 32,
    },
  },
  [theme.breakpoints.down("xs")]: {
    ".title": {
      fontSize: 16,
    },
    ".title + *": {
      fontSize: 13,
    },
    ".button-link": {
      height: 36,
      padding: "0 1.5rem",
      fontSize: 13,
    },
  },
}));

// ==================================================

// ==================================================

const CarouselCard1 = ({
  title,
  image,
  buttonLink,
  buttonText,
  description = "",
  buttonColor = "primary",
}) => {
  return (
    <StyledBox>
      <Grid container spacing={3} alignItems="center">
        <Grid item className="grid-item" md={5} sm={6} xs={12}>
          <h1  className="title">{title}</h1>
          <Paragraph my={2} dangerouslySetInnerHTML={{ __html: description }} />
        </Grid>

        <Grid item md={7} sm={6} xs={12}>
          <BazaarImage
            src={getMediaPath(image?.url)}
            alt="apple-watch-1"
            sx={{
              mx: "auto",
              maxHeight: 400,
              display: "block",
              maxWidth: "100%",
            }}
          />
        </Grid>
      </Grid>
    </StyledBox>
  );
};
export default memo(CarouselCard1);
