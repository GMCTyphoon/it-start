import { FC, useEffect, useRef, useState } from 'react';
import { Seminar } from './SeminarCard';
import useHttp from '../hooks/useHttp';
import ErrorBlock from '../UI/ErrorBlock';
import SeminarForm, { SeminarFormProps } from './SeminarForm';
import { SeminarsList } from './SeminarsList';
import { SeminarDeleteModal } from './SeminarsDelete';

const requestConfig = {};
const initialSeminar = {
  id: 0,
  title: '',
  description: '',
  date: '',
  time: '',
  photo: '',
} as Seminar;

export const Seminars: FC = () => {
  const selectedId = useRef<number>(1);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [errorUpdatingSeminar, setErrorUpdatingSeminar] = useState<{
    message: string;
  }>({ message: '' });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedSeminar, setSelectedSeminar] =
    useState<Seminar>(initialSeminar);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const { data, isLoading, error } = useHttp(
    'http://localhost:3000/seminars',
    requestConfig,
    []
  );

  useEffect(() => {
    if (data) {
      setSeminars(data);
    }
  }, [data]);

  const handleStartDelete = (id: number) => {
    setIsDeleting(true);
    selectedId.current = id;
  };

  function handleStopDelete() {
    setIsDeleting(false);
  }

  const handleDeleteSeminar = async () => {
    try {
      setIsDeleteLoading(true);
      await fetch(`http://localhost:3000/seminars/${selectedId.current}`, {
        method: 'DELETE',
      });
      setSeminars((prevSeminars) =>
        prevSeminars.filter((seminar) => seminar.id !== selectedId.current)
      );
      setIsDeleteLoading(false);
      setIsDeleting(false);
    } catch (error) {
      setIsDeleteLoading(false);
      console.warn(error);
      setErrorUpdatingSeminar({
        message: (error as Error).message || 'Failed to delete seminar.',
      });
      setSeminars(seminars);
    }
  };

  const handleError = () => {
    setErrorUpdatingSeminar({ message: '' });
    handleStopDelete();
  };

  const handleSubmit: SeminarFormProps['onSubmit'] = (seminarToUpdate) => {
    if (seminarToUpdate) {
      setSeminars((prevSeminars) =>
        prevSeminars.map((seminar) => {
          return seminar.id === seminarToUpdate.id
            ? (seminar = { ...seminarToUpdate })
            : seminar;
        })
      );
    }
  };

  const handleStartEdit = (id: number) => {
    setIsEditing(true);
    selectedId.current = id;
    setSelectedSeminar(
      [...seminars].filter((a) => a.id === selectedId.current)[0]
    );
  };

  const handleStopEdit = () => {
    setIsEditing(false);
  };

  const Skeleton: FC = () => {
    return (
      <div
        role="status"
        className="max-w-sm p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700"
      >
        <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded-sm dark:bg-gray-700">
          <svg
            className="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 20"
          >
            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
          </svg>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
        <div className="flex items-center mt-4">
          <div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
            <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  };

  if (isLoading) return <Skeleton />;

  if (error)
    //блок с ошибкой
    return (
      <ErrorBlock
        title="Ошибка при загрузке списка семинаров"
        message={error}
      />
    );

  if (seminars.length === 0)
    return (
      <h1 className="p-8 text-center text-xl">
        Нет семинаров на ближайшее время
      </h1>
    );

  return (
    <>
      <SeminarDeleteModal
        errorUpdatingSeminar={errorUpdatingSeminar}
        handleDeleteSeminar={handleDeleteSeminar}
        handleError={handleError}
        handleStopDelete={handleStopDelete}
        isDeleting={isDeleting}
        isDeleteLoading={isDeleteLoading}
      />
      <SeminarsList
        seminars={seminars}
        handleStartDelete={handleStartDelete}
        handleStartEdit={handleStartEdit}
      />
      <SeminarForm
        seminar={selectedSeminar}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        handleStopEdit={handleStopEdit}
      />
    </>
  );
};
