import { MainLayout } from "@/layouts";
import { ArrowForwardIos, BadgeRounded, Person, EmailRounded, PasswordOutlined, AccessibilityNewRounded, DeleteRounded } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid, Link } from "@mui/material";

const AccountPage = () => {

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

  return (
    <MainLayout title="Account settings" pageDescription="">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card style={{backgroundColor: '#060606', margin: '1rem .25rem', borderRadius: '10px'}}>
            <CardHeader sx={{padding: '16px 16px 0'}} title={'Account preference'} disableTypography />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Link href='account/name' sx={{textDecoration: 'none'}}>
                    <Button startIcon={<BadgeRounded />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle}>Name</Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Link href="account/email" sx={{textDecoration: 'none'}}>
                    <Button startIcon={<EmailRounded />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle}>Email</Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Link href="account/password" sx={{textDecoration: 'none'}}>
                    <Button startIcon={<PasswordOutlined />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle}>Password</Button>
                  </Link>
                </Grid>
                <Grid item xs={12}>
                  <Button startIcon={<AccessibilityNewRounded />} endIcon={<ArrowForwardIos />} variant={'outlined'} size={'large'}  fullWidth sx={buttonStyle}>Mesurements</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card style={{backgroundColor: 'transparent', backgroundImage: 'none', margin: '0 .25rem', borderRadius: '10px'}}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button startIcon={<DeleteRounded />} variant={'outlined'} size={'large'}  fullWidth color="error" sx={{textTransform: 'inherit'}}>Delete account</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  )
}

export default AccountPage;
