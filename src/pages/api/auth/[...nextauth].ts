import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { dbUser } from '../../../../axiosApi/users';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    
    CredentialsProvider({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Emaill:', type: 'email', placeholder: 'email@google.com'  },
        password: { label: 'Password:', type: 'password', placeholder: 'Password'  },
      },
      async authorize(credentials) {
        return await dbUser.checkUserEmailPassword( credentials!.email, credentials!.password );
      }
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID ? process.env.GOOGLE_ID : '',
    //   clientSecret: process.env.GOOGLE_SECRET ? process.env.GOOGLE_SECRET : '',
    // }),


  ],
  secret: process.env.JWT_SECRET_SEED,
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },
  callbacks: {

    async jwt({ token, account, user }) {
      if ( account ) {
        token.accessToken = account.access_token;
        switch( account.type ) {
        case 'oauth': 
          token.user = await dbUser.oAUthToDbUser( user?.email || '', user?.name || '' );
          break;
        case 'credentials':
          token.user = user;
          break;
        }
      }

      return token;
    },

    async session({ session, token}){
      session.user = token.user as any;
      return session;
    },
    
  }
});