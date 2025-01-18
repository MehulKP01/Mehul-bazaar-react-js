"use client";

import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
const useStyles = makeStyles((theme) => ({
  accordion: {
    marginBottom: theme.spacing(2),
  },
}));
import { faqData } from "../../src/common/staticData";
import Image from "next/image";

const faqs = () => {
  const theme = useTheme();
  const classes = useStyles();

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="body1"
        fontSize={"large"}
        sx={{
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: 1,
          fontWeight: 700,
        }}
      >
        <LiveHelpIcon fontSize="small" color="primary" />
        FAQ
      </Typography>
      <Grid spacing={3}>
        <Box textAlign="center" p={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Frequently Asked Questions
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Take a important knowledge about software.!
          </Typography>
        </Box>
        <Grid md={6} lg={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            <Image
              src="/assets/images/banners/faq-mini.png"
              alt="FAQ"
              width={350}
              height={312}
            />
          </Box>
        </Grid>
        <Grid md={6} lg={12} mb={5}>
          {faqData?.map((faq, index) => (
            <Accordion
              key={index}
              className={classes.accordion}
              expanded={expanded === index}
              onChange={handleChange(index)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="subtitle1" sx={{ fontSize: "18px" }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default faqs;
