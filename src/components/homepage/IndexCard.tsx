import React, { FC, useContext } from 'react';
import Link from 'next/link';
import { Box, Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material';
import { AuthContext } from '../../../context';

interface Props {
  url: string,
  img: string,
  title: string
}

export const IndexCard: FC<Props> = ({ url, img, title }) => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Grid
      item
      xs={12}
      md={4}
      xl={12}
    >
      <Card className='fadeIn'>
        <Link href={url} passHref prefetch={false}>
            <CardActionArea sx={{ height: { 
              xs: isLoggedIn ? 'calc(31vh - 50px)' : 'calc(30vh - 50px)', 
              md: 'calc(100vh - 185px)',
              xl: 'calc(30vh - 50px)',
            }}}>
              <CardMedia
                component='img'
                className='fadeIn'
                image={`/img/${img}.jpg`}
                alt={title}
                sx={{ height: '100%', objectFit: "full", objectPosition: 'center center' }}
              />
              <Box sx={{
                position: 'absolute',
                background: 'linear-gradient(180deg, rgba(2,0,36,0) 0%, rgba(0,0,0,0.4) 65%, rgba(0,0,0,0.8) 100%)',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                display: 'block',
              }}></Box>
              <Typography
                color="#FFF"
                sx={{
                  position: 'absolute',
                  zIndex: 99,
                  bottom: '20px',
                  left: '20px'
                }}
                variant={'h5'}
                fontWeight={800}>{title}</Typography>
            </CardActionArea>
        </Link>
      </Card>
    </Grid>
  );
};
