import React, {useState, useContext, useEffect} from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Check, AlertCircle, Upload, X, User, Mail } from "lucide-react"
import AuthContext from "@/context/Auth"
import {useNavigate} from "react-router-dom";
import authFetcher from "@/api/fetcher/auth.js";

export default function EditProfile() {
  const navigate = useNavigate()
  //const fileInputRef = useRef(null)
  const { username, nickname, setNickname, isLogin} = useContext(AuthContext)

  const [formData, setFormData] = useState({ nickname })

  const [previewUrl, setPreviewUrl] = useState("/placeholder-user.jpg")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" })

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

  // const handleImageChange = (e) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return
  //
  //   if (!file.type.startsWith("image/")) {
  //     setErrors((prev) => ({ ...prev, profileImage: "이미지 파일만 업로드 가능합니다." }))
  //     return
  //   }
  //
  //   if (file.size > 5 * 1024 * 1024) {
  //     setErrors((prev) => ({ ...prev, profileImage: "파일 크기는 5MB 이하여야 합니다." }))
  //     return
  //   }
  //
  //   setNewProfileImage(file)
  //   setErrors((prev) => ({ ...prev, profileImage: "" }))
  //
  //   const reader = new FileReader()
  //   reader.onload = () => {
  //     setPreviewUrl(reader.result)
  //   }
  //   reader.readAsDataURL(file)
  // }

  // const handleRemoveImage = () => {
  //   //setNewProfileImage(null)
  //   setPreviewUrl(null)
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""
  //   }
  // }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요."
    } else if (formData.nickname.length < 2 || formData.nickname.length > 15) {
      newErrors.nickname = "닉네임은 2자 이상, 15자 이하여야 합니다."
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
      const response = await authFetcher.post("/members/edit-profile", {
        newNickname: formData.nickname,
      })

      setSubmitStatus({
        type: "success",
        message: "닉네임이 성공적으로 업데이트되었습니다.",
      })

      setNickname(response.data.newNickname)
      localStorage.setItem("nickname", response.data.newNickname)

      setTimeout(() => {
        navigate("/mypage")
      }, 1000)
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "닉네임 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-4 flex items-center gap-1" onClick={() => navigate("/mypage")}> <ArrowLeft className="h-4 w-4" /> 마이페이지로 돌아가기 </Button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardTitle className="text-2xl">회원 정보 수정</CardTitle>
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

              {/* 프로필 이미지 업로드 */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={previewUrl || "/placeholder.svg"} alt="프로필 이미지" />
                  <AvatarFallback>{formData.nickname.slice(0, 2)}</AvatarFallback>
                </Avatar>

                {/*<div className="flex flex-col items-center gap-2">*/}
                {/*  <div className="flex gap-2">*/}
                {/*    <Button type="button" variant="outline" size="sm" className="flex items-center gap-1" onClick={() => fileInputRef.current?.click()}>*/}
                {/*      <Upload className="h-3 w-3" /> 이미지 업로드*/}
                {/*    </Button>*/}

                {/*    {previewUrl && (*/}
                {/*      <Button type="button" variant="outline" size="sm" className="flex items-center gap-1 text-red-500 hover:text-red-600" onClick={handleRemoveImage}>*/}
                {/*        <X className="h-3 w-3" /> 이미지 삭제*/}
                {/*      </Button>*/}
                {/*    )}*/}
                {/*  </div>*/}

                {/*  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />*/}

                {/*  {errors.profileImage && <p className="text-sm text-red-500">{errors.profileImage}</p>}*/}

                {/*  <p className="text-xs text-muted-foreground">JPG, PNG 또는 GIF 파일, 최대 5MB</p>*/}
                {/*</div>*/}
              </div>

              {/* 사용자 정보 폼 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="username">아이디</Label>
                  </div>
                  <Input id="username" name="username" value={username} disabled={true} className="bg-muted" />
                  <p className="text-xs text-muted-foreground">아이디는 변경할 수 없습니다.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="nickname">닉네임</Label>
                  </div>
                  <Input id="nickname" name="nickname" value={formData.nickname} onChange={handleChange} className={errors.nickname ? "border-red-500" : ""} disabled={isSubmitting} />
                  {errors.nickname ? (
                    <p className="text-sm text-red-500">{errors.nickname}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">닉네임은 커뮤니티에서 표시되는 이름입니다.</p>
                  )}
                </div>


              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t p-6">
              <Button type="button" variant="outline" onClick={() => navigate("/mypage")} disabled={isSubmitting}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting || formData.nickname === nickname}>
                {isSubmitting ? "저장 중..." : "닉네임 변경"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
