"use client"

import React, { useState, useEffect,useRef, memo } from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { keyframes } from '@mui/system';
import { Handshake, Key } from '@mui/icons-material';
import { getStatisticData } from 'utils/__api__/homeApis';
import { useDispatch } from 'react-redux';
import { setGlobalRatings } from '../../redux/reducers/ratings.reducer';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const StatBox = ({ icon, number, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = number / (duration / 16.66); // approximation for 60 FPS

    const animate = () => {
      start += increment;
      if (start < number) {
        setCount(Math.ceil(start));
        requestAnimationFrame(animate);
      } else {
        setCount(number);
      }
    };

    const intervalId = setInterval(() => {
      start = 0;
      requestAnimationFrame(animate);
    }, 5000); // Repeat every 5 seconds

    // Start the first animation
    requestAnimationFrame(animate);

    return () => clearInterval(intervalId);
  }, [isVisible, number]);

  return (
    <Box ref={ref} sx={{ textAlign: 'center' }}>
      {icon}
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', my: 1 }}>
        {count.toLocaleString()}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
};



const Banner3 = () => {

  const dispatch = useDispatch()
  const [statsData, setStatsData] = useState()

  useEffect(() => {
    const getStats = async () => {
      const data = await getStatisticData();
      if (data) {
        dispatch(setGlobalRatings(data))
        setStatsData(data);
      } else {
        setStatsData({});
      }
    };
    getStats();
  }, []);


  return (
    <Container maxWidth="lg" sx={{ mb: 15,mt:0 }}>
      <Typography variant="h4" component="h4" align="center" gutterBottom color="primary">
        Why choose Digi Bulk Marketing, not others?
      </Typography>
      
      <Typography variant="body1" align="center" paragraph sx={{ mb: 4 }} >
        Digi Bulk Marketing software is most popular solution to send bulk WA notification messages. It's a software to developed for to grow your business to help you generate quality leads and inturn more sales. We use bank-level encryption for 100% data security only you have to access to see your data. We are only one in the industry they provide you AI mechanism.
      </Typography>

      <Paper elevation={3} sx={{  p: 4, borderRadius: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <StatBox 
              icon={<Key sx={{ fontSize: 40, color: 'primary.main' }} />}
              number={statsData?.totalKeys||"20000+"}
              label="TOTAL ACTIVE KEYS"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatBox 
              icon={<Handshake sx={{ fontSize: 40, color: 'primary.main' }} />}
              number={statsData?.resellers||"10000"}
              label="RESELLERS"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StatBox 
              icon={<PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
              number={statsData?.activeUsers||"10000"}
              label="DAILY ACTIVE USERS"
            />
          </Grid>
        </Grid>
      </Paper>

    </Container>
  );
};

export default memo(Banner3);


