import { FC } from 'react';

export interface Seminar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  photo: string;
}

interface SeminarCardProps extends Seminar {
  handleStartDelete: (id: number) => void;
  buttonDisabled: boolean;
  handleStartEdit: (id: number) => void;
}

export const SeminarCard: FC<SeminarCardProps> = ({
  id,
  title,
  description,
  date,
  time,
  photo,
  handleStartDelete,
  buttonDisabled,
  handleStartEdit,
}) => {
  const formatDate = (dateString: string) => {
    const reverseDate = dateString.split('.').reverse().join('.');
    const date = new Date(reverseDate);

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  const formattedDate = formatDate(date);

  return (
    <div
      key={id}
      className="flex flex-col justify-between max-w-sm rounded overflow-hidden shadow-lg bg-white"
    >
      <div>
        <div className="h-48 overflow-hidden flex items-center justify-center">
          <img className="w-full h-full object-cover" src={photo} alt={title} />
        </div>
        <div className="px-6 py-4">
          <h2 className="font-bold text-xl mb-2">{title}</h2>
          <p className="text-gray-700 text-base">{description}</p>
        </div>
      </div>
      <div className="px-6 py-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">{formattedDate}</span>
        <span className="text-sm text-gray-600">{time}</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleStartEdit(id)}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg
              className="w-[20px] h-[20px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </button>
          <button
            disabled={buttonDisabled}
            onClick={() => handleStartDelete(id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg
              className="w-[20px] h-[20px] text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
