import React, {useState, useRef, useEffect} from "react"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, ImageIcon, Undo, Redo, Loader2 } from 'lucide-react'

import { Button } from "@/components/ui/button"

export function TipTapEditor({ value, onChange, placeholder = "내용을 입력하세요..." }) {
  const [isFocused, setIsFocused] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const imageInputRef = useRef(null)
  const isInitialized = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full my-4",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm sm:prose-base focus:outline-none max-w-none min-h-[200px] py-4 px-3",
      },
    },
  })

  useEffect(() => {
    if (editor && value && !isInitialized.current) {
      editor.commands.setContent(value)
      isInitialized.current = true
    }
  }, [editor, value])

  const handleImageUpload = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click()
    }
  }

  const uploadImageToServer = async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }

      const imageUrl = await response.text()
      return imageUrl
    } catch (error) {
      console.error('이미지 업로드 오류:', error)
      throw error
    }
  }

  const onImageInputChange = async (e) => {
    if (e.target.files?.length && editor) {
      const file = e.target.files[0]

      if (!file.type.startsWith('image/')) {
        alert("이미지 파일만 업로드 가능합니다");

        return
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("파일 크기는 10MB 이하여야 합니다.");
        return
      }

      setIsUploading(true)

      try {
        const imageUrl = await uploadImageToServer(file)
        editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run()

      } catch (error) {
        alert(error.message)
      } finally {
        setIsUploading(false)
        e.target.value = ""
      }
    }
  }

  if (!editor) {
    return null
  }

  return (
    <div className={`border rounded-md ${isFocused ? "ring-2 ring-primary" : ""}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
          title="제목 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
          title="제목 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
          title="굵게"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
          title="기울임"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
          title="글머리 기호 목록"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
          title="번호 매기기 목록"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleImageUpload}
          title="이미지 추가"
          disabled={isUploading}
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>

        <input type="file" ref={imageInputRef} onChange={onImageInputChange} accept="image/*" className="hidden" />

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="실행 취소"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="다시 실행"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
