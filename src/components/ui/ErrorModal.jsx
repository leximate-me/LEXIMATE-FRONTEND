import { useEffect } from 'react';
import swal from 'sweetalert';

export function ErrorModal({ error, clearError }) {
   useEffect(() => {
    if (error) {

      swal({
        title: 'ERROR!',
        text: error,
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