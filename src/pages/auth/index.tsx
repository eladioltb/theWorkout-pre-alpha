import Image from 'next/image'
import Link from 'next/link';
import { AuthLayout } from "@/layouts";

const AuthPage = () => {
  return (
    <>
      <AuthLayout title="Welcome" pageDescription="">
        <div>
          <Image src={'/img/logo/dark/logo_theworkout.png'} alt='' width={300} height={63}/>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Link href='/auth/login'>
              <button style={{
                  backgroundColor: '#F5762E',
                  border: 'none',
                  borderRadius: '15px',
                  fontSize: '1.3rem', 
                  padding: '1rem 9rem',
                  color: 'white'
                }}>
                <p>Login</p>
              </button>
            </Link>
          </div>
      </AuthLayout>
    </>
  )
}

export default AuthPage;