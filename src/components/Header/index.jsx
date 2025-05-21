import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button.jsx";
import {Bell, LogOut, Settings, User} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.jsx";
import React, {useContext,} from "react";
import authFetcher from "@/api/fetcher/auth.js";
import AuthContext from "@/context/Auth.jsx";

export default function Header() {
  const { isLogin, setIsLogin , username, nickname} = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    authFetcher.defaults.headers.common = {};
    setIsLogin(false);
    window.location.reload();
  };

  return (
  <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 no-underline text-inherit">
            <span className="text-xl font-bold">FretBoard</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLogin ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" alt="사용자" />
                      <AvatarFallback>{nickname.substring(0,1)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{nickname}</p>
                      <p className="text-sm text-muted-foreground">{username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/mypage" className="cursor-pointer flex items-center no-underline text-inherit">
                      <User className="mr-2 h-4 w-4" />
                      <span>마이페이지</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer flex items-center" >
                    <LogOut className="mr-2 h-4 w-4"/>
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/signup" className="no-underline text-inherit">회원가입</Link>
              </Button>
              <Button className="bg-gray-800" asChild>
                <Link to="/login" className="no-underline text-inherit">로그인</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  </header>

)}