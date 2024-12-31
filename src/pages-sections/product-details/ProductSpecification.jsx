import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const ProductSpecification = ({ product, selectedVariant }) => {
  const specifications = product?.attributes || [];
  return (
    <Box sx={{ margin: 2 }}>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="product specifications">
          <TableHead>
            <TableRow>
              <StyledTableCell>Attribute</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {specifications.map((spec) => (
              <StyledTableRow key={spec.name}>
                <StyledTableCell component="th" scope="row">
                  {spec.name}
                </StyledTableCell>
                <StyledTableCell>
                  {spec?.items?.filter(data => selectedVariant?.dimensions?.some(a => a.attributeItemId === data?._id))?.map(item => item.name).join(', ')}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ProductSpecification;