import authFetcher from "@/api/fetcher/auth.js";
import axios from "axios";

export const createPost = async (postData) => {
  return await authFetcher.post('/posts', postData);
};

export const getPost = async (postId) => {
  return await axios.get('/api/posts/' + postId);
};

export const getPosts = async (params) => {
  return await axios.get('/api/posts/' + params);
};

// 게시물 수정
export const updatePost = async (postId, updatedData) => {
  return await authFetcher.put(`/posts/${postId}`, updatedData);
};

// 게시물 삭제
export const deletePost = async (postId) => {
  return await authFetcher.delete(`/posts/${postId}`);
};
