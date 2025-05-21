"use client"

import {useContext, useEffect, useState} from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Lock, User } from "lucide-react"
import timeConverter from "@/utils/timeConverter"
import { useMyPosts } from "./hooks/useMyPosts"
import {Link, useNavigate} from "react-router-dom";
import {generatePageNumbers} from "@/utils/generatePageNumbers.js";
import Pagination from "@/components/Pagenation/index.jsx";
import AuthContext from "@/context/Auth.jsx";

export default function MyPage() {
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(0)
  const { isLogin, username, nickname} = useContext(AuthContext);
  const { posts, totalPages } = useMyPosts(currentPage)

  useEffect(() => {
    if (!isLogin) {
      navigate("/login") // 이미 로그인 되어 있으면 메인 페이지로 리디렉션
    }
  }, [isLogin, navigate])

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (!posts) {
    return <div className="p-8 text-center text-muted-foreground">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 프로필 섹션 */}
        <section className="mb-8">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardTitle className="text-2xl">마이페이지</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={"/placeholder.svg"} alt={nickname} />
                    <AvatarFallback>{nickname.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {/*<Button*/}
                  {/*  variant="outline"*/}
                  {/*  size="sm"*/}
                  {/*  className="flex items-center gap-1"*/}
                  {/*  onClick={() => navigate("/mypage/edit-profile")}*/}
                  {/*>*/}
                  {/*  <Edit className="h-3 w-3" /> 프로필 수정*/}
                  {/*</Button>*/}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" /> 아이디
                      </div>
                      <div className="font-medium">{username}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" /> 닉네임
                      </div>
                      <div className="font-medium">{nickname}</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" /> 비밀번호
                      </div>
                      <div className="font-medium">••••••••</div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" /> 작성한 글
                      </div>
                      <div className="font-medium">{posts.length}개</div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigate("/mypage/change-password")}>
                      비밀번호 변경
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => navigate("/mypage/edit-profile")}>
                      회원 정보 수정
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 내 활동 탭 */}
        <section className="mb-8">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="posts">내가 쓴 글</TabsTrigger>
              <TabsTrigger value="comments">내 댓글</TabsTrigger>
              <TabsTrigger value="bookmarks">북마크</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">내가 쓴 글</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {posts.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">작성한 글이 없습니다.</div>
                  ) : (
                    <>
                      <ul className="divide-y m-0 p-0">
                        {posts.map((post) => (
                          <li key={post.id} className="p-4 hover:bg-muted/50 transition-colors">
                            <Link
                              to={`/${post.boardId}/posts/${post.id}`}
                              className="block no-underline text-inherit"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100">
                                  {post.boardTitle}
                                </span>
                                <span className="font-medium">{post.title}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{post.excerpt}</span>
                                <div className="flex items-center gap-2">
                                  <span>댓글 {post.commentCount}</span>
                                  <span>•</span>
                                  <span>{timeConverter(post.createdAt)}</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>
              {/* 페이지네이션 */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                generatePageNumbers={generatePageNumbers}
              />
            </TabsContent>

            <TabsContent value="comments">
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  내 댓글 기능은 준비 중입니다.
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookmarks">
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  북마크 기능은 준비 중입니다.
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}
