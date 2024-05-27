import { useEffect } from 'react';

const useUnload = (callback, condition) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (condition) {
        event.preventDefault();
        event.returnValue = ''; // Standard way to show the prompt
      }
    };

    const handleUnload = () => {
      if (condition) {
        callback();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
    };
  }, [callback, condition]);
};

export default useUnload;
