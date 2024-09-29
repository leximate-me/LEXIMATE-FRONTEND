import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={`btn btn-outline rounded-3xl py-1 bg-[#f8f40c] border-[#f8f40c] hover:bg-slate-800 transition duration-300 dark:hover:bg-[#f8f40c] dark:hover:text-black ${className}`}
    >
      {children}
    </Link>
  );
}
