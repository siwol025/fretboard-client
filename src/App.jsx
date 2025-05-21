import './App.css'
import {Route, Routes} from "react-router-dom";
import './index.css';
import SignupPage from "@/pages/SignupPage/index.jsx";
import PostForm from "@/components/PostForm/index.jsx";
import MainPage from "@/pages/MainPage/index.jsx";
import Header from "@/components/Header/index.jsx";
import BoardPage from "@/pages/BoardPage/index.jsx";
import LoginPage from "@/pages/LoginPage/index.jsx";
import PostDetailPage from "@/pages/PostDetailPage/index.jsx";
import MyPage from "@/pages/MyPage/index.jsx";
import Footer from "@/components/Footer/index.jsx";
import ErrorPage from "@/pages/ErrorPage/index.jsx";
import ChangePassword from "@/pages/MyPage/ChangePassword.jsx";
import EditProfile from "@/pages/MyPage/EditProfile.jsx";

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/:boardId" element={<BoardPage />}/>
        <Route path="/:boardId/posts/:postId" element={<PostDetailPage />}/>
        <Route path="/:boardId/new" element={<PostForm />} />
        <Route path="/:boardId/posts/:postId/edit" element={<PostForm mode="edit" />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/mypage/change-password" element={<ChangePassword />} />
        <Route path="/mypage/edit-profile" element={<EditProfile />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
