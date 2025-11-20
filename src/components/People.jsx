import React, { useState, useEffect } from 'react';
import { useClass } from '../context/ClassContext';
import { useParams } from 'react-router-dom';
import { Riple } from 'react-loading-indicators';
import { set } from 'react-hook-form';
import HighlightLetter from './ui/HighlightLetter';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { MessageCircle } from 'lucide-react';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

function People() {
    const { classId } = useParams();
    const { getUsersByClass } = useClass();
    const [isLoading, setIsLoading] = useState(true);
    const [people, setPeople] = useState();
    const { startChatWithUser } = useChat();
    const { user: currentUser } = useAuth();

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const users = await getUsersByClass(classId);
            setPeople(users);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [classId, getUsersByClass]);

    useRealTimeUpdates('course_updated', (data) => {
        if (String(data.course.id) === String(classId)) {
            fetchUsers();
        }
    });

    console.log('people', people)

    const handleChatClick = (userId) => {
        startChatWithUser(userId);
    };

    return (
        <div className='mx-5 md:mx-0'>
            {isLoading ? (
                <div className="flex justify-center">
                    <Riple color="#cec702" size="large" />
                </div>
            ) : (
                <>
                    {people?.length === 0 ? (
                        <p className="dark:text-white">No hay usuarios en esta clase.</p>
                    ) : (
                        <ul className='bg-white rounded-lg p-5 shadow-md'>
                            {people?.map((person) => {
                                const isMe = person.id === currentUser.id;
                                return (
                                    <React.Fragment key={person.id}>
                                        {person.role.name === 'teacher' ? (
                                            <>
                                                <HighlightLetter className="font-opendyslexic font-semibold" size='text-lg'>Docente/s:</HighlightLetter>
                                                <li className="mb-4 p-4 rounded-lg shadow-sm bg-pastelYellow flex justify-between items-center">
                                                    <p className="dark:text-white font-semibold">{person.people.first_name} {person.people.last_name}</p>
                                                    {!isMe && (
                                                        <button 
                                                            onClick={() => handleChatClick(person.id)}
                                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors"
                                                            title="Enviar mensaje"
                                                        >
                                                            <MessageCircle size={20} />
                                                        </button>
                                                    )}
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <HighlightLetter className="font-opendyslexic font-semibold" size='text-lg'>Estudiantes:</HighlightLetter>
                                                <li className="mb-4 p-4 rounded-lg shadow-sm bg-pastelYellow flex justify-between items-center">
                                                    <p className="dark:text-white font-semibold">{person.people.first_name} {person.people.last_name}</p>
                                                    {!isMe && (
                                                        <button 
                                                            onClick={() => handleChatClick(person.id)}
                                                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors"
                                                            title="Enviar mensaje"
                                                        >
                                                            <MessageCircle size={20} />
                                                        </button>
                                                    )}
                                                </li>
                                            </>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default People;

