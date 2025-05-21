import axios from 'axios';
import { isExpired, parseJwt } from '@/utils/decodeJwt';

const authFetcher = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// 요청 인터셉터 설정
authFetcher.interceptors.request.use(
  async (request) => {
    try {
      let accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      // 리프레시 토큰 유효성 체크 (만료 시 모두 제거)
      if (refreshToken && isExpired(parseJwt(refreshToken))) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('Refresh token expired');
      }
      // 액세스 토큰 만료 시 재발급 시도
      if (accessToken && isExpired(parseJwt(accessToken))) {
        const res = await axios.post('/api/login/reissue-token', {
          reissueToken: refreshToken,
        }, { withCredentials: true });

        accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
      }

      // 항상 최신 accessToken을 헤더에 주입
      if (accessToken) {
        request.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      return request;
    } catch (error) {
      console.error('[authFetcher] 요청 인터셉터 오류:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (선택 사항: 인증 실패 시 로그아웃 처리 등)

export default authFetcher;
