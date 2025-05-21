import React, {useState, createContext, useEffect} from 'react';

import { parseJwt } from '@/utils/decodeJwt';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  const [isLogin, setIsLogin] = useState(() => {
    return !!accessToken;
  });

  const [loginMemberId, setLoginMemberId] = useState(() => {
    if (accessToken) {
      const parsed = parseJwt(accessToken);
      return parsed?.id || null;
    }
    return '';
  });

  const [username, setUsername] = useState(() => {
    if (accessToken) {
      const parsed = parseJwt(accessToken);
      return parsed?.username || '';
    }
    return '';
  });

  const [nickname, setNickname] = useState(() => {
    if (accessToken) {
      const parsed = parseJwt(accessToken);
      return parsed?.nickname || '';
    }
    return '';
  });

  const updateMemberInfo = (token) => {
    const parsed = parseJwt(token);
    setUsername(parsed.username || '');
    setNickname(parsed.nickname || '');
    setLoginMemberId(parsed.id || null);
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" && e.newValue) {
        updateMemberInfo(e.newValue);
      }
      if (e.key === "nickname" && e.newValue) {
        setNickname(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, username, setUsername, loginMemberId, setLoginMemberId, nickname, setNickname, updateMemberInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;