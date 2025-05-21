import { useState, useEffect } from "react";
import axios from "axios";

// API 기본 URL 설정 (필요한 경우 변경)
const API_BASE_URL = "/api"; // 또는 실제 API 서버 URL (예: "https://your-api-server.com/api")

export function useBoardPageData(boardId, page = 0, keyword = "") {
  const [boardData, setBoardData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!boardId) {
      setLoading(false);
      return;
    }

    // API 호출 함수
    const fetchData = async () => {
      try {

        // 병렬로 API 호출
        const [boardResponse, postsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/boards/${boardId}`),
          axios.get(`${API_BASE_URL}/posts`, {
            params: {
              boardId,
              keyword,
              page
            }
          })
        ]);

        // 데이터 설정
        setBoardData(boardResponse.data);
        setPosts(postsResponse.data.posts || []);
        setTotalPages(postsResponse.data.totalPages || 1);

      } catch (err) {
        // 에러 상세 정보 로깅
        if (err.response) {
          // 서버 응답이 있는 경우
          console.error("서버 응답:", err.response.status, err.response.data);
        } else if (err.request) {
          // 요청은 보냈지만 응답이 없는 경우
          console.error("서버 응답 없음");
        } else {
          // 요청 설정 중 오류
          console.error("요청 오류:", err.message);
        }

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boardId, keyword, page]); // boardId나 page가 변경될 때마다 데이터 다시 로드

  return {
    board: boardData,
    posts,
    totalPages,
    loading,
    error
  };
}