import Image from 'next/image'
import { useContext } from "react";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { AuthContext, UiContext } from "../../../context";


const ContextMenu = () => {

  const { isMenuOpen, toggleSideMenu } = useContext(UiContext);
  const { user, isLoggedIn, logout } = useContext(AuthContext);

  return(
    <>
      <Dialog 
        open={isMenuOpen} 
        onClose={toggleSideMenu} 
        style={{margin: '0'}} 
        BackdropProps={{sx: { backgroundColor: 'rgba(0 0 0 / 80%)' }}} 
        PaperProps={{sx: { margin: '1rem' }}}
      >
        <div style={{
            backgroundColor: '#272727', 
            minWidth: 'calc(100vw - 4rem)', 
            padding: '1rem .7rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: '1fr',
            columnGap: '0px',
            rowGap: '0px',
            alignItems: 'center',
            justifyItems: 'end'
          }}>
            <div></div>
            <Image alt='' src={'/img/logo/dark/logo_theworkout.png'} width={'175'} height={'35'} />
            <div onClick={toggleSideMenu} style={{width: 'fit-content'}}>
              <CancelIcon  />
            </div>
          </div>
          <div style={{margin: '2.5rem 0', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {
              (isLoggedIn || user?.image !== '') 
              ? <Avatar src={`${user?.image}`} /> 
              : <AccountCircleIcon style={{fontSize: '2.5rem'}} />
            }
            <div style={{marginLeft: '10px', display: 'flex', flexDirection: 'column'}}>
              <Typography>
                {user?.name}
              </Typography>
              <Typography variant='caption' color={'#646464'}>
                {user?.email}
              </Typography>
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-around'
          }}>
            <Button fullWidth sx={{margin: '0 .3rem', fontWeight: 'bold', fontSize: '.8rem'}} size='large' variant='outlined'> Profile </Button>
            <Button onClick={logout} fullWidth sx={{margin: '0 .3rem', fontWeight: 'bold', fontSize: '.8rem'}} size='large' color="error"> Logout </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default ContextMenu;
