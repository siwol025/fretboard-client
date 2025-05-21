import { useState, useEffect } from "react";
import axios from "axios";

export function usePosts(boardId, page) {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (boardId !== null) {
      axios.get(`/api/posts?boardId=${boardId}&page=${page}`)
        .then((res) => {
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages);
        })
        .catch(console.error);
    }
  }, [boardId, page]);

  return { posts, totalPages };
}
