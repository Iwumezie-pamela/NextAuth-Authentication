'use client';

import { Button } from '@nextui-org/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const SigninButton = () => {
  const { data: session } = useSession();

  return (
    <div className='flex items-center gap-2'>
      {session && session.user ? (
        <>
          <p>{`${session.user.firstName} ${session.user.lastName}`}</p>
          <Button
            onClick={() => signOut()}
            className='tex-sky-500 hover:text-sky-600 transition-colors'
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => signIn()}>Sign In</Button>
          <Button as={Link} href={'/auth/signup'}>
            Sign Up
          </Button>
        </>
      )}
    </div>
  );
};

export default SigninButton;
