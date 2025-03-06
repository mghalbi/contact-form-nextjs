import AuthButton from '../components/AuthButton';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthButton />
    </Suspense>
  );
}

