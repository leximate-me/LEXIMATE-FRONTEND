import React, { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading';

export default function CommentsPage({ posts: initialPosts }) {
  const { getProfile, profile } = useAuth();
  const { getPostById, createComment, comments, getComments } = usePost();
  const { classId, commentId } = useParams();
  const [post, setPost] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');

  // Obtener datos del perfil
  useEffect(() => {
    const getProfileData = async () => {
      try {
        await getProfile();
      } catch (error) {
        console.error('Error getting profile:', error);
      }
    };
    getProfileData();
  }, [getProfile]);

  // Obtener los comentarios solo cuando sea necesario
  useEffect(() => {
    const fetchComments = async () => {
      if (classId && commentId) {
        try {
          await getComments(classId, commentId);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    // Solo llamar a la API si los comentarios no han sido cargados aún
    if (comments.length === 0) {
      fetchComments();
    }
  }, [classId, commentId, getComments, comments.length]);

  // Obtener los datos del post solo cuando sea necesario
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

    // Solo llamar a la API si el post no ha sido cargado aún
    if (!post) {
      fetchPost();
    }
  }, [classId, commentId, getPostById, post]);

  // Manejar el envío de comentarios
  const submitComment = async (e) => {
    e.preventDefault(); // Previene la recarga de la página
    if (comment.trim() === '') return; // Evita comentarios vacíos
    try {
      await createComment(classId, commentId, comment);  // Envío de comentario
      setComment(''); // Limpia el campo de texto después de enviar
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // Evitar llamar `getPostById` cada vez que `comments` cambian
  useEffect(() => {
    const fetchPostComments = async () => {
      if (classId && commentId) {
        try {
          const fetchedPost = await getPostById(classId, commentId);
          setPost(fetchedPost);
        } catch (error) {
          console.error('Error fetching post for comments:', error);
        }
      }
    };

    // Solo hacer la llamada si es necesario
    if (comments.length > 0) {
      fetchPostComments();
    }
  }, [comments, classId, commentId, getPostById]);

  return (
    <div className="container mx-auto p-6">
      {loading  ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading('Cargando tarea...')}
        </div>
      ) : (
        <>
          {post ? (
            <>
              {/* Sección del Post */}
              {profile && profile.person ? (
                <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)] mb-8">
                  <h2 className="text-3xl font-bold mb-4 dark:text-white">{post.title}</h2>
                  <p className="text-gray-700 mb-6 dark:text-white">{post.content}</p>
                  <div className="flex justify-end gap-2 italic text-gray-500">
                    <p>{profile.person.first_name}</p>
                    <p>{profile.person.last_name}</p>
                  </div>
                </div>
              ) : null}

              {/* Caja de Comentarios */}
              <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Comentarios</h3>
                <form onSubmit={submitComment} className="mb-6">
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-500 dark:text-white"
                    rows="3"
                    placeholder="Escribe tu comentario..."
                    name='content'
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
                        <p className="text-gray-800 dark:text-white">{cmt.content}</p>
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
