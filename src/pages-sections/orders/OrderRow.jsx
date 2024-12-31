import Link from "next/link";
import { format } from "date-fns";
import { East } from "@mui/icons-material";
import { Box, Chip, IconButton, Typography, useMediaQuery } from "@mui/material";
import TableRow from "components/TableRow";
import { H5 } from "components/Typography";
import { currencyFormat } from "lib";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
// =================================================

const OrderRow = ({ order,serialNumber  }) => {
  const currency = useSelector((state)=> state?.shop?.currency)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const getColor = (status) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "secondary";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "";
    }
  };
  return (
    <>
   
    <Link href={`/orders/${order.id}`}>
      
      <TableRow
        sx={{
          my: "1rem",
          padding: isMobile ? "12px 8px" : "6px 18px",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "flex-start" : "center",
        }}
      >
        {!isMobile && (
          <H5 m={0.75} textAlign="start" width={isMobile ? "100%" : ""}>
            {serialNumber}
          </H5>
        )}
        <H5 m={0.75} textAlign="center">
          {order.id.split("-")[0]}
        </H5>

        <Box m={0.75} textAlign="center">
          <Chip
            size="small"
            label={order.status}
            sx={{
              // p: "0.25rem 0.5rem",
              fontSize: 12,
              color: !!getColor(order.status)
                ? `${getColor(order.status)}.900`
                : "inherit",
              backgroundColor: !!getColor(order.status)
                ? `${getColor(order.status)}.100`
                : "none",
            }}
          />
        </Box>

        <Typography className="pre" m={0.75} textAlign="center">
          {format(new Date(order.createdAt), "MMM dd, yyyy")}
        </Typography>

        <Typography m={0.75} textAlign="end">
          {currencyFormat(order?.orderTotal,currency)}
        </Typography>

        <Typography
          color="grey.600"
          textAlign="center"
          sx={{
            flex: "0 0 0 !important",
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          <IconButton>
            <East
              fontSize="small"
              color="inherit"
              sx={{
                transform: ({ direction }) =>
                  `rotate(${direction === "rtl" ? "180deg" : "0deg"})`,
              }}
            />
          </IconButton>
        </Typography>
      </TableRow>
    </Link>
    </>
  );
};
export default OrderRow;
