import { useMediaQuery, useTheme } from "@mui/material";
import { Roboto } from "next/font/google";
import { FC } from "react";
import styles from '@/styles/layouts/AuthLayout.module.scss'
import Head from "next/head";
import { HeaderComponent } from "@/components";

interface Props {
  children?: any;
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  noBackgroundImage?: boolean;
}

const roboto = Roboto({ 
  weight: ["100","300","400","500","700","900"],
  display: 'swap',
  subsets: ['latin'] 
})

export const AuthLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl, noBackgroundImage }) => {

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
      <div className={roboto.className}>
        <main className={(!noBackgroundImage) ? styles.main_background : styles.main_noBackground}>
          {
            (noBackgroundImage)
              ? <section className={styles.container}>{children}</section>
              : children 
          }
        </main>
      </div>
    </>
  )
}