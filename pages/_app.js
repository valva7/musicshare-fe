import "@/styles/globals.css";
import { useRouter } from "next/router";
import Header from "@/pages/common/Header";


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noHeaderFooter = ["/login", "/kakao/callback", "/main/post"]; // 헤더를 제외할 페이지 목록

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
