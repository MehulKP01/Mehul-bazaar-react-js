"use client";

import { CardGiftcard } from "@mui/icons-material";
import { CircularProgress, Pagination } from "@mui/material";
const UserDashboardHeader = lazy(() =>
  import("../../src/components/header/UserDashboardHeader")
);
const CustomerDashboardLayout = lazy(() =>
  import("../../src/components/layouts/customer-dashboard")
);
const CustomerDashboardNavigation = lazy(() =>
  import("../../src/components/layouts/customer-dashboard/Navigations")
);
import { Box, Typography, Card, styled } from "@mui/material";
import { lazy, useEffect, useState } from "react";
import { api } from "../../src/utils/axiosInstance";
import { useTheme, useMediaQuery } from "@mui/material";

const HistoryContainer = styled(Box)({
  marginTop: "20px",
  width: "100%",
});

const HistoryCard = styled(Card)({
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "10px",
  marginBottom: "10px",
  width: "100%",
  flexDirection: "row",
  textAlign: "center",
});

const HeaderCard = styled(HistoryCard)({
  fontWeight: "bold",
});

const Column = styled(Box)({
  flex: 1,
  padding: "0 5px",
  textAlign: "center",
});

const SizeTypography = styled(Typography)({
  fontSize: "15px",
});

function Rewards() {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [availablePoints, setAvailablePoints] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const rowsPerPage = 5;
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchPointsHistory = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.post("/user/get-all-user-point", {
          limit: rowsPerPage,
          page: currentPage - 1,
        });

        if (data?.status) {
          setPointsHistory(data?.userPointData?.userPointData);
          setAvailablePoints(data?.userPointData?.availablePoints);
          setTotal(data?.total);
        }
      } catch (error) {
        console.error("Failed to fetch points history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPointsHistory();
  }, [currentPage]);

  const totalPages = Math.ceil(total / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <CustomerDashboardLayout>
      <UserDashboardHeader
        icon={CardGiftcard}
        title="My Points"
        navigation={<CustomerDashboardNavigation />}
      />
      <Box display="flex" gap={1}>
        {isLoading == false && (
          <>
            <Typography variant="subtitle1">{availablePoints}</Typography>
            <Typography variant="subtitle1">Points</Typography>
          </>
        )}
      </Box>

      <Typography variant="h6" mt={2}>
        Points History
      </Typography>

      <Box display="flex" justifyContent="center">
        <HistoryContainer>
          <HeaderCard>
            <Column>
              <SizeTypography>Sr No.</SizeTypography>
            </Column>
            <Column>
              <SizeTypography>OrderId</SizeTypography>
            </Column>
            <Column>
              <SizeTypography>Reason</SizeTypography>
            </Column>
            <Column>
              <SizeTypography>Points</SizeTypography>
            </Column>
            <Column>
              <SizeTypography>Date</SizeTypography>
            </Column>
          </HeaderCard>

          {isLoading ? (
            <Box
              sx={{
                my: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <CircularProgress size="2rem" />
            </Box>
          ) : (
            pointsHistory.map((item, index) => (
              <HistoryCard key={item._id}>
                <Column>
                  <SizeTypography>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </SizeTypography>
                </Column>
                <Column>
                  <SizeTypography>{item.orderId}</SizeTypography>
                </Column>
                <Column>
                  <SizeTypography>
                    {item.reason === "earn" ? "Purchase" : "Redemption"}
                  </SizeTypography>
                </Column>
                <Column>
                  <SizeTypography>
                    {item.point > 0 ? `+${item.point}` : item.point}
                  </SizeTypography>
                </Column>
                <Column>
                  <SizeTypography>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </SizeTypography>
                </Column>
              </HistoryCard>
            ))
          )}
        </HistoryContainer>
      </Box>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          color="primary"
          variant="outlined"
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          size={isMobile ? "small" : "medium"}
        />
      </Box>
    </CustomerDashboardLayout>
  );
}

export default Rewards;
