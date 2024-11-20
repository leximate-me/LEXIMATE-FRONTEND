import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTask } from '../context/TasksContext';
import Loading from '../components/ui/Loading';
import { useTool } from '../context/ToolContext';
import '../styles/fonts.css'; // Importa el archivo CSS con la fuente

function TaskPage({ tasks: initialTasks }) {
  const { classId, taskId } = useParams();
  const { getTask } = useTask();
  const [task, setTask] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);
  const { extractText, extractedText, isExtracting, setExtractedText } = useTool();  // Asegúrate de obtener setExtractedText

  // Función para formatear la fecha en AAAA/MM/DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  const handleExtractText = async (url) => {
    try {
      await extractText(url);
    } catch (error) {
      console.error('Error al extraer el texto:', error);
    }
  };

  useEffect(() => {
    const loadTask = async () => {
      try {
        const fetchedTask = await getTask(classId, taskId);
        setTask(fetchedTask);
      } catch (error) {
        console.error('Error al cargar la tarea:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTask();
  }, [classId, taskId, getTask]);

  // Limpiar el texto extraído al cambiar la tarea
  useEffect(() => {
    setExtractedText([]); // Limpiar el texto extraído cada vez que cambie la tarea
  }, [taskId, classId, setExtractedText]);

  // Función para procesar el texto extraído
  const renderExtractedText = (extractedText) => {
    let titleWords = []; // Para acumular las palabras de tipo title
    let subtitleAndParagraph = []; // Para acumular todo el contenido (title, subtitle y paragraph)
    let output = []; // Array final para contener los bloques de texto

    extractedText.forEach((item, index) => {
      // Si se encuentran palabras que sean de tipo subtitle o paragraph se acumulan en un array y se unen en un solo párrafo
      if (item.classification !== 'title') {
        subtitleAndParagraph.push(item.text);
      } else {
        if (subtitleAndParagraph.length > 0) {
          output.push(
            <p
              key={`subtitleAndParagraph-${index}`}
              className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              {subtitleAndParagraph
                .join(' ')
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                    <br />
                  </React.Fragment>
                ))}

            </p>
          );
          subtitleAndParagraph = [];
        }
      }

      if (item.classification === 'title') {
        // Si encontramos una palabra de tipo 'title', la agregamos al array de 'title'
        titleWords.push(item.text);
      } else {
        // Si encontramos una palabra que no es de tipo title (subtitle o paragraph)
        if (titleWords.length > 0) {
          // Si hay palabras de tipo 'title' acumuladas, las imprimimos en un solo párrafo
          output.push(
            <p
              key={`title-${index}`}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              {titleWords
                .join(' ')
                .split('\n')
                .map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                    <br />
                  </React.Fragment>
                ))}

            </p>
          );
          titleWords = []; // Reseteamos el array de palabras 'title' después de imprimirlas
        }
      }
    });

    // Si al final quedan palabras de tipo title, las mostramos
    if (titleWords.length > 0) {
      output.push(
        <p
          key="title-final"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          style={{ fontFamily: 'OpenDyslexic' }}
        >
          {titleWords
            .join(' ')
            .split('\n')
            .map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
                <br />
              </React.Fragment>
            ))}
        </p>
      );
    }

    if (subtitleAndParagraph.length > 0) {
      output.push(
        <p
          key="subtitleAndParagraph-final"
          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
          style={{ fontFamily: 'OpenDyslexic' }}
        >
          {subtitleAndParagraph
            .join(' ')
            .split('\n')
            .map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
                <br />
              </React.Fragment>
            ))}
        </p>
      );
    }
    return output;
  };

  return (
    <div className="container mx-auto p-6">
      {isLoading || isExtracting ? (
        <div className="h-[500px] flex justify-center items-center">
          {Loading(isLoading ? 'Cargando tarea...' : 'Extrayendo texto...')}
        </div>
      ) : (
        <>
          {task ? (
            <div className="space-y-6">
              {/* Información de la Tarea */}
              <div className="dark:border-[#fffd92] grid grid-cols-1 md:grid-cols-6 gap-6 p-2 md:p-5 border rounded-lg shadow-md">
                <div className="col-span-6 md:col-span-4 flex flex-col items-center md:items-start gap-4">
                  <h1 className="text-2xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                    {task.title}
                  </h1>
                  <p className="text-md md:text-3xl text-gray-700 dark:text-gray-300 mb-2">
                    {task.description}
                  </p>
                  <p className="text-md md:text-2xl text-gray-600 dark:text-gray-400">
                    <b>Fecha de entrega:</b> {formatDate(task.due_date)}
                  </p>
                </div>

                {task.files && task.files.length > 0 && (
                  <div className="col-span-6 md:col-span-2 flex justify-center items-center">
                    <ul>
                      {task.files.map((file) => (
                        <li
                          key={file._id}
                          className="flex flex-col md:flex-row items-end gap-2"
                        >
                          <a
                            href={file.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <img
                              src={file.file_url}
                              alt="Archivo adjunto"
                              className="border-2 border-gray-300 h-[200px] md:h-[300px] object-cover rounded-lg shadow-[0px_5px_20px_-8px_#4a5568] hover:opacity-75 transition"
                            />
                          </a>
                          <button
                            onClick={() => handleExtractText(file.file_url)}
                            className="h-fit mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
                          >
                            Convertir Texto
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Mostrar el texto extraído en una tarjeta */}
              {extractedText && extractedText.length > 0 && (
                <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-lg shadow-md border dark:border-[#fffd92]">
                  <div
                    className="text-lg font-sans leading-relaxed text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: 'OpenDyslexic' }}
                  >
                    {renderExtractedText(extractedText)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p
              className="text-gray-500 dark:text-gray-400 text-center"
              style={{ fontFamily: 'OpenDyslexic' }}
            >
              Tarea no encontrada
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default TaskPage;
