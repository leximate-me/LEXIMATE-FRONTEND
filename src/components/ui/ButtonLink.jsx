import { Link } from 'react-router-dom';

export function ButtonLink({ to, children, className }) {
  return (
    <Link
      to={to}
      className={`text-center ${className}`}
    >
      {children}
    </Link>
  );
}
