'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserMenuProps {
  lang: string
  userEmail: string | null
  logoutLabel: string
  mypageLabel: string
  quoteLabel: string
}

export default function UserMenu({ lang, userEmail, logoutLabel, mypageLabel, quoteLabel }: UserMenuProps) {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push(`/${lang}`)
    router.refresh()
  }

  return (
    <li className="nav-item dropdown ms-lg-3">
      <a
        className="nav-link dropdown-toggle btn btn-sm btn-outline-dark rounded-pill px-3 py-1"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <i className="bi bi-person-circle me-1"></i>
        {userEmail?.split('@')[0]}
      </a>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0">
        <li>
          <a className="dropdown-item" href={`/${lang}/quote`}>
            <i className="bi bi-file-earmark-text me-2"></i>{quoteLabel}
          </a>
        </li>
        <li>
          <a className="dropdown-item" href={`/${lang}/profile`}>
            <i className="bi bi-person me-2"></i>{mypageLabel}
          </a>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>{logoutLabel}
          </button>
        </li>
      </ul>
    </li>
  )
}
