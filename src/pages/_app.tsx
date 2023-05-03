import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { StatsProvider, UiProvider } from '../../context';
import { darkTheme, lightTheme } from '../themes';
import { RoutineProvider } from '../../context/routine';
import { WorkoutProvider } from '../../context/workout';
import { AuthProvider } from '../../context/auth';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface CustomProps {
  session: Session;
}

function MyApp({ Component, pageProps, session }: AppProps & CustomProps) {
  return (
    <SessionProvider session={session}>
      <SWRConfig
        value={{
          refreshInterval: 86400
        }}
      >
        <AuthProvider>
          <UiProvider>
            <RoutineProvider>
              <WorkoutProvider>
                <StatsProvider>
                  <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </StatsProvider>
              </WorkoutProvider>
            </RoutineProvider>
          </UiProvider>
        </AuthProvider>
      </SWRConfig>
    </SessionProvider>
  );
}

export default MyApp;