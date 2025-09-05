const colors = {
  blue: "text-blue-700",
  red: "text-red-700",
  green: "text-green-700",
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

            return (
              <span
                key={index}
                className={`${fontFamily} ${
                  isFirst || isLast
                    ? `${colors[color]} font-bold ${
                        size ? size : "text-xl"
                      }`
                    : size
                    ? size
                    : "text-xl"
                }`}
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
