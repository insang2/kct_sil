import { getDictionary } from '@/lib/dictionaries';
import NavbarClient from '@/components/NavbarClient';

export default async function Header({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' }) {
  const dict = await getDictionary(lang);
  const d = dict as any;

  const sustainabilityLabel =
    lang === 'en' ? 'Sustainability' : lang === 'ja' ? 'サステナビリティ' : '지속가능경영';
  const inquiryLabel =
    lang === 'en' ? 'Inquire' : lang === 'ja' ? 'お問い合わせ' : '문의하기';
  const productsLabel =
    lang === 'ko' ? '제품' : lang === 'ja' ? '製品' : (d.navigation?.products ?? 'Products');
  const exportLabel =
    lang === 'ko' ? '수출' : lang === 'ja' ? '輸出' : 'Export';
  const quoteLabel =
    lang === 'ko' ? '견적' : lang === 'ja' ? '見積' : (d.navigation?.quote ?? 'Quotation');

  return (
    <NavbarClient
      lang={lang}
      navLabels={{
        home: d.navigation.home,
        about: d.navigation.about,
        sustainability: sustainabilityLabel,
        products: productsLabel,
        technical: d.navigation.technical,
        b2b: d.navigation.b2b,
        export: exportLabel,
        quote: quoteLabel,
        inquiry: inquiryLabel,
        login: d.navigation.login,
      }}
      userLabels={{
        logout: d.auth.btn_logout,
        mypage: d.navigation.mypage,
        quote: d.navigation.quote,
      }}
    />
  );
}
