import { useEffect, useState } from 'react';
import axios from 'axios';

export const useRecentPosts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axios.get('/api/posts/recent-posts');
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return { data, loading, error };
};
