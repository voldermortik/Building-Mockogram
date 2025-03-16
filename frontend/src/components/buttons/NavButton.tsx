import { Link } from 'react-router-dom';

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  styleDark?: boolean;
}

export function NavButton({ to, children, styleDark = false }: NavButtonProps) {
  const baseClasses = "no-underline py-2 px-4 rounded font-medium text-sm";
  const lightClasses = "bg-white text-blue-600 border border-blue-600 hover:bg-blue-200";
  const darkClasses = "bg-blue-600 text-white border border-white hover:bg-blue-700";

  return (
    <Link 
      to={to}
      className={`${baseClasses} ${styleDark ? darkClasses : lightClasses}`}
    >
      {children}
    </Link>
  );
} 
