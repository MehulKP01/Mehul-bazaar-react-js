import { styled } from "@mui/material";
import BazaarImage from "components/BazaarImage";
import BazaarCard from "components/BazaarCard";
import { H4 } from "components/Typography";
import { getMediaPath } from "lib.js";

// styled component
const StyledBazaarCard = styled(BazaarCard)(({ theme }) => ({
  gap: "1rem",
  display: "flex",
  borderRadius: 5,
  cursor: "pointer",
  alignItems: "center",
  padding: "0.75rem 1rem",
  "&:hover": {
    boxShadow: theme.shadows[2],
  },
}));

// ==============================================================================

// ==============================================================================

const ProductCategoryItem = ({
  title,
  logo,
  isSelected,
  sx = {},
  ...others
}) => {
  return (
    <StyledBazaarCard
      elevation={isSelected ? 2 : 0}
      sx={{
        bgcolor: isSelected ? "white" : "grey.100",
        ...sx,
      }}
      {...others}
    >
      {logo && <BazaarImage alt="" width={30}  src={getMediaPath(logo)} />}

      <H4 lineHeight="1" textTransform="capitalize">
        {title}
      </H4>
    </StyledBazaarCard>
  );
};
export default ProductCategoryItem;
