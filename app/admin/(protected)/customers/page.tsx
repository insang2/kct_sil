import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CustomersManager from '@/components/admin/CustomersManager'

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const [{ data: contacts }, { data: docCounts }] = await Promise.all([
    supabase.from('admin_contacts').select('*').order('created_at', { ascending: false }),
    supabase.from('admin_documents').select('contact_id').not('contact_id', 'is', null),
  ])

  // contact_id별 문서 수 집계
  const countMap: Record<string, number> = {}
  for (const d of docCounts ?? []) {
    if (d.contact_id) countMap[d.contact_id] = (countMap[d.contact_id] ?? 0) + 1
  }

  const customers = (contacts ?? []).map(c => ({ ...c, doc_count: countMap[c.id] ?? 0 }))

  return (
    <div>
      <div className="alert alert-light border rounded-4 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 py-2 px-3 shadow-sm">
        <div className="d-flex align-items-center gap-2 small text-body-secondary">
          <i className="bi bi-person-check text-primary" aria-hidden="true" />
          <span>웹사이트 가입 회원의 승인·정지·등급 및 TDS 열람 권한은 <strong className="text-dark">회원 관리</strong>에서 처리합니다.</span>
        </div>
        <Link href="/admin/members" className="btn btn-sm btn-outline-primary rounded-pill px-3">
          회원 관리 바로가기 <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
        </Link>
      </div>
      <CustomersManager initialCustomers={customers} />
    </div>
  )
}
