import { useCallback, useEffect, useState } from 'react';

interface HttpConfig {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit;
}

interface UseHttpResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  sendRequest: (data?: BodyInit) => Promise<void>;
}

async function sendHttpRequest<T>(url: string, config?: HttpConfig): Promise<T> {
  const response = await fetch(url, config);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error(resData.message || 'Failed to fetch data');
  }

  return resData;
}

export default function useHttp<T>(
  url: string,
  config?: HttpConfig,
  initialData?: T
): UseHttpResponse<T> {
  const [data, setData] = useState<T | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = useCallback(
    async (requestData?: BodyInit) => {
      setIsLoading(true);
      setError(null);

      try {
        const resData = await sendHttpRequest<T>(url, { ...config, body: requestData });
        setData(resData);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    },
    [url, config]
  );

  useEffect(() => {
    const isGetRequest = !config || config.method === 'GET' || !config.method;
    if (isGetRequest) {
      sendRequest();
    }
  }, [sendRequest, config]);

  return {
    data,
    isLoading,
    error,
    sendRequest,
  };
}