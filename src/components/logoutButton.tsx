"use client";
import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { redirect } from 'next/navigation';
import logout from '@/actions/auth/logout.ts';
import { useActionState } from 'react';
import { FaS } from 'react-icons/fa6';
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  const [state, action, isPending] = useActionState(logout, undefined, null);

  useEffect(() => {
    if (state?.success) {
      console.log('Logged out successfully');
      redirect('/login');
    } else if (state?.error) {
      console.error('Error logging out:', state.error.message);
      redirect('/login');
    }
  }, [state]);

  return (
    <form action={action}>
      <Button type="submit" disabled={isPending}>
      <FaSignOutAlt className="mr-2" />  {isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </form>
  );
}
