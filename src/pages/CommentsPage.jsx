import React, { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading';

export default function CommentsPage({ posts: initialPosts }) {
  const { getPostById, isLoading } = usePost();
  const { classId, commentId } = useParams(); // Obtenemos el ID desde la URL
  const [post, setPost] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      if (classId && commentId) {
        setLoading(true);
        try {
          const fetchedPost = await getPostById(classId, commentId);
          setPost(fetchedPost);
        } catch (error) {
          console.error('Error fetching post:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [classId, commentId, getPostById]);

  // Función para manejar el envío de comentarios
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, comment]);
      setComment('');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {loading || isLoading ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading('Cargando tarea...')}
        </div>
      ) : (
        <>
          {post ? (
            <>
              {/* Sección del Post */}
              <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] mb-8">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">{post.title}</h2>
                <p className="text-gray-700 mb-6 dark:text-white">{post.content}</p>
              </div>

              {/* Caja de Comentarios */}
              <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Comentarios</h3>
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-500 dark:text-white"
                    rows="3"
                    placeholder="Escribe tu comentario..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Enviar Comentario
                  </button>
                </form>

                {/* Listado de Comentarios */}
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((cmt, index) => (
                      <div
                        key={index}
                        className="dark:bg-[#1a1a1a] bg-white p-4 rounded-md shadow-sm border border-gray-200 dark:border-gray-500"
                      >
                        <p className="text-gray-800 dark:text-white">{cmt}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                )}
              </div>
            </>
          ) : (
            <h1 className="text-xl font-bold text-red-500">No se encontró el post</h1>
          )}
        </>
      )}
    </div>
  );
}
