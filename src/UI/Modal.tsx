import { PropsWithChildren, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({
  open,
  children,
  onClose,
}: PropsWithChildren<
  Readonly<{
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
  }>
>) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open && dialog.current) {
      dialog.current.showModal();
    } else {
      dialog.current?.close();
    }
  }, [open]);

  const handleClose = () => {
    if (dialog.current) {
      dialog.current.close();
    }
    onClose();
  };

  return createPortal(
    <dialog
      ref={dialog}
      className="fixed inset-0 z-50 p-0 bg-transparent backdrop:bg-black/50"
      onClose={handleClose}
    >
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
          {open ? children : null}
        </div>
      </div>
    </dialog>,
    document.getElementById('modal') as HTMLElement
  );
}
