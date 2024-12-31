import React, { forwardRef } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import PersonOutline from "@mui/icons-material/PersonOutline";

export const CustomIconButton = forwardRef((props, ref) => (
    <IconButton
        {...props}
        ref={ref}
        sx={{
            padding: 0,
            mx: 1,
            ...props.sx, // Allow external styles to override
        }}
        aria-haspopup="true"
    >
        <Box
            p={1.25}
            bgcolor="grey.200"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%", // Optional: to match IconButton styling
                ...props.boxSx, // Allow external styles for the Box
            }}
        >
            <PersonOutline />
        </Box>
    </IconButton>
));
