"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function KakaoCallback() {
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const { code, error: kakaoError } = router.query;

    // 'code'가 존재하는 경우에만 실행
    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          const response = await fetch(`http://localhost:8080/auth/kakao-token?code=${code}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();
          console.log("callback before" + result.code)
          console.log("callback before" + result.message)
          console.log("callback before" + result.value)
          if (result.code === 0) {
            console.log("callback 성공")
            setStatus("success");
            const access_token = result.value;
            localStorage.setItem("access_token", access_token);
            router.push("/main/home");
          } else {
            setStatus("error");
            setError("알 수 없는 오류가 발생했습니다.");
            router.push("/login");
          }
        } catch (error) {
          setStatus("error");
          setError("카카오 로그인 중 네트워크 오류가 발생했습니다.");
          router.push("/login");
        }
      };

      exchangeCodeForToken();
    }
  }, [router.query.code]); // 'code' 값이 바뀔 때만 실행되도록 변경

  const handleGoToMain = () => {
    router.push("/main/home")
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  return (
      <div>Loading...</div>
  );
}
