import { FC } from 'react';
import ErrorBlock from '../UI/ErrorBlock';
import Modal from '../UI/Modal';

interface SeminarDeleteModalProps {
  handleError: () => void;
  handleDeleteSeminar: () => void;
  handleStopDelete: () => void;
  isDeleting: boolean;
  isDeleteLoading: boolean;
  errorUpdatingSeminar: { message: string };
}

export const SeminarDeleteModal: FC<SeminarDeleteModalProps> = ({
  handleError,
  handleStopDelete,
  errorUpdatingSeminar,
  isDeleting,
  isDeleteLoading,
  handleDeleteSeminar,
}) => {
  return (
    <>
      <Modal
        open={errorUpdatingSeminar.message.length > 0}
        onClose={handleError}
      >
        <div className="bg-white gap-2 p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
          <ErrorBlock
            title="Ошибка при удалении"
            message={errorUpdatingSeminar.message}
          />
          <form method="dialog" className="flex justify-end">
            <button
              className="button px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900 transition-colors cursor-pointer"
              onClick={handleStopDelete}
            >
              Ок
            </button>
          </form>
        </div>
      </Modal>
      <Modal onClose={handleStopDelete} open={isDeleting}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
          <h2 className="text-xl font-bold mb-4">Вы уверены?</h2>
          <p className="text-gray-700 mb-6">
            Вы действительно хотите удалить семинар?
          </p>
          <div className="form-actions flex justify-end space-x-4">
            {isDeleteLoading && <p className="text-gray-600">Удаление...</p>}
            {!isDeleteLoading && (
              <>
                <button
                  onClick={handleStopDelete}
                  className="button-text px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  Омена
                </button>
                <button
                  onClick={handleDeleteSeminar}
                  className="button px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors cursor-pointer"
                >
                  Удалить
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
