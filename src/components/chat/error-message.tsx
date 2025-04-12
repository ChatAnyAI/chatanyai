import React from 'react';
import { useGlobalStore } from '@/store/globalStore'
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  code?: number;
  msg: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ code, msg }) => {
  const user = useGlobalStore((state) => state.user);

  const renderSpecialErrorContent = () => {
    if (code === 4001) {
      if (user?.roleId === 2) {
        return (
          <div className="mt-2">
            <Button variant="outline" size="sm" className="text-primary">
              Navigate to Model Settings
            </Button>
          </div>
        );
      } else if (user?.roleId === 1) {
        return (
          <p className="text-sm mt-2">
            Please contact your administrator for assistance.
          </p>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex flex-row gap-2 items-start mt-2">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md w-full">
        <p className="text-sm font-medium">Error {code && `(${code})`}</p>
        <p className="text-sm">{msg}</p>
        {renderSpecialErrorContent()}
      </div>
    </div>
  );
};
