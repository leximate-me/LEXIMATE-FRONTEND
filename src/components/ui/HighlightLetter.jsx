const colors = {
  blue: "text-blue-700",
  red: "text-red-700",
  green: "text-green-700",
  lightGreen: "text-[#5eb0b8]",
  lightYellow: "text-[#f7d654]",
  lightRed: "text-[#f17c5a]",
};

// Mapeo de tamaños Tailwind → el siguiente más grande
const sizeMap = {
  "text-xs": "text-sm",
  "text-sm": "text-base",
  "text-base": "text-lg",
  "text-lg": "text-xl",
  "text-xl": "text-2xl",
  "text-2xl": "text-3xl",
  "text-3xl": "text-4xl",
  "text-4xl": "text-5xl",
  "text-5xl": "text-6xl",
  "text-6xl": "text-7xl",
  "text-7xl": "text-8xl",
  "text-8xl": "text-9xl",
  "text-9xl": "text-9xl",
};

// 🔥 NUEVO: convierte cualquier "children" a string seguro
function normalizeChildren(children) {
  if (typeof children === "string") return children;

  if (Array.isArray(children)) {
    return children.map(normalizeChildren).join("");
  }

  if (typeof children === "object" && children !== null) {
    if (children.props && children.props.children) {
      return normalizeChildren(children.props.children);
    }
    if (children.value) return String(children.value);
  }

  return String(children ?? "");
}

function HighlightLetter({
  children,
  color = "blue",
  size = "text-2xl",
  className = "",
  fontFamily = "opendyslexic",
}) {
  const text = normalizeChildren(children);

  let letters = text.split("");

  const firstCharIndex = letters.findIndex((l) => l.trim() !== "");
  const lastCharIndex =
    letters.length -
    [...letters].reverse().findIndex((l) => l.trim() !== "") -
    1;

  return (
    <span className={`${size} ${className}`} style={{ fontFamily }}>
      {letters.map((letter, index) => {
        const isFirst = index === firstCharIndex;
        const isLast = index === lastCharIndex;

        const appliedSize =
          isFirst || isLast ? sizeMap[size] || size : size;

        return (
          <span
            key={index}
            className={`${isFirst || isLast ? `${colors[color]} font-bold tracking-more-wide` : "tracking-more-wide"} ${appliedSize}`}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}

export default HighlightLetter;
