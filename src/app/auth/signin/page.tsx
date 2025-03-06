// pages/auth/signin/page.tsx
'use client'

import React, { Suspense } from 'react';
import SignIn from './SignIn';

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  );
}
