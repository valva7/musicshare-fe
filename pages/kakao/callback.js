"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {initializeFirebaseMessaging} from "@/pages/common/firebase-messaging";

export default function KakaoCallback() {
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState(null)
  const router = useRouter()

  const BASE_URL_BACK = process.env.NEXT_PUBLIC_BASE_URL_BACK;

  useEffect(() => {
    const { code, error: kakaoError } = router.query;

    // 'code'가 존재하는 경우에만 실행
    if (code) {
      const exchangeCodeForToken = async () => {
        try {
          const fcmToken = await initializeFirebaseMessaging()
          if (fcmToken) {
            console.log("알림 설정 완료:", fcmToken)
          }

          const response = await fetch(`${BASE_URL_BACK}/auth/kakao-token?code=${code}&fcmToken=${fcmToken}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();
          console.log(result);

          if (result.code === 0) {
            setStatus("success");
            const access_token = result.value.accessToken;
            const refresh_token = result.value.refreshToken;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
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
