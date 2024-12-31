"use client"

import { Box, Container, Typography, Button, Fade, Slide, useMediaQuery, useTheme, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useSelector } from 'react-redux';
import { currencyFormat } from '../../lib';
import { memo } from 'react';

const AnimatedContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#fff',
  marginBottom: theme.spacing(5),
  marginTop: 0,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
}));

const GreenSpan = styled('span')({
  color: 'green',
  fontWeight: 'bold',
});

const Banner4 = () => {

  const theme = useTheme()
  const currency = useSelector((state) => state?.shop?.currency) || 'USD';

  const usdPrice = 529;
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Fade in={true} timeout={3000}>
      <AnimatedContainer maxWidth="lg">
        <Box flex={1}
          p={2}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Slide direction="right" in={true} timeout={1500}>
                <Typography variant="body1" gutterBottom paragraph sx={{ mb:1,textAlign:isMobile ? "center" : "start" }}>
                  START FROM <GreenSpan>{currencyFormat(usdPrice, currency)}</GreenSpan>
                </Typography>
              </Slide>
              <Slide direction="left" in={true} timeout={1500} sx={{ mb:1,textAlign:isMobile ? "center" : "start" }}>
                <Typography variant="h4" align="start" sx={{ mb: 1 }} color="primary" fontWeight="bold">
                  World's No.1 Reseller Program
                </Typography>
              </Slide>
              <Slide direction="right" in={true} timeout={1500} sx={{ mb:1,textAlign:isMobile ? "center" : "start" }}>
                <Typography variant="h6" align="start" paragraph sx={{ mb: 2, color: 'secondary.main' }}>
                  20% OFF Offers
                </Typography>
              </Slide>
              <Fade in={true} timeout={1500} >
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  sx={{
                    mb: 1,
                    minWidth: '200px',
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    marginLeft:isMobile ? '50px' : "",
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                  href="https://reseller.digibulkmarketing.com/"
                  target="_blank"
                >
                  JOIN NOW
                </Button>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <Box
                component="img"
                src='/assets/images/banners/handshake-reseller.gif'
                sx={{
                  width: isMobile ? "100%" : "70%",
                  height: "auto",
                  maxHeight: "30vh",
                  mt: isMobile ? 2 : 0
                }}
              />
            </Box>
          </Grid>
          </Grid>
        </Box>
      </AnimatedContainer>
    </Fade>
  );
};

export default memo(Banner4);