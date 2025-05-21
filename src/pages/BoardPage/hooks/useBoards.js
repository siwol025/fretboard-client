import { useState, useEffect } from "react";
import axios from "axios";

export function useBoards() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios.get("/api/boards")
      .then((res) => setBoards(res.data.contents))
      .catch(console.error);
  }, []);

  return boards;
}
