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

const INPUTS = [
  {
    id: 'image',
    name: 'photo',
    type: 'url',
    label: 'Картинка',
  },
  {
    id: 'title',
    name: 'title',
    type: 'text',
    label: 'Заголовок семинара',
  },
  {
    id: 'description',
    name: 'description',
    type: 'text',
    label: 'Описание',
  },
  {
    id: 'date',
    name: 'date',
    type: 'date',
    label: 'Дата',
    cb: (date: string | number) =>
      date.toString().split('.').reverse().join('-'),
  },
  {
    id: 'time',
    name: 'time',
    type: 'time',
    label: 'Время',
  },
];

export default function SeminarForm({
  seminar,
  onSubmit,
  isEditing,
  handleStopEdit,
}: SeminarFormProps) {
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
      id: seminar.id as number,
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
          {INPUTS.map((input) => (
            <div key={input.id} className="mb-4">
              <label
                htmlFor={input.id}
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {input.name}
              </label>
              <input
                required
                type={input.type}
                id={input.id}
                name={input.name}
                defaultValue={
                  input?.cb?.(seminar[input.name as keyof Seminar]) ||
                  seminar[input.name as keyof Seminar]
                }
                className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
          ))}

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
