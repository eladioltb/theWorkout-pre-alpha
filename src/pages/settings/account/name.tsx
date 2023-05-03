import { MainLayout } from "@/layouts";
import { BorderColorRounded } from "@mui/icons-material";
import { Button, Card, CardContent, CardHeader, Grid, InputAdornment, TextField } from "@mui/material";
import { useContext } from "react";
import { AuthContext, UiContext } from "../../../../context";
import { useForm } from "react-hook-form";

type FormData = {
  newName: string
};

const NamePage = () => {

  const { user, updateUserData } = useContext(AuthContext);
  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>();
  const { handleAlertMessage } = useContext(UiContext);

  const onChangeName = async( { newName }: FormData ) => {
    if(newName.length < 2) {
      handleAlertMessage({ alertMessage: 'Min length of 2 characters.', displayAlert: true, severity: "warning" });
      return;
    }
    const resp = await updateUserData(user!.email, newName, 'name');
    if(resp.status !== 200){
      handleAlertMessage({alertMessage: resp.message, displayAlert: true, severity: 'error'});
    }else{
      handleAlertMessage({alertMessage: resp.message, displayAlert: true, severity: 'success'});
      await setTimeout(() => reset(), 5000);
    }
  };

  return (
    <MainLayout title="Name settings" pageDescription="">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <form onSubmit={handleSubmit(onChangeName)} noValidate>
            <Card style={{backgroundColor: '#060606', margin: '1rem .25rem', borderRadius: '10px'}}>
              <CardHeader sx={{padding: '16px 16px 0'}} title={'Name change'} disableTypography />
              <CardContent>
                <Grid container
                    direction={'column'}
                    justifyContent={'center'}
                    spacing={3}
                  >
                    <Grid item xs={12}>
                      <TextField
                        id="newName" 
                        variant="outlined"
                        placeholder={user.name}
                        type={'name'}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                            </InputAdornment>
                          )
                        }}
                        { ...register('newName')}
                      />
                    </Grid>
                  </Grid>
              </CardContent>
            </Card>
            <Card style={{backgroundColor: 'transparent', backgroundImage: 'none', margin: '0 .25rem', borderRadius: '10px'}}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button type="submit" startIcon={<BorderColorRounded />} variant={'contained'} size={'large'}  fullWidth color="primary" sx={{textTransform: 'inherit', color: 'white', fontWeight: 'bold'}}>Save changes</Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </Grid>
      </Grid>
    </MainLayout>
  )
}

export default NamePage;
