'use client';

import { useEffect } from 'react';

// dev 서버에서 `/`에 라우트가 없어 404가 발생하는 것을 방지하기 위한 클라이언트 리다이렉트.
// 정적 export 빌드 시에는 public/index.html이 out/index.html을 덮어써 언어 감지 리다이렉트를 담당한다.
export default function RootPage() {
  useEffect(() => {
    window.location.replace('/ko');
  }, []);

  return null;
}
