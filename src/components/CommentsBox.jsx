import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePost } from '../context/PostContext';
import { useParams, useNavigate } from 'react-router-dom';
import Dropdown from './ui/DropDownButton';
import { Riple } from 'react-loading-indicators';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from "react-icons/hi2";
import HighlightLetter from './ui/HighlightLetter';
import { motion, AnimatePresence } from "framer-motion";

function CommentsBox() {
  const { classId } = useParams();
  const { handleSubmit, register, formState: { errors }, reset } = useForm();
  const { createPost, getPosts, deletePost, posts } = usePost();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // PAGINADO
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const totalPages = Math.ceil(posts?.length / postsPerPage || 1);

  const navigate = useNavigate();

  const handleSelectTask = (commentId) => {
    navigate(`/${classId}/task/post/${commentId}`);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await getPosts(classId);
      } catch (error) {
        console.error('Error al obtener los posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [classId, getPosts]);

  const onSubmit = handleSubmit(async (data) => {
    setIsCreating(true);
    try {
      await createPost(classId, data);
      await getPosts(classId);
      reset();
      setShowModal(false);
      setCurrentPage(1); // volver a la primera página al crear
    } catch (error) {
      console.error('Error al crear el post:', error);
    } finally {
      setIsCreating(false);
    }
  });

  const handleDeletePost = async (postId) => {
    setIsDeleting(true);
    try {
      await deletePost(classId, postId);
      await getPosts(classId);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calcular posts a mostrar
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="bg-pastelVeryLightYellow p-5 rounded-lg shadow-md w-full min-h-96 border-l-4 border-yellow-400">
      {/* HEADER */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center">
          <HighlightLetter color='green' size='text-2xl' className="font-opendyslexic font-bold">
            Anuncios
          </HighlightLetter>
          {user && user.rol === 2 && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-yellow-300 to-amber-400 hover:scale-105 rounded-lg transition"
            >
              <HighlightLetter color='green' size='text-lg' className="text-black font-opendyslexic">
                Nuevo Anuncio
              </HighlightLetter>
            </button>
          )}
        </div>

        {/* Paginación debajo del botón */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="cursor-pointer hover:scale-110 transition disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <HiOutlineChevronDoubleLeft className="text-xl" />
            </button>

            <span className="self-center font-semibold">
              {currentPage} / {totalPages}
            </span>

            <button
              className="cursor-pointer hover:scale-110 transition disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <HiOutlineChevronDoubleRight className="text-xl" />
            </button>
          </div>
        )}
      </div>

      {/* Lista de Comentarios con scroll y animación */}
      <div className="w-full max-h-[400px] overflow-y-auto pr-2">
        {isLoading || isCreating || isDeleting ? (
          <div className="flex justify-center">
            <Riple color="#cec702" size="large" />
          </div>
        ) : (
          <>
            {Array.isArray(posts) && posts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No hay anuncios aún.
              </p>
            ) : (
              <AnimatePresence>
                {currentPosts?.map((post) => (
                  <motion.div
                    key={post.id}
                    onClick={() => handleSelectTask(post.id)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-12 items-start p-2 mb-4 bg-pastelYellow rounded-lg shadow cursor-pointer hover:border-l-4 border-yellow-400 transition-all duration-100 relative"
                  >
                    <div className='col-span-11 flex justify-between w-full'>
                      <HighlightLetter
                        color="blue"
                        size="text-lg"
                        className="font-opendyslexic font-bold"
                      >
                        {post.title || 'Sin Título'}
                      </HighlightLetter>
                      <br />
                      <HighlightLetter
                        color="red"
                        size="text-sm"
                        className="font-opendyslexic text-gray-600 dark:text-gray-400"
                      >
                        {dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}
                      </HighlightLetter>
                    </div>

                    {/* SOLO aparece si el post es del usuario logueado */}
                    {user?.id === post?.user?.id && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Dropdown
                          onAbandonClass={() => handleDeletePost(post.id)}
                          classId={classId}
                          additionalParam={post.id}
                          msg={'Eliminar anuncio'}
                        />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      {/* Modal para crear anuncio */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-400 p-1 w-10 rounded-md absolute top-2 right-2 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <b>✕</b>
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Nuevo Anuncio
            </h3>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Título"
                className="dark:text-white dark:bg-[#1a1a1a] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('title', { required: true })}
              />
              {errors.title && (
                <span className="text-red-500">Este campo es requerido</span>
              )}
              <textarea
                placeholder="Contenido"
                className="dark:text-white dark:bg-[#1a1a1a] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('content', { required: true })}
              />
              {errors.content && (
                <span className="text-red-500">Este campo es requerido</span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                disabled={isCreating}
              >
                {isCreating ? 'Creando...' : 'Publicar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentsBox;
