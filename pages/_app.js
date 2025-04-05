import "@/styles/globals.css";
import { useRouter } from "next/router";
import Header from "@/pages/components/Header";
import {useEffect} from "react";



export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noHeaderFooter = ["/login", "/kakao/callback", "/signUp"]; // 헤더를 제외할 페이지 목록

  // 서비스 워커 등록
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker 등록 성공:", registration);
      })
      .catch((error) => {
        console.error("Service Worker 등록 실패:", error);
      });
    }
  }, []);

  return (
    <div className="flex">
      <div className="flex-1">
        {/* 헤더 */}
        {!noHeaderFooter.includes(router.pathname) && <Header />}
        {/* 현재 페이지가 noHeaderFooter에 포함되지 않으면 헤더를 표시 */}

        {/* 페이지 내용 */}
        <Component {...pageProps} />
      </div>
    </div>
      // <Component {...pageProps} />
  );
}
