import { useEffect } from 'react';
import swal from 'sweetalert';

export function SuccessModal({ msg, onClose }) {
  useEffect(() => {
    if (msg) {
      swal({
        title: '¡Éxito!',
        text: msg,
        icon: 'success',
        buttons: {
          confirm: {
            text: 'Cerrar',
            value: true,
            visible: true,
            className: '',
            closeModal: true,
          },
        },
      }).then(() => {
        if (onClose) {
          onClose(); // Ejecuta la acción pasada como prop para manejar el cierre.
        }
      });
    }
  }, [msg, onClose]);

  return null; // El componente no renderiza nada visual
}
