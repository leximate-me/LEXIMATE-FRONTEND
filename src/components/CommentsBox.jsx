import React from 'react'

function CommentsBox() {
    return (
        <div className="col-span-8 row-span-2 row-start-2 md:col-span-6 md:col-start-3 md:row-span-1 md:row-start-2 border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Comentarios</h2>

            {/* Lista de Comentarios */}
            <div className="space-y-4 mb-6">
                <p className="text-gray-500 dark:text-gray-400">No hay comentarios aún.</p>
            </div>

            {/* Formulario de Comentario */}
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Escribe un comentario..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                    Comentar
                </button>
            </div>
        </div>
    )
}

export default CommentsBox