'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  lang: string;
  userEmail: string | null;
  logoutLabel: string;
  mypageLabel: string;
  quoteLabel: string;
  onNavigate?: () => void;
}

export default function UserMenu({
  lang,
  userEmail,
  logoutLabel,
  mypageLabel,
  quoteLabel,
  onNavigate,
}: UserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    onNavigate?.();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}`);
    router.refresh();
  }

  const handleLinkClick = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget && !containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  const displayName = userEmail?.split('@')[0] ?? 'User';

  return (
    <div className="kct-user-menu" ref={containerRef} onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        className="kct-user-btn"
        aria-expanded={open}
        aria-controls="kct-user-dropdown"
        onClick={() => setOpen((prev) => !prev)}
      >
        <i className="bi bi-person-circle" aria-hidden="true" />
        <span>{displayName}</span>
        <i
          className={`bi bi-chevron-${open ? 'up' : 'down'}`}
          aria-hidden="true"
          style={{ fontSize: '0.68rem' }}
        />
      </button>

      {open && (
        <ul id="kct-user-dropdown" className="kct-user-dropdown">
          <li>
            <Link
              className="kct-user-item"
              href={`/${lang}/quote`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-file-earmark-text" aria-hidden="true" />
              <span>{quoteLabel}</span>
            </Link>
          </li>
          <li>
            <Link
              className="kct-user-item"
              href={`/${lang}/profile`}
              onClick={handleLinkClick}
            >
              <i className="bi bi-person" aria-hidden="true" />
              <span>{mypageLabel}</span>
            </Link>
          </li>
          <li aria-hidden="true">
            <hr className="kct-user-divider" />
          </li>
          <li>
            <button
              type="button"
              className="kct-user-item is-danger"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true" />
              <span>{logoutLabel}</span>
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
