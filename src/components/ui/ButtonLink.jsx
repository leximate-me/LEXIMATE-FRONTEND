import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, className }) {
  return (
    <Link to={to} className={`btn rounded-3xl border-none py-1 ${className}`}>
      {children}
    </Link>
  );
}
