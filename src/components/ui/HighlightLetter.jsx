function HighlightLetter({ children, color, size = "text-xl", className }) {
  return (
    <span className={`text-${color}-700 font-bold ${size} ${className}`}>
      {children}
    </span>
  );
}

export default HighlightLetter;
