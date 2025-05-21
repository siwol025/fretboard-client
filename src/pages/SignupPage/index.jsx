import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
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

export default function SignupPage() {
  const navigate = useNavigate();
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  const nicknameInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });

  const [formErrors, setFormErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nickname: "",
  });

  const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*]{8,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 유효할 경우만 에러 제거
    setFormErrors((prev) => {
      const updated = { ...prev };
      if (name === "username" && usernameRegex.test(value)) updated.username = "";
      if (name === "password" && passwordRegex.test(value)) updated.password = "";
      if (name === "confirmPassword" && value === formData.password) updated.confirmPassword = "";
      if (name === "nickname" && value.trim() !== "") updated.nickname = "";
      return updated;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const updated = { ...formErrors };

    if (name === "username") {
      if (!value) updated.username = "아이디를 입력해주세요.";
      else if (!usernameRegex.test(value))
        updated.username = "아이디는 4~12자의 영문 또는 숫자만 입력 가능합니다.";
    }

    if (name === "password") {
      if (!value) updated.password = "비밀번호를 입력해주세요.";
      else if (!passwordRegex.test(value))
        updated.password =
          "비밀번호는 8자 이상으로 영문과 숫자를 포함해야 하며, 허용된 문자(영문, 숫자, !@#$%^&*)만 사용할 수 있습니다.";
    }

    if (name === "confirmPassword") {
      if (!value) updated.confirmPassword = "비밀번호 확인을 입력해주세요.";
      else if (value !== formData.password)
        updated.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (name === "nickname") {
      if (!value.trim()) updated.nickname = "닉네임을 입력해주세요.";
      else if (formData.nickname.length < 2 || formData.nickname.length > 15) {
        updated.nickname = "닉네임은 2자 이상, 15자 이하여야 합니다."
      }
    }

    setFormErrors(updated);
  };

  const validateForm = () => {
    const errors = {
      username: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    };

    let hasError = false;

    if (!formData.username) {
      usernameInputRef.current?.focus();
      errors.username = "아이디를 입력해주세요.";
      hasError = true;
    } else if (!usernameRegex.test(formData.username)) {
      if (!hasError) usernameInputRef.current?.focus();
      errors.username = "아이디는 4~12자의 영문 또는 숫자만 입력 가능합니다.";
      hasError = true;
    }

    if (!formData.password) {
      if (!hasError) passwordInputRef.current?.focus();
      errors.password = "비밀번호를 입력해주세요.";
      hasError = true;
    } else if (!passwordRegex.test(formData.password)) {
      if (!hasError) passwordInputRef.current?.focus();
      errors.password =
        "비밀번호는 8자 이상이며 영문과 숫자를 포함해야 하며, 허용된 문자(영문, 숫자, !@#$%^&*)만 사용할 수 있습니다.";
      hasError = true;
    }

    if (!formData.confirmPassword) {
      if (!hasError) confirmPasswordInputRef.current?.focus();
      errors.confirmPassword = "비밀번호 확인을 입력해주세요.";
      hasError = true;
    } else if (formData.password !== formData.confirmPassword) {
      if (!hasError) confirmPasswordInputRef.current?.focus();
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      hasError = true;
    }

    if (!formData.nickname) {
      if (!hasError) nicknameInputRef.current?.focus();
      errors.nickname = "닉네임을 입력해주세요.";
      hasError = true;
    }

    setFormErrors(errors);
    return !hasError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    setFormErrors({
      username: "",
      password: "",
      confirmPassword: "",
      nickname: "",
    });

    try {
      await axios.post("/api/members/signup", {
        username: formData.username,
        password: formData.password,
        nickname: formData.nickname,
      });

      alert("회원가입에 성공하였습니다. 로그인페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
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
            <CardTitle className="text-2xl text-center">회원가입</CardTitle>
            <CardDescription className="text-center">계정 정보를 입력하여 회원가입하세요</CardDescription>
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
                    placeholder="아이디를 입력하세요"
                    className="pl-10"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={usernameInputRef}
                    disabled={isSubmitting}
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
                    placeholder="비밀번호를 입력하세요"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={passwordInputRef}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                    </span>
                  </Button>
                </div>
                {formErrors.password && <p className="text-sm text-destructive pl-1 animate-fade-in">{formErrors.password}</p>}
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 다시 입력하세요"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={confirmPasswordInputRef}
                    disabled={isSubmitting}
                  />
                </div>
                {formErrors.confirmPassword && (
                  <p className="text-sm text-destructive pl-1 animate-fade-in">{formErrors.confirmPassword}</p>
                )}
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="nickname"
                    name="nickname"
                    placeholder="닉네임을 입력하세요"
                    className="pl-10"
                    value={formData.nickname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={nicknameInputRef}
                    disabled={isSubmitting}
                  />
                </div>
                {formErrors.nickname && <p className="text-sm text-destructive pl-1 animate-fade-in">{formErrors.nickname}</p>}
              </div>

              {/* 버튼 */}
              <Button type="submit" className="w-full bg-gray-800" disabled={isSubmitting}>
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
                    회원가입 중...
                  </>
                ) : (
                  "회원가입"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="text-primary hover:underline">
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}