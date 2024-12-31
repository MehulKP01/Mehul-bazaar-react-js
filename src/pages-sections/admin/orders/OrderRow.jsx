import { useRouter } from "next/navigation";
import { Delete, RemoveRedEye } from "@mui/icons-material";
import { currencyFormat } from "lib";
import {
  StatusWrapper,
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../StyledComponents";
import { format } from "date-fns";
import { useSelector } from "react-redux";

// ========================================================================

// ========================================================================

const OrderRow = ({ order }) => {
  const { amount, id, qty, purchaseDate, billingAddress, status } = order;
  const currency = useSelector((state)=> state?.shop?.currency)
  const router = useRouter();
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">#{id.split("-")[0]}</StyledTableCell>
      <StyledTableCell align="left">{qty}</StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {format(new Date(purchaseDate), "dd MMM yyyy")}
      </StyledTableCell>

      <StyledTableCell
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        {billingAddress}
      </StyledTableCell>

      <StyledTableCell align="left">{currencyFormat(amount,currency)}</StyledTableCell>

      <StyledTableCell align="left">
        <StatusWrapper status={status}>{status}</StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton onClick={() => router.push(`/admin/orders/${id}`)}>
          <RemoveRedEye />
        </StyledIconButton>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
};
export default OrderRow;
