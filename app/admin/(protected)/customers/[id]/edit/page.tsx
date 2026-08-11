import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CustomerFormPage from '@/components/admin/CustomerFormPage'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('admin_contacts').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <CustomerFormPage
      mode="edit"
      customerId={id}
      initial={{
        company_name: data.company_name ?? '',
        company_name_en: data.company_name_en ?? '',
        business_reg_number: data.business_reg_number ?? '',
        customer_type: data.customer_type ?? 'other',
        country: data.country ?? '대한민국',
        address: data.address ?? '',
        website: data.website ?? '',
        contact_person: data.contact_person ?? '',
        contact_title: data.contact_title ?? '',
        phone: data.phone ?? '',
        fax: data.fax ?? '',
        email: data.email ?? '',
        whatsapp: data.whatsapp ?? '',
        wechat: data.wechat ?? '',
        kakao_id: data.kakao_id ?? '',
        line_id: data.line_id ?? '',
        linkedin: data.linkedin ?? '',
        instagram: data.instagram ?? '',
        facebook: data.facebook ?? '',
        twitter: data.twitter ?? '',
        youtube: data.youtube ?? '',
        contact2_name: data.contact2_name ?? '',
        contact2_title: data.contact2_title ?? '',
        contact2_phone: data.contact2_phone ?? '',
        contact2_email: data.contact2_email ?? '',
        currency: data.currency ?? 'KRW',
        payment_terms: data.payment_terms ?? '',
        credit_limit: data.credit_limit != null ? String(data.credit_limit) : '',
        acquisition_source: data.acquisition_source ?? '',
        first_deal_date: data.first_deal_date ?? '',
        next_followup_at: data.next_followup_at ?? '',
        tier: data.tier ?? 'standard',
        is_verified: data.is_verified ?? false,
        notes: data.notes ?? '',
      }}
    />
  )
}
