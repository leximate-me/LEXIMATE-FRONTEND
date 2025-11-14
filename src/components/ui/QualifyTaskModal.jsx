import { useState } from "react";

export default function QualifyTaskModal({ open, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center backdrop-blur-sm justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Calificar trabajo</h2>
          <button onClick={onClose} className="text-gray-600 text-xl">✕</button>
        </div>

        {/* Stars */}
        <div className="flex justify-start items-center gap-2 mb-4">
          <p>Calificación:</p>
          <select
            name="rating"
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="border rounded-lg p-2 anitame-fadeIn"
          >
            <option value={0}>1</option>
            <option value={1}>2</option>
            <option value={2}>3</option>
            <option value={3}>4</option>
            <option value={4}>5</option>
            <option value={5}>6</option>
            <option value={6}>7</option>
            <option value={7}>8</option>
            <option value={8}>9</option>
            <option value={9}>10</option>
          </select>
        </div>

        {/* Comment */}
        <textarea
          className="border w-full rounded-lg p-3 mb-4"
          placeholder="Deja un comentario..."
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit */}
        <button
          disabled={rating === 0}
          onClick={() => {
            onSubmit({ rating, comment });
            setRating(0);
            setComment("");
            onClose();
          }}
          className={`w-full py-2 rounded-lg text-white font-semibold ${rating === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}