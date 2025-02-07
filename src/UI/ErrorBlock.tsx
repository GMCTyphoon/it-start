import React from 'react';

interface ErrorBlockProps {
  title: string;
  message: string;
}

const ErrorBlock: React.FC<ErrorBlockProps> = ({ title, message }) => {
  return (
    <div className="flex items-center p-4 bg-red-900 rounded-lg text-white">
      <div className="flex items-center justify-center w-12 h-12 bg-red-700 rounded-full text-2xl">
        !
      </div>
      <div className="ml-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorBlock;