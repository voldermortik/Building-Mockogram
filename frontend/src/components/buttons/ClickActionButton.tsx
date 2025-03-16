interface ClickActionButtonProps {
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
  styleDark?: boolean;
}

export function ClickActionButton({ onClick, children, styleDark = false }: ClickActionButtonProps) {
  const baseClasses = "no-underline py-2 px-4 rounded font-medium text-sm";
  const lightClasses = "bg-white text-blue-600 border border-blue-600 hover:bg-blue-200";
  const darkClasses = "bg-blue-600 text-white border border-white hover:bg-blue-700";

  const handleClick = () => {
    void onClick();
  };

  return (
    <button 
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${styleDark ? darkClasses : lightClasses}`}
    >
      {children}
    </button>
  );
} 
