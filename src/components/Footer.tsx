import { Link } from 'react-router-dom';

const whatsappChannel = 'https://whatsapp.com/channel/0029VbDxLamLNSZxv8RK0S46';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500">
      <nav aria-label="روابط المنصة" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <Link to="/about" className="font-semibold transition-colors hover:text-blue-700">
          عن المنصة
        </Link>
        <Link to="/privacy-policy" className="font-semibold transition-colors hover:text-blue-700">
          سياسة الخصوصية
        </Link>
        <a
          href={whatsappChannel}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
        >
          قناة الواتساب
        </a>
      </nav>
      <p className="mt-3">جميع الحقوق محفوظة لمنصة فهمتها © 2026</p>
    </footer>
  );
}
