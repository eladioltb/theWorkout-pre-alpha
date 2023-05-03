import { useMediaQuery, useTheme } from "@mui/material";
import { FC, useContext } from "react";
import { AuthContext } from "../../context";
import Head from "next/head";
import { Roboto } from 'next/font/google'
import { HeaderComponent, NavbarComponent } from "@/components";
import styles from '@/styles/layouts/MainLayout.module.scss'


interface Props {
  children?: any;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  noWorkout?: boolean;
}

const roboto = Roboto({ 
  weight: ["100","300","400","500","700","900"],
  display: 'swap',
  subsets: ['latin'] 
})

export const MainLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl, noWorkout }) => {

  const { isLoggedIn, user } = useContext(AuthContext);
  const theme = useTheme();
  const mediaQuery = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Head>
        <title>{`${title} | The Workout`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={pageDescription} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={pageDescription} />
        {
          imageFullUrl && <meta name="og:image" content={imageFullUrl} />
        }
      </Head>
      <div className={roboto.className} style={{padding: '2.5vh 3vw 0vh'}}>
        <HeaderComponent  userImage={user?.image} />
        <main className={styles.main}>
          <section className={styles.container}>
            {children}
          </section>
        </main>
      </div>
      <NavbarComponent userLogged={isLoggedIn} />
    </>
  )
}
