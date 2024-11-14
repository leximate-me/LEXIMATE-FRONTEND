import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePost } from '../context/PostContext';
import { useParams } from 'react-router-dom';
import Dropdown from './ui/DropDownButton';
import { Riple } from 'react-loading-indicators';
import { useNavigate } from 'react-router-dom';

function CommentsBox() {
    const { classId } = useParams();
    const { handleSubmit, register, formState: { errors } } = useForm();
    const { createPost, getPosts, deletePost, posts } = usePost();
    const [isLoading, setIsLoading] = useState(true);

    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    const handleSelectTask = (commentId) => {
        console.log('comentario seleccionado:', commentId);
        navigate(`/${classId}/task/post/${commentId}`);
    }

    useEffect(() => {
        console.log(isLoading);
    }, [isLoading]);

    // Cargar posts al montar el componente
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                await getPosts(classId);
                setIsLoading(false);
                console.log('posts:', posts);
            } catch (error) {
                console.error('Error al obtener los posts:', error);
            }
        };
        fetchPosts();
    }, [classId, getPosts]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            await createPost(classId, data);
            await getPosts(classId); // Obtener posts actualizados
        } catch (error) {
            console.error('Error al crear el post:', error);
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

    return (
        <div className="border border-gray-300 dark:border-gray-500 p-6 rounded-lg shadow-[0px_9px_15px_-7px_rgba(0,0,0,0.75)]">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Anuncios</h2>

            {/* Formulario de Comentario */}
            <div className="flex items-center space-x-4">
                <form onSubmit={onSubmit} className="w-full">
                    <label>Título:</label>
                    <input
                        type="text"
                        placeholder="Escribe un título para el anuncio..."
                        className="dark:bg-[#1a1a1a] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
                        {...register('title', { required: true })}
                    />
                    {errors.title && <span className="text-red-500">Este campo es requerido</span>}

                    <label>Contenido:</label>
                    <textarea
                        placeholder="Contenido del anuncio..."
                        className="dark:bg-[#1a1a1a] w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-5"
                        {...register('content', { required: true })}
                    />
                    {errors.content && <span className="text-red-500">Este campo es requerido</span>}

                    <button
                        type="submit"
                        className="px-4 py-2 mb-5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                    >
                        Comentar
                    </button>
                </form>
            </div>

            {/* Lista de Comentarios */}
            <div className="mt-2 w-full">
                {isLoading ? (
                    <div className='flex justify-center'>
                        <Riple color="#cec702" size="large" />
                    </div>
                ) : (
                    <>
                        {Array.isArray(posts) && posts.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No hay anuncios aún.</p>
                        ) : (
                            posts?.map((post) => (
                                <div
                                    onClick={ () => handleSelectTask(post.id) }
                                    key={post.id}
                                    className="dark:border-gray-600 mb-2 grid grid-cols-6 p-2 border border-gray-300 rounded-lg cursor-pointer">
                                    <div
                                        className="col-start-8 w-fit h-fit"
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
                                    <div className='col-span-5 row-start-1 col-start-1 dark:text-white dark:hover:text-blue-400 hover:text-blue-700'>
                                        <h3 className="text-lg font-bold">{post.title}</h3>
                                        <p>{post.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default CommentsBox;
