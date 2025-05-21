import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Search } from "lucide-react"
import {Link, useNavigate} from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            404
          </h1>
          <div className="absolute -bottom-4 left-0 right-0 mx-auto w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {/* 메시지 */}
        <div className="space-y-4 pt-6">
          <h2 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            요청하신 페이지는 존재하지 않습니다.
          </p>
        </div>

        {/* 일러스트레이션 */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-32 w-32 text-muted-foreground/20" strokeWidth={2} />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-muted-foreground/10 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/" className="text-inherit no-underline">
              <Home className="h-4 w-4" /> 홈으로 돌아가기
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to={navigate(-1)} className="text-inherit no-underline">
              <ArrowLeft className="h-4 w-4" /> 이전 페이지로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
