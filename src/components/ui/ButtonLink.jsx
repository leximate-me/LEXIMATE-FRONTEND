import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={`font-opendyslexic tracking-normal-wide btn rounded-3xl py-1 bg-primary border border-[#dbcf7f] hover:bg-[#dbcf7f] transition duration-300 dark:hover:bg-primary dark:hover:text-black ${className}`}
    >
      {children}
    </Link>
  );
}
