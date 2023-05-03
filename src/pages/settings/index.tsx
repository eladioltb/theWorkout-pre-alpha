import { MainLayout } from "@/layouts";
import { Button, Card, CardContent, CardHeader, Grid } from "@mui/material";
import { ArrowForwardIos, CreditCardOutlined, InfoOutlined, LightbulbOutlined, LockOutlined, QuestionMarkOutlined, StraightenOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";

const SettingsPage = () => {

  const router = useRouter();

  const buttonStyle =  {
    color: 'white', 
    borderWidth: '2px', 
    justifyContent: 'space-between', 
    fontSize: '1rem', 
    fontWeight: 'bold', 
    textTransform: 'capitalize',
    background: 'linear-gradient(#262626, #262626) padding-box, linear-gradient(to right, rgba(255,89,89,1) 0%, rgba(255,113,83,1) 35%, rgba(255,137,87,1) 70%, rgba(255,89,89,1)) border-box',
    borderRadius: '10px',
    border: '2px solid transparent'
  }

  return(
    <>
      <MainLayout title="Settings" pageDescription="">
        <Grid container spacing={3}>
          
          <Grid item xs={12}>
            <Card style={{backgroundColor: '#060606', margin: '0 .25rem', borderRadius: '10px'}}>
              <CardHeader sx={{padding: '16px 16px 0'}} title={'Account'} disableTypography />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button startIcon={<LockOutlined />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle} onClick={() => router.replace('/settings/account')}>Account</Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Button startIcon={<CreditCardOutlined />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle}>Suscription</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card style={{backgroundColor: '#060606', margin: '0 .25rem', borderRadius: '10px'}}>
              <CardHeader sx={{padding: '16px 16px 0'}} title={'Preference'} disableTypography />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button startIcon={<StraightenOutlined />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle}>
                      Mesure units
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card style={{backgroundColor: '#060606', margin: '0 .25rem', borderRadius: '10px'}}>
              <CardHeader sx={{padding: '16px 16px 0'}} title={'Help'} disableTypography />
              <CardContent>
                <Grid container spacing={3}>

                  <Grid item xs={12}>
                    <Button
                      startIcon={<QuestionMarkOutlined />}
                      endIcon={<ArrowForwardIos />}
                      variant={'outlined'}
                      size={'large'} 
                      fullWidth
                      sx={buttonStyle}
                    >
                      Frequently Asked Questions
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      startIcon={<LightbulbOutlined />}
                      endIcon={<ArrowForwardIos />}
                      variant={'outlined'}
                      size={'large'} 
                      fullWidth
                      sx={buttonStyle}
                    >
                      Feature Request
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      startIcon={<InfoOutlined />}
                      endIcon={<ArrowForwardIos />}
                      variant={'outlined'}
                      size={'large'} 
                      fullWidth
                      sx={buttonStyle}
                    >
                      About
                    </Button>
                  </Grid>

                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </MainLayout>
    </>
  )
}

export default SettingsPage;
