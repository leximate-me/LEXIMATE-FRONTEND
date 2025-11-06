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
import { MdOutlineComment } from "react-icons/md";
import HighlightLetter from '../components/ui/HighlightLetter';
import { FaUser } from "react-icons/fa";
import { div } from 'framer-motion/client';


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

  // 👇 estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

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
      await getComments(classId, commentId);
      setComments(commentsByPost[commentId] || []);
      setCurrentPage(1); // volver a la primera página al crear nuevo
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
      setComments((prevComments) =>
        prevComments.filter((cmt) => cmt.id !== deletedCommentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 👇 lógica de paginación
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  return (
    <div className="grid grid-cols-8  gap-4 p-4">
      {loading ? (
        <div className="h-[500px] flex justify-center items-center col-span-8">
          {Loading('Cargando anuncio...')}
        </div>
      ) : post ? (
        <>
          {/* Post */}
          {profile?.person && (
            <div className="border-l-4 shadow-lg bg-white border-yellow-300  col-start-2 col-span-6 flex flex-col rounded-lg h-fit">
              <div className='flex flex-col bg-gradient-to-r from-yellow-300 to-amber-400 rounded-t-md p-2'>
                <div className="flex gap-1">
                  <HighlightLetter className='font-opendyslexic' size='text-xl' color="blue">{post.user?.people?.first_name || 'Usuario'}</HighlightLetter>
                  <HighlightLetter className='font-opendyslexic' size='text-xl' color="blue">{post.user?.people?.last_name || ''}</HighlightLetter>
                </div>
                <p className='text-gray-400 flex items-center gap-1'>
                  <FaCalendarAlt />
                  {dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </div>
              <div className='bg-pastelVeryLightYellow m-2 mb-4 shadow-[0_3px_8px_0px_rgba(0,0,0,0.2)] rounded-lg p-2 flex flex-col'>
                <HighlightLetter className="font-extrabold font-opendyslexic mb-4" size='text-2xl' color="red">{post.title}</HighlightLetter>
                <HighlightLetter className="font-opendyslexic text-gray-600" size='text-lg' color="blue">{post.content}</HighlightLetter>
              </div>
            </div>
          )}

          {/* Caja de Comentarios */}
          <div className="rounded-lg border-l-4 border-yellow-300 shadow-[0_5px_8px_0px_rgba(0,0,0,0.3)] bg-white col-start-2 col-span-6 h-fit row-start-2 row-span-1">
            <div className='bg-gradient-to-r from-yellow-300 to-amber-400 rounded-t-md p-2 font-opendyslexic font-bold flex'>
              <p className='text-2xl text-gray-600 self-center p-2'>
                <MdOutlineComment />
              </p>
              <HighlightLetter className="" size='text-2xl' color="green">
                Comentarios
              </HighlightLetter>
            </div>
            <form onSubmit={handleSubmit} className="m-6 flex items-start gap-3">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Tu avatar"
                  className="w-12 h-12 rounded-full object-cover border border-gray-700"
                />
              ) : (
                <FaUser className="w-14 h-14 p-1 text-gray-700 border border-gray-700 rounded-full " />
              )}
              <div className="w-full flex flex-col items-end gap-2">
                <textarea
                  className="w-full h-[80px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:outline-none focus:ring-amber-400"
                  rows="3"
                  placeholder="Escribe tu comentario..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className='grid grid-cols-12 grid-rows-[50px] w-full'>
                  {/* 👇 Paginado siempre visible */}
                  <div className="col-start-5 col-span-3 flex justify-center items-center gap-4">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50"
                    >
                      ←
                    </button>
                    <span className="font-semibold">
                      {currentPage} / {totalPages || 1}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 rounded bg-yellow-300 hover:bg-yellow-400 disabled:opacity-50"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="col-start-10 col-span-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-2xl hover:from-yellow-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                    disabled={isProcessing}
                  >
                    <LuSend />
                    {isProcessing ? "Enviando..." : "Enviar Comentario"}
                  </button>
                </div>
              </div>
            </form>

            {/* Listado de Comentarios con paginado */}
            {isProcessing ? (
              <div className="flex justify-center">
                <Riple color="#cec702" size="large" />
              </div>
            ) : (
              <>
                {user && user.rol === 'student' ? (
                  <>
                    {currentComments.length > 0 ? (
                      currentComments.map((cmt) => (
                        <div className='grid grid-cols-[60px_repeat(11,minmax(0,1fr))] grid-rows-[120px] ml-4' key={cmt.id}>
                          {cmt.user?.userFiles?.length > 0 ? (
                            <img
                              src={cmt.user?.userFiles[0]?.file_url}
                              alt="Avatar"
                              className="w-12 h-12 rounded-full object-cover border border-gray-700 col-start-1 row-start-1 self-start mt-2"
                            />
                          ) : (
                            <FaUser className="w-10 h-10 p-1 text-gray-700 border-2 border-gray-700 rounded-full col-start-1 row-start-1 self-start mt-2" />
                          )}
                          <div
                            key={cmt.id}
                            className="mb-5 col-start-2 col-span-10 row-span-1 bg-pastelVeryLightYellow rounded-md shadow-[0_3px_8px_0px_rgba(0,0,0,0.3)]"
                          >
                            <div className='bg-gradient-to-r from-yellow-300 to-amber-400 rounded-t-md p-2 col-span-8 mb-2 flex justify-between'>
                              <div className='md:col-span-4 md:row-start-1 md:col-start-2 flex items-center flex-wrap'>
                                <HighlightLetter className="mx-1 font-opendyslexic truncate" size='text-xl' color="green">{cmt.user?.people?.first_name || 'Usuario'}</HighlightLetter>
                                <HighlightLetter className="mx-1 font-opendyslexic truncate" size='text-xl' color="red">{cmt.user?.people?.last_name || ''}</HighlightLetter>
                                <p className='mx-2 italic text-gray-500'>
                                  {dayjs(cmt.createdAt).format('DD/MM/YYYY HH:mm')}
                                </p>
                              </div>
                              {user.id === cmt.user.id && (
                                <div className="">
                                  <DropDown
                                    onAbandonClass={() => handleDelete(cmt.id)}
                                    classId={classId}
                                    additionalParam={cmt.id}
                                    msg="Eliminar comentario"
                                  />
                                </div>
                              )}
                            </div>

                            <HighlightLetter className="m-2 font-opendyslexic" size='text-lg' color="blue">
                              {cmt.content}
                            </HighlightLetter>
                          </div>
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
                    {/*DOCENTE*/}
                    {currentComments.length > 0 ? (
                      currentComments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="border-l-4 border-yellow-300 mb-5 m-4 grid grid-cols-[50px,150px,auto] grid-rows-2 md:grid-rows-2 dark:bg-[#1a1a1a] bg-white rounded-md shadow-lg dark:border-gray-500"
                        >
                          <div className='p-2 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-t col-span-8 flex justify-between'>
                            <div className='flex items-center gap-2'>
                                {cmt.user?.userFiles?.length > 0 ? (
                                  <img
                                    src={cmt.user?.userFiles[0]?.file_url}
                                    alt="Avatar"
                                    className="w-12 h-12 rounded-full object-cover border border-gray-500 col-start-1 row-start-1 self-start mt-2"
                                  />
                                ) : (
                                    <FaUser className="w-10 h-10 rounded-full border border-gray-700 text-gray-700 p-1" />
                                )}

                              <div className='flex items-center flex-wrap'>
                                <HighlightLetter className="mx-1 dark:text-white text-gray-800 truncate font-opendyslexic" size='text-lg' color="green">
                                  {cmt.user?.people?.first_name || 'Usuario'}
                                </HighlightLetter>
                                <HighlightLetter className="mx-1 dark:text-white text-gray-800 truncate font-opendyslexic" size='text-lg' color="red">
                                  {cmt.user?.people?.last_name || ''}
                                </HighlightLetter>
                                <p className='mx-2 italic text-gray-500'>
                                  {dayjs(cmt.createdAt).format('DD/MM/YYYY HH:mm')}
                                </p>
                              </div>
                            </div>
                            <div>
                              <DropDown
                                onAbandonClass={() => handleDelete(cmt.id)}
                                classId={classId}
                                additionalParam={cmt.id}
                                msg="Eliminar comentario"
                              />
                            </div>
                          </div>

                          <div className='m-3 col-span-8 bg-pastelYellow p-4 rounded'>
                            <HighlightLetter className="mt-2 dark:text-white text-gray-800 font-opendyslexic" size='text-md' color="blue">
                              {cmt.content}
                            </HighlightLetter>
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

            {/* 👇 Paginado */}

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
