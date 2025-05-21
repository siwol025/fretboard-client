import {useEffect, useState} from "react";
import authFetcher from "@/api/fetcher/auth.js";

export function useMyPosts(page) {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchData() {
      await authFetcher.get(`/members/mypage/posts?&page=${page}`)
        .then((res) => {
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages);
        })
        .catch(console.error);
    }
    fetchData();
  }, [page]);

  return { posts, totalPages };
}
