import { useContext, useEffect, useState, useRef } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { deletePost, getPost } from "@/api/post.js"
import {MessageSquare, MoreHorizontal, Clock, ChevronRight, Edit, Trash2, Eye} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import timeConverter from "@/utils/timeConverter.js"
import AuthContext from "@/context/Auth.jsx"
import ErrorPage from "@/pages/ErrorPage/index.jsx";

export default function PostDetailPage() {
  const { postId, boardId } = useParams() // useParams 수정
  const [isSubmitting] = useState(false)
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { isLogin, loginMemberId } = useContext(AuthContext)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editCommentText, setEditCommentText] = useState("")
  const [isEditingComment, setIsEditingComment] = useState(false)
  const [isDeletingComment, setIsDeletingComment] = useState(false)
  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = useState(false)
  const [commentToDelete, setCommentToDelete] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getPost(postId)
        setPost(response.data)
        setComments(response.data.commentResponse?.contents || [])
      } catch (err) {
        console.error(err)
        setError("게시글을 불러오는 데 실패했습니다.")
      }
    }

    fetchPost()
  }, [postId])

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      const token = localStorage.getItem("accessToken") // 토큰 꺼내오기

      const response = await axios.post(
        `/api/posts/${postId}/comments`,
        { content: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setComments((prev) => [response.data, ...prev])
      setCommentText("")
      alert("댓글이 작성되었습니다.")
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("댓글 등록에 실패했습니다.")
    }
  }

  const handleDeletePost = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("accessToken")

      await deletePost(postId, token)
      setIsDeleting(false)
      setShowDeleteDialog(false)
      alert("게시글이 삭제되었습니다.")

      // 수정된 부분: window.location.href를 사용하여 전체 페이지 리로드
      window.location.href = `/${boardId}`
    } catch (err) {
      console.error(err)
      alert("게시글 삭제에 실패했습니다.")
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // 게시물 삭제 다이얼로그 열기
  const openDeleteDialog = () => {
    setShowDeleteDialog(true)
  }

  const handleEditComment = (commentId) => {
    const comment = comments.find((c) => c.id === commentId)
    if (comment) {
      setEditingCommentId(commentId)
      setEditCommentText(comment.content)
    }
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditCommentText("")
  }

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) return

    setIsEditingComment(true)
    try {
      const token = localStorage.getItem("accessToken")

      await axios.put(
        `/api/comments/${commentId}`,
        { content: editCommentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // 댓글 목록 업데이트
      setComments(
        comments.map((comment) => (comment.id === commentId ? { ...comment, content: editCommentText } : comment)),
      )

      setEditingCommentId(null)
      setEditCommentText("")
      alert("댓글이 수정되었습니다.")
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("댓글 수정에 실패했습니다.")
    } finally {
      setIsEditingComment(false)
    }
  }

  const handleDeleteComment = (commentId) => {
    setCommentToDelete(commentId)
    setShowDeleteCommentDialog(true)
  }

  const confirmDeleteComment = async () => {
    if (!commentToDelete) return

    setIsDeletingComment(true)
    try {
      const token = localStorage.getItem("accessToken")

      await axios.delete(`/api/comments/${commentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // 댓글 목록에서 삭제된 댓글 제거
      setComments(comments.filter((comment) => comment.id !== commentToDelete))

      alert("댓글이 삭제되었습니다.")
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert("댓글 삭제에 실패했습니다.")
    } finally {
      setIsDeletingComment(false)
      setShowDeleteCommentDialog(false)
      setCommentToDelete(null)
    }
  }

  if (error) {
    return <ErrorPage/>
  }

  if (!post) {
    return <div className="text-center text-gray-500">로딩 중...</div>
  }

  // 현재 로그인한 사용자가 게시물 작성자인지 확인
  const isAuthor = loginMemberId === post.authorId

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* 게시물 삭제 다이얼로그 - 완전히 새로 구현 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">게시글 삭제</h3>
              <p className="text-muted-foreground mt-1">
                정말로 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                취소
              </Button>
              <Button
                onClick={handleDeletePost}
                disabled={isDeleting}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    삭제 중...
                  </>
                ) : (
                  "삭제"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 댓글 삭제 확인 다이얼로그 */}
      {showDeleteCommentDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">댓글 삭제</h3>
              <p className="text-muted-foreground mt-1">
                정말로 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeleteCommentDialog(false)}
                disabled={isDeletingComment}
                className="w-full sm:w-auto"
              >
                취소
              </Button>
              <Button
                onClick={confirmDeleteComment}
                disabled={isDeletingComment}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600"
              >
                {isDeletingComment ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    삭제 중...
                  </>
                ) : (
                  "삭제"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 상단 네비게이션 */}
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center gap-1 text-muted-foreground">
            <Link to="/" className="hover:text-foreground text-inherit no-underline">
              홈
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/${post.boardId}`} className="hover:text-foreground text-inherit no-underline">
              {post.boardTitle}
            </Link>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* 게시글 헤더 */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{post.title}</h1>

            {/* 케밥 메뉴 (더보기 버튼) */}
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/${boardId}/posts/${postId}/edit`}
                      className="cursor-pointer flex items-center gap-2 no-underline text-inherit"
                    >
                      <Edit className="h-4 w-4" />
                      <span>게시물 수정</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={openDeleteDialog}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>게시물 삭제</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex items-center gap-3 mb-8">
            <Avatar className="h-11 w-11">
              <AvatarImage src={post.authorImage || "/placeholder.svg"} alt={post.author} />
              <AvatarFallback className="bg-primary/10 text-inherit">{post.author.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="mt-3">
                <p className="font-medium p-0 m-0">{post.author}</p>
                <p className="flex text-muted-foreground">
                  {timeConverter(post.createdAt) + " · "}
                  <Eye className="ml-1 mr-1 mt-1 h-4 w-4"/>{post.viewCount || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 본문 */}
        <article className="prose dark:prose-invert max-w-none mb-32">
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* 댓글 섹션 */}
        <section className="">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            댓글 {comments.length}
          </h2>

          {/* 댓글 작성 폼 */}
          <div className="mb-8">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <Textarea
                placeholder={isLogin ? "댓글을 작성해주세요" : "댓글을 쓰려면 로그인이 필요합니다."}
                className="resize-none focus-visible:ring-primary min-h-[80px]"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting || !isLogin}
              />
              <div className="flex justify-end border-b pb-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !isLogin}
                  className="relative overflow-hidden group transition-all duration-200 bg-gray-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      등록 중...
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        댓글 등록
                      </span>
                      <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* 댓글 목록 */}
          {comments.length > 0 ? (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.authorImage || "/placeholder.svg"} alt={comment.author} />
                      <AvatarFallback className="bg-secondary/10 text-secondary">
                        {comment.author.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeConverter(comment.createdAt)}
                          </span>
                        </div>
                      </div>
                      {editingCommentId === comment.id ? (
                        <div className="mb-3">
                          <Textarea
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="resize-none focus-visible:ring-primary min-h-[80px] mb-2"
                            disabled={isEditingComment}
                          />
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={handleCancelEdit} disabled={isEditingComment}>
                              취소
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateComment(comment.id)}
                              disabled={isEditingComment}
                              className="bg-gray-700"
                            >
                              {isEditingComment ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  저장 중...
                                </>
                              ) : (
                                "저장"
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-base mb-3 leading-relaxed">{comment.content}</p>
                      )}
                      <div className="flex items-center gap-3">
                        {/*<Button*/}
                        {/*  variant="ghost"*/}
                        {/*  size="sm"*/}
                        {/*  className="h-7 px-2 text-xs gap-1 rounded-full hover:bg-secondary/10 hover:text-secondary"*/}
                        {/*>*/}
                        {/*  <MessageSquare className="h-3 w-3" />*/}
                        {/*  <span>답글 달기</span>*/}
                        {/*</Button>*/}

                        {/* 작성자인 경우에만 수정/삭제 버튼 표시 */}
                        {loginMemberId === comment.authorId && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1 rounded-full hover:bg-primary/10 hover:text-primary"
                              onClick={() => handleEditComment(comment.id)}
                            >
                              <Edit className="h-3 w-3" />
                              <span>수정</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>삭제</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-4 mb-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
