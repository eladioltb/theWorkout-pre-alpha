import Image from 'next/image'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TuneIcon from '@mui/icons-material/Tune';
import { FC } from 'react';
import Link from 'next/link';

interface Props {
  userLogged: boolean;
}

export const NavbarComponent: FC<Props> = ({userLogged}) => {

  return (
    <>
      <div style={{backgroundColor: '#141218', height: '11vh', padding: '1vh 1vw 2vh', borderRadius: '25px 25px 0 0'}}>
        <ul style={{listStyle:'none', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
          <li>
            <Link href='/'>
              <HomeRoundedIcon sx={{fontSize: '2rem'}} />
            </Link>
          </li>
          <li>
            <SportsBasketballIcon sx={{fontSize: '2rem'}} />
          </li>
          <li>
            <Image src={'/img/icon_theworkout_white.png'} alt='' width={50} height={50} style={{ backgroundColor: '#F5762E', padding: '.2rem', borderRadius: '100%' }}/>
          </li>
          <li>
            <AssessmentIcon sx={{fontSize: '2rem'}} />
          </li>
          <li>
            <Link href={'../settings'}>
              <TuneIcon sx={{fontSize: '2rem'}} />
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
