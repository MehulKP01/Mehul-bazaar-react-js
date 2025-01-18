"use client";

import { lazy, memo, useEffect, useState } from "react";
import Link from "next/link";
import { Box, Skeleton, Typography } from "@mui/material";
const BazaarCard = lazy(()=> import("components/BazaarCard"));
import { FlexBox } from "components/flex-box";
import HoverBox from "components/HoverBox";
import LazyImage from "components/LazyImage";
import GiftBox from "components/icons/GiftBox";
import useWindowSize from "hooks/useWindowSize";
const Carousel = lazy(()=> import("../../components/carousel/Carousel"));
const CategorySectionCreator = lazy(()=> import("components/CategorySectionCreator"));
import { calculateDiscount, currencyFormat, getMediaPath } from "lib";
import { useSelector } from "react-redux";
import { isValidArray } from "common/validation";
import { getBigDiscount } from "utils/__api__/homeApis";

const Section13 = () => {
  const width = useWindowSize();
  const [visibleSlides, setVisibleSlides] = useState(4);
  const currency = useSelector((state) => state?.shop?.currency);

  const [bigDiscountList, setBigDiscountList] = useState([]);

  useEffect(() => {
    const getTopProduct = async () => {
      const data = await getBigDiscount();
      if (isValidArray(data)) {
        setBigDiscountList(data);
      } else {
        setBigDiscountList([]);
      }
    };
    getTopProduct();
  }, []);

  useEffect(() => {
    if (width < 370) setVisibleSlides(1);
    else if (width < 650) setVisibleSlides(2);
    else if (width < 950) setVisibleSlides(3);
    else setVisibleSlides(4);
  }, [width]);
  return (
    <CategorySectionCreator
      icon={<GiftBox />}
      title="Big Discounts"
      seeMoreLink="/shop/?sort-by=big-discount"
    >
      <Box my={2}>
        {bigDiscountList?.length > 0 ? (
          <Carousel
            totalSlides={bigDiscountList?.length || 0}
            visibleSlides={visibleSlides}
          >
            {bigDiscountList?.map((item) => {
              const { badgeId } = item;
              return (
                <Box key={item?.id} px={1}>
                  <BazaarCard
                    sx={{
                      p: 2,
                      height: "100%",
                    }}
                  >
                    <Link href={`/product/${item?.slug}`}>
                      <HoverBox borderRadius="8px" mb={2} sx={{ flex: 1 }}>
                        <Box
                          position="absolute"
                          top={20}
                          left={20}
                          display="flex"
                          gap={1}
                        ></Box>
                        {badgeId && (
                          <Box
                            sx={{
                              position: "absolute",
                              top:
                                badgeId?.place === "top-left" ||
                                badgeId?.place === "top-right"
                                  ? badgeId?.position?.top
                                  : null,
                              left:
                                badgeId?.place === "top-left" ||
                                badgeId?.place === "bottom-left"
                                  ? badgeId?.position?.left
                                  : null,
                              right:
                                badgeId?.place === "top-right" ||
                                badgeId?.place === "bottom-right"
                                  ? badgeId?.position?.right
                                  : null,
                              bottom:
                                badgeId?.place === "bottom-right" ||
                                badgeId?.place === "bottom-left"
                                  ? badgeId?.position?.bottom
                                  : null,
                            }}
                          >
                            {badgeId && badgeId?.image && (
                              <img
                                src={getMediaPath(badgeId?.image?.url ?? "")}
                                alt="Selected Image"
                                style={{
                                  width: badgeId?.size * 100 ?? 0,
                                  aspectRatio: "1",
                                  objectFit: "contain",
                                }}
                              />
                            )}
                          </Box>
                        )}
                        <LazyImage
                          width={500}
                          height={500}
                          alt={item?.name}
                          src={getMediaPath(item?.image?.url)}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </HoverBox>

                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        mb={0.5}
                        noWrap
                      >
                        {item?.name}
                      </Typography>

                      <FlexBox alignItems="center" gap={1}>
                        <Typography variant="h6" color="primary.main">
                          {calculateDiscount(
                            item?.regularPrice,
                            item?.discount,
                            null,
                            currency
                          )}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through" }}
                        >
                          {currencyFormat(item?.regularPrice, currency)}
                        </Typography>
                      </FlexBox>
                    </Link>
                  </BazaarCard>
                </Box>
              );
            })}
          </Carousel>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "30px" }}>
            <Skeleton width={"300px"} height={"300px"} />
            <Skeleton animation="wave" width={"300px"} height={"300px"} />
            <Skeleton animation={false} width={"300px"} height={"300px"} />
            <Skeleton animation="wave" width={"300px"} height={"300px"} />
          </Box>
        )}
      </Box>
    </CategorySectionCreator>
  );
};

export default memo(Section13);
