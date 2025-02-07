import { FC } from 'react';
import { Seminar, SeminarCard } from './SeminarCard';

interface SeminarsListProps {
  seminars: Seminar[];
  handleStartDelete: (id: number) => void;
  handleStartEdit: (id: number) => void;
}

export const SeminarsList: FC<SeminarsListProps> = ({
  seminars,
  handleStartDelete,
  handleStartEdit,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {seminars.map((seminar: Seminar) => (
        <SeminarCard
          key={seminar.id}
          {...seminar}
          handleStartDelete={handleStartDelete}
          handleStartEdit={handleStartEdit}
        />
      ))}
    </div>
  );
};
