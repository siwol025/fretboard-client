import { Link, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, PenSquare, Eye, MessageSquare, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { generatePageNumbers } from "@/utils/generatePageNumbers.js";
import Pagination from "@/components/Pagenation/index.jsx";
import timeConverter from "@/utils/timeConverter.js";
import { useBoardPageData } from "@/pages/BoardPage/hooks/useBoardPageData.js";
import ErrorPage from "@/pages/ErrorPage/index.jsx";

export default function BoardPage() {
  const { boardId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // 상태 변수 선언
  const [inputKeyword, setInputKeyword] = useState(searchParams.get("keyword") || "");
  const searchKeyword = searchParams.get("keyword") || "";
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const [currentPage, setCurrentPage] = useState(pageParam - 1);

  // 페이지와 검색어 파라미터가 변경되면 데이터 리페칭
  const { board, posts, totalPages, loading, error } = useBoardPageData(boardId, currentPage, searchKeyword);

  // 페이지 로드 시 검색어와 페이지 상태 동기화
  useEffect(() => {
    setInputKeyword(searchParams.get("keyword") || "");
  }, [searchParams]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    setCurrentPage(page - 1);  // 0-based index로 변환
  }, [searchParams]);

  // 페이지 변경 시 검색어를 포함한 URL 업데이트
  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page + 1);  // 1-based index로 변환
    setSearchParams(newParams);
  };

  // 검색어 입력 핸들링
  const handleSearchChange = (e) => setInputKeyword(e.target.value);

  // 검색어 제출 시 처리 (검색어 파라미터를 URL에 반영)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    newParams.set("page", "1");  // 검색 시 항상 1페이지로 리셋

    if (inputKeyword.trim()) {
      newParams.set("keyword", inputKeyword.trim());
    }
    setSearchParams(newParams);
  };

  // 엔터 키로 검색
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearchSubmit(e);
  };

  if (loading) {
    return <div className="text-center text-gray-500">로딩 중...</div>;
  }

  if (error) {
    return <ErrorPage/>
  }

  if (!board) {
    return <div className="text-center text-gray-500">게시판 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {board.title}
            </h1>
            <p className="text-muted-foreground mt-1">{board.description}</p>
          </div>
          {board.slug !== "notice" && board.slug!== "best" ? (
            <Link to={`/${boardId}/new`}>
              <Button className="gap-2 bg-gray-700">
                <PenSquare className="h-4 w-4" />
                글쓰기
              </Button>
            </Link>) : null
          }
        </div>

        <Card className="mb-8 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="검색어를 입력하세요"
                    className="pl-8 pr-2"
                    value={inputKeyword}
                    onChange={handleSearchChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <Button type="submit" variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="rounded-md border">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="bg-muted/50">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left font-medium w-[60%]">제목</th>
                    <th className="h-12 px-4 text-left font-medium hidden md:table-cell">작성자</th>
                    <th className="h-12 px-4 text-left font-medium hidden md:table-cell">작성일</th>
                    <th className="h-12 px-4 text-left font-medium">조회</th>
                  </tr>
                  </thead>
                  <tbody>
                  {posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Link to={`/${boardId}/posts/${post.id}`} className="font-medium hover:underline no-underline text-inherit">
                                {post.title}
                              </Link>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>{post.commentCount}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle hidden md:table-cell">{post.author}</td>
                        <td className="p-4 align-middle hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{timeConverter(post.createdAt)}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3 text-muted-foreground" />
                            <span>{post.viewCount}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-muted-foreground">
                        게시글이 없습니다.
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          generatePageNumbers={generatePageNumbers}
        />
      </div>
    </div>
  );
}
