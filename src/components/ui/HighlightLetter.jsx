const colors = {
  blue: "text-blue-700",
  red: "text-red-700",
  green: "text-green-700",
};

function HighlightLetter({ children, color = 'blue', size = "text-2xl", className = '', fontFamily = 'opendyslexic' }) {
  return (
    <span className={`${colors[color]} font-bold ${size} ${className}`}>
      {children}
    </span>
  );
}

export default HighlightLetter;
