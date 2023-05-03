import { MainLayout } from '@/layouts';
import { Grid } from '@mui/material';
import { IndexCard } from '@/components';

export default function Home() {
  return (
    <>
      <MainLayout title='Homepage' pageDescription=''>
        <Grid container spacing={2}>
          <IndexCard url={'/exercises'} img={'exercises'} title={'Get all exercises'} />
          <IndexCard url={'/routines'} img={'routines'} title={'Go to routines list'} />
          <IndexCard url={'/stats'} img={'progress'} title={'Check my progress'} />
        </Grid>
      </MainLayout>
    </>
  )
}
