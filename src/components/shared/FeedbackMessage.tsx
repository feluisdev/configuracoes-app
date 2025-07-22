import React from 'react';

interface FeedbackMessageProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  className?: string;
}

const FeedbackMessage: React.FC<FeedbackMessageProps> = ({ type, message, className = '' }) => {
  const baseClasses = 'p-4 rounded-md text-sm';
  const typeClasses = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    warning: 'bg-yellow-100 text-yellow-700',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} role="alert">
      {message}
    </div>
  );
};

export default FeedbackMessage;
