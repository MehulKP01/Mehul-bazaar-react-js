"use client";
import {
  Box,
  Button,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Carousel from "../../components/carousel/Carousel";
import { CarouselCard1 } from "../../components/carousel-cards";
import { FlexBetween } from "components/flex-box";
import { getCarouselData } from "../../utils/__api__/homeApis";
import { isValidArray } from "../../common/validation";
import { memo, useEffect, useState } from "react";
import Skeleton from "@mui/material/Skeleton";
// ======================================================

const Section1 = () => {
  const banner =
    "https://www.shutterstock.com/image-vector/ecommerce-website-banner-template-presents-260nw-2252124451.jpg";

  const [carouselData, setCarouselData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setIsLoading(true);
    const getCarousel = async () => {
      const data = await getCarouselData();
      if (isValidArray(data)) {
        setIsLoading(false);
        setCarouselData(data);
      } else {
        setIsLoading(false);
        setCarouselData([]);
      }
    };

    getCarousel();
  }, []);

  return !isLoading ? (
    <Box bgcolor="white" mb={7.5}>
      <Container
        sx={{
          py: 4,
          position: "relative",
        }}
        maxWidth="lg"
      >
        {carouselData?.length > 0 ? (
          <Carousel
            spacing="0px"
            totalSlides={carouselData?.length > 0 ? carouselData?.length : 2}
            infinite={true}
            showDots={true}
            autoPlay={true}
            visibleSlides={1}
            showArrow={false}
          >
            {carouselData?.map((data, ind) => (
              <CarouselCard1 {...data} key={ind} />
            ))}
          </Carousel>
        ) : (
          <>
            <FlexBetween flexDirection={isMobile ? "column" : "row"}>
              {isMobile && (
                <Box
                  component="img"
                  src="/assets/images/banners/bann.png"
                  sx={{
                    width: "100%",
                    height: "auto",
                    mb: 2,
                  }}
                  alt="banner"
                />
              )}
              <Box
                mt={4}
                sx={{
                  width: isMobile ? "100%" : "50%",
                  padding: isMobile ? 2 : 0,
                  backgroundColor: isMobile
                    ? "rgba(255, 255, 255, 0.8)"
                    : "transparent",
                }}
              >
                <Typography
                  variant={isMobile ? "h6" : "h5"}
                  gutterBottom
                  fontWeight="bold"
                  color="primary"
                  textAlign={isMobile ? "center" : "justify"}
                >
                  Grow Your Business with Ethical Marketing
                </Typography>
                <Typography variant="body1" paragraph>
                  Choose the right tools and strategies to achieve your next
                  success, while respecting customer privacy and building trust.
                </Typography>
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  paragraph
                  fontWeight="medium"
                >
                  Leveraging ethical marketing software can streamline your
                  campaigns, ensure compliance with regulations, and enhance
                  customer relationships.
                </Typography>
                <Typography variant="body2" paragraph textAlign="justify">
                  Utilize Business Sender and Bulk WhatsApp tools to efficiently
                  reach your audience, ensuring your messages are both targeted
                  and respectful.
                </Typography>
                <Box
                  display="flex"
                  justifyContent={isMobile ? "center" : "flex-start"}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    href="https://digibulkmarketing.com/in/product/button-sender"
                    sx={{
                      mt: 2,
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      boxShadow: 3,
                      "&:hover": {
                        boxShadow: 5,
                      },
                    }}
                  >
                    Learn About WhatsApp Business
                  </Button>
                </Box>
              </Box>
              {!isMobile && (
                <Box
                  component="img"
                  src="/assets/images/banners/bann.png"
                  sx={{
                    width: "50%",
                    height: "auto",
                  }}
                  alt="banner"
                />
              )}
            </FlexBetween>
          </>
        )}
      </Container>
    </Box>
  ) : (
    <Box bgcolor="white" mb={7.5}>
      <Container
        sx={{
          py: 4,
          position: "relative",
        }}
        maxWidth="lg"
      >
        <Box>
          <Skeleton height={"100px"} />
          <Skeleton animation="wave" height={"100px"} />
          <Skeleton animation={false} height={"100px"} />
        </Box>
      </Container>
    </Box>
  );
};
export default memo(Section1);
