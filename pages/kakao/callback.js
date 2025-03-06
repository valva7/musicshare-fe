"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function KakaoCallback() {
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)
  // URL 정보를 가져오거나, 프로그래밍 방식으로 페이지 이동(navigation)을 처리할 때 사용
  const router = useRouter()

  useEffect(() => {
    const { code, error: kakaoError } = router.query

    if (code) {
      // 실제 백엔드 API 호출하여 코드로 액세스 토큰을 교환합니다.
      const exchangeCodeForToken = async () => {
        try {
          const response = await fetch("http://localhost:8080/auth/kakao-token?code=" + code, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // body: JSON.stringify({ code }),
          });

          const data = await response.json();
          if (response.ok) {
            setStatus("success");
            // 받은 토큰을 로컬 스토리지에 저장
            const access_token = data.value;
            localStorage.setItem("access_token", access_token);
          } else {
            // 오류가 발생한 경우
            setStatus("error");
            setError(data.error || "알 수 없는 오류가 발생했습니다.");
          }
        } catch (error) {
          setStatus("error");
          setError("카카오 로그인 중 네트워크 오류가 발생했습니다.");
        }
      };

      exchangeCodeForToken();
    }
  }, [router.query]);

  const handleGoToMain = () => {
    router.push("/main/calendar")
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  if (status === "loading") {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-xl font-semibold text-gray-700">로그인 처리 중...</p>
        </div>
    )
  }

  if (status === "error") {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">로그인 오류</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
                onClick={handleGoToLogin}
                className="w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              메인 페이지로 이동
            </button>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600 mb-4">로그인 성공!</h2>
          <p className="text-gray-700 mb-4">카카오 계정으로 로그인되었습니다.</p>
          <button
              onClick={handleGoToMain}
              className="w-full bg-yellow-400 text-gray-900 py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            메인 페이지로 이동
          </button>
        </div>
      </div>
  )
}

