import React, { useEffect, useState } from 'react';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import Loading from '../components/ui/Loading';
import { Riple } from 'react-loading-indicators';
import DropDown from '../components/ui/DropDownButton';
import { LuSend } from "react-icons/lu";
import dayjs from 'dayjs';
import { FaCalendarAlt } from "react-icons/fa";
import HighlightLetter from '../components/ui/HighlightLetter';

export default function CommentsPage({ posts: initialPosts }) {
  const { profile, user } = useAuth();
  const {
    getPostById,
    createComment,
    commentsByPost,
    getComments,
    deleteComment,
  } = usePost();
  const { classId, commentId } = useParams();

  const [post, setPost] = useState(initialPosts);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!commentsByPost[commentId]) {
          await getComments(classId, commentId);
        }
        if (!post) {
          const fetchedPost = await getPostById(classId, commentId);
          setPost(fetchedPost);
        }
        setComments(commentsByPost[commentId] || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId, commentId, getComments, getPostById, commentsByPost, post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsProcessing(true);
    try {
      await createComment(classId, commentId, comment);
      setComment('');
      await getComments(classId, commentId); // Recargar comentarios después de crearlos
      setComments(commentsByPost[commentId] || []);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (deletedCommentId) => {
    setIsProcessing(true);
    try {
      await deleteComment(classId, commentId, deletedCommentId);
      // Actualizar el estado localmente eliminando el comentario
      setComments((prevComments) => prevComments.filter((cmt) => cmt.id !== deletedCommentId));
      // No volver a llamar a getComments para evitar sobreescribir el estado local
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  console.log("post", post);

  return (
    <div className="grid grid-cols-8 grid-rows-[200px_300px_auto] gap-4 p-4">
      {loading ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading('Cargando anuncio...')}
        </div>
      ) : post ? (
        <>
          {/* Sección del Post */}
          {profile?.person && (
            <div className="bg-pastelYellow col-start-2 col-span-6 flex flex-col rounded-lg h-fit">
              <div className='flex flex-col bg-gradient-to-r from-yellow-300 to-amber-400 rounded-t-lg p-2'>
                <div className="flex gap-1">
                  <HighlightLetter className='font-opendyslexic' size='text-xl' color="blue">{post.user?.people?.first_name || 'Usuario'}</HighlightLetter>
                  <HighlightLetter className='font-opendyslexic' size='text-xl' color="blue">{post.user?.people?.last_name || ''}</HighlightLetter>
                </div>
                <p className='text-gray-400 flex items-center gap-1'>
                  <FaCalendarAlt />
                  {dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
              <div className='bg-pastelVeryLightYellow m-2 rounded-lg p-2'>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white break-words">
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-6 dark:text-white break-words overflow-hidden">
                  {post.content}
                </p>
              </div>
            </div>
          )}

          {/* Caja de Comentarios */}
          <div className="bg-green-400 col-start-2 col-span-6 p-4 h-fit">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">
              Comentarios
            </h3>

            <form onSubmit={handleSubmit} className="mb-6 flex items-start gap-3">
              {/* Avatar del usuario autenticado */}
              <img
                src={
                  profile?.avatar?.file_url || "default-avatar-url.jpg"
                }
                alt="Tu avatar"
                className="w-12 h-12 rounded-full object-cover border border-gray-500"
              />

              {/* Caja de texto y botón */}
              <div className="w-full flex flex-col items-end gap-2">
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-[#1a1a1a] dark:border-gray-500 dark:text-white"
                  rows="3"
                  placeholder="Escribe tu comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 w-fit flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-300 to-amber-400 py-4 rounded-2xl hover:from-yellow-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  disabled={isProcessing}
                >
                  <LuSend />
                  {isProcessing ? "Enviando..." : "Enviar Comentario"}
                </button>
              </div>
            </form>


            {/* Listado de Comentarios */}
            {isProcessing ? (
              <div className="flex justify-center">
                <Riple color="#cec702" size="large" />
              </div>
            ) : (
              <>
                {user && user.rol === 2 ? (
                  <>
                    {comments.length > 0 ? (
                      comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="mb-5 grid grid-cols-[50px,150px,auto] grid-rows-2 md:grid-rows-2 dark:bg-[#1a1a1a] bg-white p-2 rounded-md shadow-lg border border-gray-300 dark:border-gray-500"
                        >
                          <div className="col-start-1 col-span-1 md:col-span-1">
                            <img
                              src={
                                cmt.user?.fileUser?.[0]?.file_url ||
                                'default-avatar-url.jpg'
                              }
                              alt="Avatar"
                              className="w-12 h-12 rounded-full object-cover border border-gray-500"
                            />
                          </div>

                          <div className='md:col-span-4 md:row-start-1 md:col-start-2 flex items-center flex-wrap'>
                            <p className="mx-1 dark:text-white text-gray-800 truncate">
                              {cmt.user?.people?.first_name || 'Usuario'}
                            </p>
                            <p className="mx-1 dark:text-white text-gray-800 truncate">
                              {cmt.user?.people?.last_name || ''}
                            </p>
                            <p className='mx-2 italic text-gray-500'>
                              {dayjs(cmt.createdAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                          </div>

                          <p className="row-start-2 md:row-start-2 mt-2 text-gray-800 dark:text-white flex items-center col-start-1 col-span-8 break-words">
                            {cmt.content}
                          </p>

                          {user.id === cmt.user.id && (
                            <div className="col-start-8 justify-self-end self-center">
                              <DropDown
                                onAbandonClass={() => handleDelete(cmt.id)}
                                classId={classId}
                                additionalParam={cmt.id}
                                msg="Eliminar comentario"
                              />
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No hay comentarios aún. ¡Sé el primero en comentar!
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {comments.length > 0 ? (
                      comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="mb-5 grid grid-cols-[50px,150px,auto] grid-rows-2 md:grid-rows-2 dark:bg-[#1a1a1a] bg-white p-4 rounded-md shadow-lg border border-gray-300 dark:border-gray-500"
                        >
                          <div className="col-start-1 col-span-1 md:col-span-1">
                            <img
                              src={
                                cmt.user?.fileUser?.[0]?.file_url ||
                                'default-avatar-url.jpg'
                              }
                              alt="Avatar"
                              className="w-12 h-12 rounded-full object-cover border border-gray-500"
                            />
                          </div>

                          <div className='md:col-span-4 md:row-start-1 md:col-start-2 flex items-center flex-wrap'>
                            <p className="mx-1 dark:text-white text-gray-800 truncate">
                              {cmt.user?.people?.first_name || 'Usuario'}
                            </p>
                            <p className="mx-1 dark:text-white text-gray-800 truncate">
                              {cmt.user?.people?.last_name || ''}
                            </p>
                            <p className='mx-2 italic text-gray-500'>
                              {dayjs(cmt.createdAt).format('DD/MM/YYYY HH:mm')}
                            </p>
                          </div>

                          <p className="row-start-2 md:row-start-2 mt-2 text-gray-800 dark:text-white flex items-center col-start-1 col-span-8 break-words">
                            {cmt.content}
                          </p>

                          <div className="col-start-8 justify-self-end self-center">
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
                      <p className="text-gray-500">
                        No hay comentarios aún. ¡Sé el primero en comentar!
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="dark:bg-white w-80 h-52 flex flex-col justify-center items-center border border-gray-300 rounded-md shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
          <div className="flex flex-wrap justify-center items-center w-[90%] h-[90%] m-5">
            <h1>
              <b>OCURRIÓ UN ERROR INESPERADO</b>
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}