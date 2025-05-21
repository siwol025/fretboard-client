import React, {useContext, useEffect, useState} from "react"
import { ImageIcon, X, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {Link, useNavigate, useParams} from "react-router-dom";
import {createPost, getPost, updatePost} from "@/api/post.js";
import {TipTapEditor} from "@/components/ui/tiptapEditor.jsx";
import AuthContext from "@/context/Auth.jsx";

export default function PostForm({ mode = "create"}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate();
  const {boardId, postId} = useParams();
  const { isLogin, nickname } = useContext(AuthContext);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    }

    if (mode === "edit") {
      getPost(postId)
        .then(res => {
          if (nickname !== res.data.author) {
            navigate("/");
          }
          setTitle(res.data.title);
          setContent(res.data.content);
        })
        .catch(error => {
          console.log(error)
          alert("해당 게시물이 존재하지 않습니다.")
          navigate("/");
        })
    }
  },[postId, mode, navigate])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.")
      return
    }



    try {
      let response;
      if (mode === "edit") {
        response = await updatePost(postId,{boardId, title, content});
      } else {
        response = await createPost({ boardId, title, content });
      }

      if (response.status === 204) {
        alert("게시글이 수정되었습니다.")
        navigate(`/${boardId}/posts/${postId}`);
      }

      if (response.status === 201) {
        alert("게시글이 작성되었습니다.")
        navigate(`/${boardId}` + response.headers["location"]);
      }
    } catch (error) {
      console.error(error);
      alert(error.response.data.message);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-lg mt-8 mb-8">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-xl text-left font-medium">
          { mode==="edit" ? "게시물 수정" : "새 게시글 작성" }
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 text-left">
            <Label htmlFor="title" className="text-base ml-5">
              제목
            </Label>
            <Input
              id="title"
              placeholder="제목을 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-base pl-4"
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="content" className="text-base ml-5">
              내용
            </Label>
            <TipTapEditor value={content} onChange={setContent} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t py-4 bg-muted/30">
          <Button variant="outline" type="button" onClick={() => navigate(-1)}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} className="gap-1">
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting ? "등록 중..." : "게시글 등록"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
