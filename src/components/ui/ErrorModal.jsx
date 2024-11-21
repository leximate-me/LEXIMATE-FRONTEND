import { useEffect } from 'react';
import swal from 'sweetalert';

export function ErrorModal({ error, clearError }) {
  useEffect(() => {
    if (error) {
      let messages;
      if (Array.isArray(error.error)) {
        messages = error.error.map((err) => err).join('\n');
      } else {
        messages = error.error || error.message || null;
      }

      swal({
        title: 'ERROR!',
        text: messages,
        icon: 'error',
        buttons: {
          confirm: {
            text: 'Cerrar',
            value: true,
            visible: true,
            className: '',
            closeModal: true,
          },
        },
        dangerMode: true,
      }).then(() => {
        clearError();
      });
    }
  }, [error, clearError]);

  return null;
}