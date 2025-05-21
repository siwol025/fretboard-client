import React, {useState, useContext, useEffect} from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import AuthContext from "@/context/Auth"
import authFetcher from "@/api/fetcher/auth.js";
import {useNavigate} from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { isLogin } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
    type: null,
    message: "",
  })

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }
  },[isLogin,navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*]{8,}$/

    if (!formData.currentPassword) {
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요."
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "새 비밀번호를 입력해주세요."
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword = "비밀번호는 8자 이상이며, 영문과 숫자를 포함하고 허용된 문자만 사용해야 합니다."
    } else if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "현재 비밀번호와 다른 비밀번호를 입력해주세요."
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요."
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      await authFetcher.post(
        "/members/password-changes",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }
      )

      setSubmitStatus({
        type: "success",
        message: "비밀번호가 성공적으로 변경되었습니다.",
      })

      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      alert("비밀번호가 성공적으로 변경되었습니다.")

      navigate("/mypage")
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => navigate("/mypage")}>
          <ArrowLeft className="h-4 w-4" /> 마이페이지로 돌아가기
        </Button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-2xl">비밀번호 변경</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="p-6 space-y-6">
              {submitStatus.type && (
                <Alert variant={submitStatus.type === "success" ? "default" : "destructive"} className="mb-6">
                  <div className="flex items-center gap-2">
                    {submitStatus.type === "success" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertDescription>{submitStatus.message}</AlertDescription>
                  </div>
                </Alert>
              )}

              {/* 현재 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={errors.currentPassword ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && <p className="text-sm text-red-500">{errors.currentPassword}</p>}
              </div>

              {/* 새 비밀번호 */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={errors.newPassword ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword ? (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.</p>
                )}
              </div>

              {/* 새 비밀번호 확인 */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={errors.confirmPassword ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t p-6">
              <Button type="button" variant="outline" onClick={() => navigate("/mypage")} disabled={isSubmitting}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "처리 중..." : "비밀번호 변경"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
