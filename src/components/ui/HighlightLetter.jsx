const colors = {
  blue: "text-blue-700",
  red: "text-red-700",
  green: "text-green-700",
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
  "text-9xl": "text-9xl", // límite
};

function HighlightLetter({
  children,
  color = "blue",
  size = "text-2xl",
  className = "",
  fontFamily = "opendyslexic",
}) {
  let letters = children.split("");

  // Buscar primer y último índice que NO sea espacio
  const firstCharIndex = letters.findIndex((l) => l.trim() !== "");
  const lastCharIndex = [...letters]
    .reverse()
    .findIndex((l) => l.trim() !== "");
  const adjustedLastCharIndex =
    lastCharIndex === -1 ? -1 : letters.length - 1 - lastCharIndex;

  return (
    <span className={`${size} ${className}`}>
      {children
        ? letters.map((letter, index) => {
            const isFirst = index === firstCharIndex;
            const isLast = index === adjustedLastCharIndex;

            // Si es primera o última letra, subir un nivel de tamaño
            const appliedSize =
              isFirst || isLast ? sizeMap[size] || size : size;

            return (
              <span
                key={index}
                className={`${isFirst || isLast ? `${colors[color]} font-bold tracking-normal-wide` : 'tracking-normal-wide'} ${fontFamily} ${appliedSize}`}
              >
                {letter}
              </span>
            );
          })
        : null}
    </span>
  );
}

export default HighlightLetter;
