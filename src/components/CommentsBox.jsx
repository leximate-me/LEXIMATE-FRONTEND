import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePost } from '../context/PostContext';
import { useParams } from 'react-router-dom';
import Dropdown from './ui/DropDownButton';
import { Riple } from 'react-loading-indicators';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

function CommentsBox() {
  const { classId } = useParams();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();
  const { createPost, getPosts, deletePost, posts } = usePost();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const handleSelectTask = (commentId) => {
    navigate(`/${classId}/task/post/${commentId}`);
  };

  // Cargar posts al montar el componente
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
      await getPosts(classId); // Obtener posts actualizados
      reset(); // Limpiar los campos del formulario
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
      await getPosts(classId); // Obtener posts actualizados después de eliminar
    } catch (error) {
      console.error('Error al eliminar el post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    console.log('me recargue')
  }, [getPosts])

  return (
    <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Anuncios
      </h2>

      {/* Formulario de Comentario */}
      <div className="flex items-center space-x-4">
        <form onSubmit={onSubmit} className="w-full">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Título:</label>
          <input
            type="text"
            placeholder="Escribe un título para el anuncio..."
            className="dark:text-white dark:bg-[#1a1a1a] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            {...register('title', { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">Este campo es requerido</span>
          )}

          <label className="block mb-1 text-gray-700 dark:text-gray-300">Contenido:</label>
          <textarea
            placeholder="Contenido del anuncio..."
            className="dark:text-white dark:bg-[#1a1a1a] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
            {...register('content', { required: true })}
          />
          {errors.content && (
            <span className="text-red-500">Este campo es requerido</span>
          )}

          <button
            type="submit"
            className="px-4 py-2 mb-5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            disabled={isCreating}
          >
            {isCreating ? 'Creando...' : 'Comentar'}
          </button>
        </form>
      </div>

      {/* Lista de Comentarios */}
      <div className="mt-2 w-full">
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
              <>
                {user && user.rol === 2 ? (
                  <>
                    {posts?.map((post) => (
                      <div
                        onClick={() => handleSelectTask(post.id)}
                        key={post.id}
                        className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 dark:border-gray-600 mb-2 grid grid-cols-6 grid-rows-3 md:grid-rows-2 p-4 border border-gray-300 rounded-lg cursor-pointer"
                      >
                        {user?.id === post?.user?.id && (
                          <div
                            className="col-start-6 justify-self-end h-fit"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Dropdown
                              onAbandonClass={() => handleDeletePost(post.id)}
                              classId={classId}
                              additionalParam={post.id}
                              msg={'Eliminar anuncio'}
                            />
                          </div>
                        )}
                        <h3 className="dark:text-white text-xl row-start-1 font-bold break-words overflow-hidden mb-2 col-span-4">
                          {post.title || 'Sin Título'}
                        </h3>
                        <p className="dark:text-white text-lg break-words overflow-hidden row-start-2 col-span-4">
                          {post.content || 'Sin Contenido'}
                        </p>
                        <div className="dark:text-gray-400 text-gray-500 col-span-4 col-start-1 row-start-3 md:col-start-6 md:row-start-2 md:justify-self-end self-center italic">
                          {dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {posts?.map((post) => (
                      <div
                        onClick={() => handleSelectTask(post.id)}
                        key={post.id}
                        className="hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200 dark:border-gray-600 mb-2 grid grid-cols-6 grid-rows-3 md:grid-rows-2 p-4 border border-gray-300 rounded-lg cursor-pointer"
                      >
                        <div
                          className="col-start-6 justify-self-end h-fit"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Dropdown
                            onAbandonClass={() => handleDeletePost(post.id)}
                            classId={classId}
                            additionalParam={post.id}
                            msg={'Eliminar anuncio'}
                          />
                        </div>
                        <h3 className="dark:text-white text-xl row-start-1 font-bold break-words overflow-hidden mb-2 col-span-4">
                          {post.title || 'Sin Título'}
                        </h3>
                        <p className="dark:text-white text-lg break-words overflow-hidden row-start-2 col-span-4">
                          {post.content || 'Sin Contenido'}
                        </p>
                        <div className="dark:text-gray-400 text-gray-500 col-span-4 col-start-1 row-start-3 md:col-start-6 md:row-start-2 md:justify-self-end self-center italic">
                          {dayjs(post.createdAt).format('DD/MM/YYYY HH:mm')}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CommentsBox;