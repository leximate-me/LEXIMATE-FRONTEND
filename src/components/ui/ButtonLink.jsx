import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={`btn btn-outline rounded-3xl border-none py-1 ${className}`}
    >
      {children}
    </Link>
  );
}
