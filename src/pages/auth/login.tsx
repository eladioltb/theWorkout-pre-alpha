import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Box, Button, Divider, Grid, IconButton, Input, InputAdornment, InputLabel, TextField, Typography } from "@mui/material";
import { AuthLayout } from "@/layouts";
import { validations } from "../../../utils";
import { UiContext } from "../../../context";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Image from "next/image";

type FormData = {
  email: string,
  password: string,
};

const LoginPage = () => {

  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const { handleAlertMessage } = useContext(UiContext);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then(prov => {
      setProviders(prov);
    });
  }, []);

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);

    // PROD
    const login = await signIn('credentials', { email, password, redirect: false });
    if (login?.error) {
      handleAlertMessage({ alertMessage: `${login?.error}`, displayAlert: true, severity: 'error' });
    } else {
      const endpoint = router.query.p || '';
      window.location.replace(`${window.location.origin}${endpoint}`);
    }
  };

  return (
    <>
      <AuthLayout title='Login' pageDescription="" noBackgroundImage>

        <Button sx={{justifyContent: 'flex-start', marginBottom: '2.5rem', marginTop: '1.5rem', width: 'fit-content'}} variant="text" onClick={() => router.push('/auth')} startIcon={<ArrowBackIosIcon />} />

        <div>
          <Typography align="left" width={'80vw'} variant="h3" sx={{fontWeight: 'bold', fontSize: '2.2rem'}}>
            Hey,
            <br/>
            Welcome back.
          </Typography>
          <Typography variant="subtitle2">
            <span style={{color: '#838383'}}>If you are new/</span> <Link href={'register'}>Create new</Link>
          </Typography>
        </div>

        <div style={{marginTop: '5rem'}}>
          <form onSubmit={handleSubmit(onLoginUser)} noValidate>
            <Box>
              <Grid container
                direction={'column'}
                justifyContent={'center'}
                spacing={4}
              >
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
              </Grid>
            </Box>
            <Typography variant="subtitle2" mt={2}>
              <span style={{color: '#838383'}}>Forgot Password? /</span> <Link href={'register'}>Reset</Link>
            </Typography>
            <Button type="submit" variant="contained" fullWidth sx={{color: 'white', fontWeight: 'bold', padding: '.75rem', marginTop: '3rem'}}>
              Login
            </Button>
          </form>
        </div>


        <Divider sx={{width: '80%', margin: '2rem 10%'}} />

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>    
          <IconButton aria-label="google" style={{backgroundColor: 'white', color: 'black', borderRadius: '10px'}}>
            <Image alt="" src='/img/login_options/google.png' width='30' height='30' />
          </IconButton>  
          <IconButton aria-label="apple" style={{backgroundColor: 'white', color: 'black', borderRadius: '10px'}}>
            <Image alt="" src='/img/login_options/apple.png' width='30' height='30' />
          </IconButton>  
          <IconButton aria-label="facebook" style={{backgroundColor: 'white', color: 'black', borderRadius: '10px'}}>
            <Image alt="" src='/img/login_options/meta.png' width='30' height='22' style={{margin: '4px 0'}} />
          </IconButton>
        </div>

      </AuthLayout>
    </>
  );
}

export default LoginPage;
