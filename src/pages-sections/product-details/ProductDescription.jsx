import { Box } from "@mui/material";
import { Paragraph } from "components/Typography";
import { useMemo } from "react";

const ProductDescription = ({ product, selectedVariant }) => {
  const productDescription = useMemo(() => {
    if (product.type === "variation") {
      return selectedVariant ? selectedVariant?.description : "";
    }
    return product?.description || "";
  }, [product, selectedVariant]);

  return (
    <Box>
      <Box className="ql-editor" sx={{ textAlign: "justify", mx: 2 }}>
        <Paragraph dangerouslySetInnerHTML={{ __html: productDescription }} />
      </Box>
    </Box>
  );
};
export default ProductDescription;
