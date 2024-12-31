import { Avatar, Box, Card, Grid, Rating, Typography } from "@mui/material";
import { FlexBox } from "components/flex-box";
import BazaarRating from "components/BazaarRating";
import { H5, H6, Paragraph, Span } from "components/Typography";
import { getDateDifference, getMediaPath } from "lib";
import { Person, Person2, Star, Verified } from "@mui/icons-material";
import { useCallback, useEffect, useMemo, useState } from "react";

// ===========================================================

// ===========================================================

const ProductComment = (props) => {
  const { rating, createdAt, comment, userId } = props;

  const getColor = useCallback((rating) => {
      var color = rating > 3.9 ? "green" : rating > 1.9 ? "warn" : "red";
      console.log(color,rating);

      return {
          "& .MuiRating-iconFilled": {
              color,
          },
      };
  }, []);
  const [starColor,setStarColor]=useState("")
  useEffect(()=>{
    setStarColor(getColor(rating))
  },[rating])

  return (
    <Grid sm={6} >
      <Box p={1}>
      <Card >
      <Box display="flex" m={1} alignItems="baseline">
            <Box
              display="inline-flex"
              alignItems="flex-start"
              borderRadius="2px"
              border="1px solid"
              borderColor="grey.500"
              padding="2px"
              sx={{
                "&:hover": {
                  borderColor: "black",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                ml={1}
                lineHeight={1}
              >
                <Typography
                  variant="body2"
                  fontSize={15}
                  fontWeight="700"
                  component="span"
                  mr={1}
                >
                  {rating}
                </Typography>
                <BazaarRating value={rating || 0} 
                 sx={starColor}
                // color={rating>3.9?"success":
                      // rating>1.9?"yellow":"red"}
                 readOnly fontSize={15} />
              </Box>
            </Box>
            <Box display="flex" alignItems="center" >
          {/* <Avatar
            src={getMediaPath(userId?.profile)}
            sx={{ width: 48, height: 48 }}
            />             */}
        <Box ml={1} display={"flex"} alignItems={"center"} >
          <Typography variant="body1" fontWeight={650}  mb={0.5}>
            {userId?.name}
          </Typography>
          <Box display={"flex"} ml={1} mr={2} justifyContent={"center"} alignItems={"center"}>
            <Verified sx={{fontSize:15}}/>
          </Box>
              
          <Typography variant="body2" color="grey.500">
            {getDateDifference(createdAt)}
          </Typography>
        </Box>
      </Box>
          </Box>
          <Typography variant="body1" m={2} >
        {comment[0].toUpperCase() +comment.slice(1)}
      </Typography>
     
      </Card>
      </Box>
    </Grid>
  );
};
export default ProductComment;
