import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

function useFetch(endpoint = null) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(endpoint !== null);
  const lastEndpoint = useRef(endpoint);

  if (endpoint !== lastEndpoint.current) {
    lastEndpoint.current = endpoint;
    setLoading(endpoint !== null);
    setError(null);
    setData(null);
  }

  const getHeaders = (contentType = 'application/json') => {
    const headers = {};
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  useEffect(() => {
    if (!endpoint) return;
    
    let isMounted = true;

    fetch(`${BASE_URL}${endpoint}`, {
      headers: getHeaders('application/json')
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (isMounted) setData(json);
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Fetch error:", err.message);
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  const get = useCallback(async (path) => {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: getHeaders('application/json'),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  async function post(path, body) {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: getHeaders('application/json'),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function put(path, body) {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'PUT',
        headers: getHeaders('application/json'),
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function del(path) {
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        method: 'DELETE',
        headers: getHeaders('application/json'),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  return { data, loading, error, get, post, put, del };
}

export default useFetch;
