"use client";

import { logout } from '@/lib/actions/auth.action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function TestLogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const result = await logout();
      console.log("Logout result:", result);
      
      if (result.success) {
        toast.success('Logged out successfully');
        router.push('/sign-in');
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isLoading}
      className="px-3 py-2 bg-red-500 text-white rounded disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : 'Test Logout'}
    </button>
  );
}
