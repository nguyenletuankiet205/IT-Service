'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingState from './LoadingState';

/**
 * Client-side loading state while middleware handles redirects.
 * Admin pages also verify session via httpOnly cookie on the server.
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [ready, setReady] = useState(isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    let cancelled = false;

    fetch('/api/auth/session', { credentials: 'include' })
      .then(res => {
        if (!cancelled && res.ok) {
          sessionStorage.setItem('techcare_admin_logged_in', 'true');
          setReady(true);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingState message="Đang xác thực phiên đăng nhập..." />
      </div>
    );
  }

  return <>{children}</>;
}
