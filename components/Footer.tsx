import { getDictionary } from "@/lib/dictionaries";

export default async function Footer({ lang = 'ko' }: { lang?: 'ko' | 'en' | 'ja' | 'zh-TW' }) {
  const dict = await getDictionary(lang) as any;
  
  return (
    <footer className="footer mt-auto bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-2 text-white fw-bold">{dict.footer.sales_manager}</p>
            <p className="mb-0 text-white-50">© {new Date().getFullYear()} 한국건설트레이딩 (KCT). {dict.footer.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
