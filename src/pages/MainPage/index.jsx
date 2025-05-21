import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

import { ChevronRight } from "lucide-react";
import {useRecentPosts} from "@/pages/MainPage/hooks/useRecentPosts.js";
import timeConverter from "@/utils/timeConverter.js";

// 각 게시판의 최근 게시물
const recentPosts = {
  tech: [
    { id: 1, title: "Next.js 14 버전에서 달라진 점", author: "김개발", date: "2023-11-15", comments: 32, isNew: true },
    { id: 2, title: "React 상태 관리 라이브러리 비교", author: "박프론트", date: "2023-11-10", comments: 45, isNew: false },
    { id: 3, title: "TypeScript 타입 시스템 심화", author: "김개발", date: "2023-11-03", comments: 37, isNew: false },
    { id: 4, title: "웹 성능 최적화 기법", author: "이성능", date: "2023-10-30", comments: 23, isNew: false },
    { id: 5, title: "GraphQL vs REST API 비교", author: "최백엔드", date: "2023-10-25", comments: 19, isNew: false },
  ],
  design: [
    { id: 1, title: "Tailwind CSS로 반응형 디자인 구현하기", author: "이디자인", date: "2023-11-14", comments: 15, isNew: true },
    { id: 2, title: "UI/UX 디자인 트렌드 2023", author: "정디자이너", date: "2023-11-05", comments: 19, isNew: false },
    { id: 3, title: "디자인 시스템 구축 경험 공유", author: "박디자인", date: "2023-10-28", comments: 27, isNew: false },
    { id: 4, title: "사용자 경험을 향상시키는 마이크로 인터랙션", author: "김UX", date: "2023-10-22", comments: 14, isNew: false },
    { id: 5, title: "디자이너와 개발자의 효과적인 협업 방법", author: "이협업", date: "2023-10-18", comments: 31, isNew: false },
  ],
  career: [
    { id: 1, title: "프론트엔드 개발자 로드맵 2023", author: "최주니어", date: "2023-11-08", comments: 28, isNew: true },
    { id: 2, title: "개발자 번아웃 극복하기", author: "박멘탈", date: "2023-10-28", comments: 52, isNew: false },
    { id: 3, title: "기술 면접 준비 팁", author: "김취준", date: "2023-10-20", comments: 43, isNew: false },
    { id: 4, title: "재택근무 효율적으로 하는 방법", author: "이재택", date: "2023-10-15", comments: 37, isNew: false },
    { id: 5, title: "개발자 포트폴리오 작성 가이드", author: "최포폴", date: "2023-10-10", comments: 29, isNew: false },
  ],
  free: [
    { id: 1, title: "요즘 읽고 있는 개발 서적 추천", author: "김독서", date: "2023-11-12", comments: 24, isNew: true },
    { id: 2, title: "개발자를 위한 커피 추천", author: "이카페인", date: "2023-11-07", comments: 35, isNew: false },
    { id: 3, title: "개발자 데스크 셋업", author: "박셋업", date: "2023-10-31", comments: 42, isNew: false },
    { id: 4, title: "주말에 뭐하세요?", author: "최휴식", date: "2023-10-27", comments: 19, isNew: false },
    { id: 5, title: "개발자 밈 모음", author: "정유머", date: "2023-10-23", comments: 56, isNew: false },
  ],
  qna: [
    { id: 1, title: "React useEffect 무한 루프 문제", author: "김리액트", date: "2023-11-13", comments: 8, isNew: true },
    { id: 2, title: "TypeScript 타입 추론이 안되는 경우", author: "이타입", date: "2023-11-09", comments: 12, isNew: false },
    { id: 3, title: "Next.js API Routes vs Server Actions", author: "박넥스트", date: "2023-11-02", comments: 15, isNew: false },
    { id: 4, title: "CSS Grid vs Flexbox 언제 써야 할까요?", author: "최CSS", date: "2023-10-29", comments: 23, isNew: false },
    { id: 5, title: "Jest로 비동기 함수 테스트하는 방법", author: "정테스트", date: "2023-10-24", comments: 7, isNew: false },
  ],
  notice: [
    { id: 1, title: "커뮤니티 이용 규칙 업데이트", author: "관리자", date: "2023-11-10", comments: 0, isNew: true },
    { id: 2, title: "11월 개발자 밋업 안내", author: "관리자", date: "2023-11-05", comments: 12, isNew: false },
    { id: 3, title: "사이트 점검 안내 (11/1 02:00-04:00)", author: "관리자", date: "2023-10-30", comments: 5, isNew: false },
    { id: 4, title: "새로운 게시판 '취업 정보' 오픈 안내", author: "관리자", date: "2023-10-20", comments: 8, isNew: false },
    { id: 5, title: "10월 이벤트 당첨자 발표", author: "관리자", date: "2023-10-15", comments: 3, isNew: false },
  ],
};

export default function MainPage() {
  const { data } = useRecentPosts();
  const colors = ["bg-blue-100 dark:bg-blue-900", "bg-purple-100 dark:bg-purple-900", "bg-green-100 dark:bg-green-900", "bg-yellow-100 dark:bg-green-900", "bg-red-100 dark:bg-yellow-900"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 배너 */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">FretBoard에 오신 것을 환영합니다!</h1>
          <p className="text-white/90 mb-4">다양한 주제의 게시판에서 지식을 나누고 소통해보세요.</p>
          {/*<div className="flex flex-wrap gap-2">*/}
          {/*  <Button variant="secondary" className="bg-white/20 hover:bg-white/30">*/}
          {/*    인기 게시글*/}
          {/*  </Button>*/}
          {/*  <Button variant="secondary" className="bg-white/20 hover:bg-white/30">*/}
          {/*    새 소식*/}
          {/*  </Button>*/}
          {/*  {!isLoggedIn && (*/}
          {/*    <Button variant="secondary" className="bg-white/20 hover:bg-white/30" >*/}
          {/*      로그인하고 참여하기*/}
          {/*    </Button>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>

        {/* 공지사항 섹션 */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-xl">📢</span> 공지사항
            </h2>
            <Link to="/2" className="text-sm flex items-center no-underline text-inherit">
              더보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <ul className="divide-y m-0 p-0">
                {data?.filter((board) => board.boardSlug === "notice")
                  .map((board) => (
                    board.posts.map((post) =>
                      <li key={post.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <Link to={`/${board.boardId}/posts/${post.id}`} className="block no-underline text-inherit">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{post.title}</span>
                            </div>
                          <span className="text-sm text-muted-foreground">{timeConverter(post.createdAt)}</span>
                         </div>
                        </Link>
                      </li>
                    )
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* 게시판 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.filter((board) => board.boardSlug !== "notice")
            .map((board, index) => (
              <section key={board.boardId} className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-xl">{board.icon}</span> {board.boardTitle}
                  </h2>
                  <Link to={`/${board.boardId}` } // todo: /${boardId}
                    className="text-sm flex items-center no-underline text-inherit"
                  >
                    더보기 <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <Card className={`border-t-4 ${colors[index % colors.length]} overflow-hidden`}> {/* todo: 컬러처리 */}
                  <CardContent className="p-0">
                    <ul className="m-0 p-0 divide-y">
                      {board.posts.map((post) => (
                        <li key={post.id} className="p-4 hover:bg-muted/50 transition-colors last:border-b-0">
                          <Link to={`/${board.boardId}/posts/${post.id}`} className="block no-underline text-inherit">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium line-clamp-1">{post.title}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{post.author}</span>
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
                  </CardContent>
              </Card>
            </section>
            ))}
        </div>
      </main>
    </div>
  )
}
