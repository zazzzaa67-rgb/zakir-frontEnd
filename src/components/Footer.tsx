import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-1 border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500 sm:flex-row sm:justify-between">
      <p>جميع الحقوق محفوظة لمنصة فهمتها © 2026</p>
      <Link to="/privacy-policy" className="font-semibold text-blue-700 hover:text-blue-800">
        سياسة الخصوصية
      </Link>
    </footer>
  );
}
