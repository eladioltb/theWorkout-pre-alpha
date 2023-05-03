import Image from "next/image";
import { AuthLayout } from "@/layouts";
import { Box, Button, ToggleButtonGroup, ToggleButton, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { validations } from "../../../utils";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext, UiContext } from "../../../context";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

type FormData = {
  name    : string;
  email   : string;
  password: string;
  confirmPassword: string;
  weightUnit: string;
};

const RegisterPage = () => {

  const router = useRouter();
  const { registerUser } = useContext( AuthContext );
  const { handleAlertMessage } = useContext(UiContext);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [ showError, setShowError ] = useState(false);
  const [ alignment, setAlignment ] = useState<string>('kg');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if(newAlignment !== null) setAlignment(newAlignment);
  };

  const onRegisterForm = async( { name, email, password, weightUnit }: FormData ) => {

    weightUnit = alignment;
    console.log({name, email, password, weightUnit});

    setShowError(false);
    const resp = await registerUser(name, email, password, weightUnit);
    if(resp.status !== 200){
      handleAlertMessage({alertMessage: resp.message, displayAlert: true, severity: 'error'});
    }else{
      handleAlertMessage({alertMessage: resp.message, displayAlert: true, severity: 'success'});
      await setTimeout(() => {signIn('credentials',{ email, password }).then(() => {return router.back()});}, 5000);
    }

  };

  return (
    <>
      <AuthLayout title="Register" pageDescription="" noBackgroundImage>

        <Button sx={{justifyContent: 'flex-start', marginTop: '1.5rem', width: 'fit-content'}} variant="text" onClick={() => router.push('/auth/login')} startIcon={<ArrowBackIosIcon />} />

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2.5rem 0 3rem'}}>
          <Typography variant="h1" align="center" sx={{fontSize: '2rem'}}>
            Welcome to
          </Typography>
          <Image src={'/img/logo/dark/logo_theworkout.png'} alt='' width={300} height={62}/>
        </div>

        <div>
          <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
            <Box>
              <Grid container
                direction={'column'}
                justifyContent={'center'}
                spacing={3}
              >
                <Grid item xs={12}>
                  <TextField
                    id="name"
                    variant="outlined"
                    placeholder="Name"
                    type={'name'}
                    fullWidth
                    {...register('name', {
                      required: 'This field is required',
                    })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{color: '#838383'}} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="email"
                    variant="outlined"
                    placeholder="Email"
                    type={'email'}
                    fullWidth
                    {...register('email', {
                      required: 'This field is required',
                      validate: validations.isEmail
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{color: '#838383'}} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="password"
                    placeholder="Password"
                    variant="outlined"
                    type={'password'}
                    fullWidth
                    {...register('password', {
                      required: 'This field is required',
                      minLength: { value: 6, message: '6 characters minimum' }
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{color: '#838383'}} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="confirm-password"
                    placeholder=" Confirm Password"
                    variant="outlined"
                    type={'password'}
                    fullWidth
                    {...register('password', {
                      required: 'This field is required',
                      minLength: { value: 6, message: '6 characters minimum' },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{color: '#838383'}} />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <ToggleButtonGroup
                    id="weightUnit"
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleAlignment}
                    aria-label="text alignment"
                    fullWidth
                    aria-required
                  >
                    <ToggleButton value="kg" aria-label="left aligned" {...register('weightUnit')}>
                      KG
                    </ToggleButton>
                    <ToggleButton value="lbs" aria-label="centered" {...register('weightUnit')}>
                        LBS
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" fullWidth sx={{color: 'white', fontWeight: 'bold', padding: '1rem', marginTop: '2rem'}}>
                Create account
              </Button>
            </Box>
          </form>
        </div>

      </AuthLayout>
    </>
  )
}

export default RegisterPage;
