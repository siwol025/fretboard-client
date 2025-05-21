// LoginPage.jsx 개선 버전 (SignupPage와 유사한 에러 메시지 방식 적용)

import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthContext from "@/context/Auth.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isLogin, setIsLogin, updateMemberInfo } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [formErrors, setFormErrors] = useState({ username: "", password: "" });
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  useEffect(() => {
    if (isLogin) navigate("/");
  }, [isLogin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 입력되면 에러 제거
    setFormErrors((prev) => {
      const updated = { ...prev };
      if (value.trim()) updated[name] = "";
      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const updated = { ...formErrors };
    if (!value.trim()) updated[name] = name === "username" ? "아이디를 입력해주세요." : "비밀번호를 입력해주세요.";
    setFormErrors(updated);
  };

  const validateForm = () => {
    const errors = { username: "", password: "" };
    let hasError = false;

    if (!formData.username) {
      usernameInputRef.current?.focus();
      errors.username = "아이디를 입력해주세요.";
      hasError = true;
    }
    if (!formData.password) {
      if (!hasError) passwordInputRef.current?.focus();
      errors.password = "비밀번호를 입력해주세요.";
      hasError = true;
    }

    setFormErrors(errors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/login", formData);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      updateMemberInfo(response.data.accessToken);
      setIsLogin(true);
      navigate("/");
    } catch (error) {
      setFormErrors({ username: "", password: error.response?.data?.message || "로그인에 실패했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <Link to="/" className="flex items-center gap-2 no-underline text-inherit">
                <span className="text-xl font-bold">FretBoard</span>
              </Link>
            </div>
            <CardTitle className="text-2xl text-center">로그인</CardTitle>
            <CardDescription className="text-center">계정 정보를 입력하여 로그인하세요</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 아이디 */}
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    placeholder="아이디를 입력해주세요."
                    className="pl-10"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={usernameInputRef}
                    disabled={isLoading}
                  />
                </div>
                {formErrors.username && <p className="text-sm text-destructive pl-1 animate-fade-in">{formErrors.username}</p>}
              </div>

              {/* 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력해주세요."
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={passwordInputRef}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}</span>
                  </Button>
                </div>
                {formErrors.password && <p className="text-sm text-destructive pl-1 animate-fade-in">{formErrors.password}</p>}
              </div>

              {/* 버튼 */}
              <Button type="submit" className="w-full bg-gray-800 mt-6" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              계정이 없으신가요? <Link to="/signup" className="text-inherit hover:underline">회원가입</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
