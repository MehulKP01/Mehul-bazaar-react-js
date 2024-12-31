import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import React from 'react'



const Card2 = ({ title, content, icon }) => {
    return (
        <Card sx={{
            height: 350,
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            },
        }}>
            <CardContent sx={{ paddingX: 5, paddingY: 3 }}>
                {icon}
                <Typography marginTop={1} gutterBottom fontSize={24} fontWeight={700} component="div" marginBottom={3}>
                    {title}
                </Typography>
                <Typography color="text.secondary" fontSize={15}>
                    {content}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default Card2