import { FormEvent, useEffect, useState } from 'react';
import useHttp from '../hooks/useHttp';
import { Seminar } from './SeminarCard';
import Modal from '../UI/Modal';
import ErrorBlock from '../UI/ErrorBlock';

export interface SeminarFormProps {
  seminar: Seminar;
  onSubmit: (data: Seminar) => void;
  isEditing: boolean;
  handleStopEdit: () => void;
}

const requestConfig = { method: 'PATCH' };

export default function SeminarForm({
  seminar,
  onSubmit,
  isEditing,
  handleStopEdit,
}: SeminarFormProps) {
  const formattedDate = seminar.date.split('.').reverse().join('-');
  const [errorEditingSeminar, setErrorEditingSeminar] = useState<{
    message: string;
  }>({ message: '' });
  const { sendRequest, isLoading, error } = useHttp(
    `http://localhost:3000/seminars/${seminar.id}`,
    requestConfig
  );

  useEffect(() => {
    if (error) {
      setErrorEditingSeminar({ message: error });
    }
  }, [error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = Object.fromEntries(formData);
    const data = {
      id: seminar?.id as number,
      title: input.title as string,
      description: input.description as string,
      date: input.date as string,
      time: input.time as string,
      photo: input.photo as string,
    };
    await sendRequest(JSON.stringify(data));
    onSubmit(data);
    handleStopEdit();
  };

  const onClose = () => {
    handleStopEdit();
  };

  const onErrorClose = () => {
    setErrorEditingSeminar({ message: '' });
    onSubmit(seminar);
  };

  return (
    <>
      <Modal
        open={errorEditingSeminar.message.length > 0}
        onClose={onErrorClose}
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-auto">
          <ErrorBlock
            title="Ошибка при отправке данных"
            message={errorEditingSeminar.message}
          />
          <form method="dialog" className="flex justify-end">
            <button className="button px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900 transition-colors cursor-pointer">
              Ок
            </button>
          </form>
        </div>
      </Modal>
      <Modal open={isEditing} onClose={onClose}>
        <form
          onSubmit={handleSubmit}
          className="rounded overflow-hidden shadow-lg bg-white p-6"
        >
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Картинка
            </label>
            <input
              required
              type="url"
              id="image"
              name="photo"
              defaultValue={seminar.photo}
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Заголовок семинара
            </label>
            <input
              required
              type="text"
              name="title"
              id="title"
              defaultValue={seminar.title}
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Описание
            </label>
            <input
              required
              type="text"
              name="description"
              id="description"
              defaultValue={seminar.description}
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="date"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Дата
            </label>
            <input
              required
              type="date"
              name="date"
              id="date"
              defaultValue={formattedDate}
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="time"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Время
            </label>
            <input
              required
              type="time"
              name="time"
              id="time"
              defaultValue={seminar.time}
              className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          {!isLoading && (
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none"
            >
              Сохранить
            </button>
          )}
          {isLoading && <p className="text-gray-600">Сохранение...</p>}
        </form>
      </Modal>
    </>
  );
}
