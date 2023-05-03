import { FC, useContext } from "react";
import styles from '@/styles/components/Header.module.scss';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ArrowBackIosNewRounded } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import { UiContext } from "../../../context";
import ContextMenu from "./ContextMenu";

interface Props {
  userImage?: string;
}

export const HeaderComponent:FC<Props> = ({ userImage }) => {

  const { toggleSideMenu } = useContext(UiContext);

  return (
    <>
      <header className={styles.header}>
        <a onClick={toggleSideMenu}>
          { (userImage !== undefined ) 
            ? <Avatar src={`${userImage}`} style={{width: '30px', height: '30px'}} /> 
            : <AccountCircleIcon style={{fontSize: '2rem'}} />
          }
        </a>
      </header>
      <ContextMenu />
    </>
  )
}
