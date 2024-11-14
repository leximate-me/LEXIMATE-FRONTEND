import React, { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading';
import { Riple } from 'react-loading-indicators';
import DropDown from '../components/ui/DropDownButton';

export default function CommentsPage({ posts: initialPosts }) {
  const { getProfile, profile } = useAuth();
  const { getPostById, createComment, comments, getComments, deleteComment } = usePost();
  const { classId, commentId } = useParams();
  
  const [post, setPost] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Cargando tanto para crear como para eliminar comentario
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProfile();
        if (!comments.length) await getComments(classId, commentId);
        if (!post) {
          setLoading(true);
          const fetchedPost = await getPostById(classId, commentId);
          setPost(fetchedPost);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, commentId, getProfile, getComments, getPostById, comments.length, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsProcessing(true);
    try {
      await createComment(classId, commentId, comment);
      setComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (postId) => {
    setIsProcessing(true);
    try {
      await deleteComment(classId, commentId, postId);
      await getComments(classId, commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {loading ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading('Cargando tarea...')}
        </div>
      ) : post ? (
        <div>
          {/* Sección del Post */}
          {profile?.person && (
            <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-3xl font-bold mb-4 dark:text-white">{post.title}</h2>
              <p className="text-gray-700 mb-6 dark:text-white">{post.content}</p>
              <div className="flex justify-end gap-2 italic text-gray-500">
                <p>{profile.person.first_name}</p>
                <p>{profile.person.last_name}</p>
              </div>
            </div>
          )}

          {/* Caja de Comentarios */}
          <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Comentarios</h3>
            <form onSubmit={handleSubmit} className="mb-6">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-500 dark:text-white"
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
            {isProcessing ? (
              <div className='flex justify-center'>
                <Riple color="#cec702" size="large" />
              </div>
            ) : comments.length > 0 ? (
              comments.map((cmt) => (
                <div
                  key={cmt.id}
                  className="grid grid-cols-6 dark:bg-[#1a1a1a] bg-white p-4 rounded-md shadow-lg border border-gray-300 dark:border-gray-500"
                >
                  <p className="text-gray-800 dark:text-white">{cmt.content}</p>
                  <div className="col-start-7 row-start-1">
                    <DropDown
                      onAbandonClass={() => handleDelete(cmt.id)}
                      classId={classId}
                      additionalParam={cmt.id}
                      msg="Eliminar comentario"
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay comentarios aún. ¡Sé el primero en comentar!</p>
            )}
          </div>
        </div>
      ) : (
        <h1 className="text-xl font-bold text-red-500">No se encontró el post</h1>
      )}
    </div>
  );
}
