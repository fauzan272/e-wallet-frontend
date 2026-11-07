import { useState, useEffect, useCallback } from 'react';

const BASE_URL = (
  import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

function buildUrl(endpoint) {
  if (!BASE_URL) {
    throw new Error(
      'VITE_API_URL belum dikonfigurasi.'
    );
  }

  const path = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  return `${BASE_URL}${path}`;
}

function getHeaders(contentType = 'application/json') {
  const headers = {};

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  const token = localStorage.getItem('token');

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function requestApi(endpoint, options = {}) {
  const url = buildUrl(endpoint);

  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers,
    },
  });

  const responseText = await response.text();

  let result = null;

  if (responseText) {
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Respons server bukan JSON (HTTP ${response.status}): ${responseText.slice(0, 200)}`
      );
    }
  }

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.error ||
      `HTTP error ${response.status}: ${response.statusText}`
    );
  }

  return result;
}

function useFetch(endpoint = null) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(endpoint !== null);

  useEffect(() => {
    if (!endpoint) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const result = await requestApi(endpoint, {
          method: 'GET',
          signal: controller.signal,
        });

        setData(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [endpoint]);

  const get = useCallback(async (path) => {
    setError(null);

    try {
      return await requestApi(path, {
        method: 'GET',
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const post = useCallback(async (path, body) => {
    setError(null);

    try {
      return await requestApi(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const put = useCallback(async (path, body) => {
    setError(null);

    try {
      return await requestApi(path, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const del = useCallback(async (path) => {
    setError(null);

    try {
      return await requestApi(path, {
        method: 'DELETE',
      });
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
    del,
  };
}

export default useFetch;