interface SubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  loadingText?: string;
  styleDark?: boolean;
}

export function SubmitButton({ 
  isSubmitting, 
  children, 
  loadingText = 'Submitting...',
  styleDark = false
}: SubmitButtonProps) {
  const baseClasses = "py-2 px-4 rounded font-medium text-sm";
  const lightClasses = "bg-white text-blue-600 border border-blue-600 hover:bg-blue-200";
  const darkClasses = "bg-blue-600 text-white border border-white hover:bg-blue-700";
  const disabledClasses = "bg-blue-300 border-blue-300 text-white cursor-not-allowed hover:bg-blue-300";

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`${baseClasses} ${
        isSubmitting 
          ? disabledClasses 
          : styleDark ? darkClasses : lightClasses
      }`}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
} 
