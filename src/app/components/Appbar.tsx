import React from 'react';
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';
import SigninButton from './SigninButton';

export default function Appbar() {
  return (
    <Navbar isBordered>
      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem>
          <Link color='foreground' href='/'>
            Home
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarItem>
          <SigninButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
