"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import {initializeFirebaseMessaging} from "@/pages/common/firebase-messaging";
import {postWithoutFetch} from "@/pages/common/fetch";

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


          const params = { code: code, fcmToken: fcmToken }
          await postWithoutFetch(`${BASE_URL_BACK}/auth/kakao-token`, params)

          const response = await fetch(`${BASE_URL_BACK}/auth/kakao-token?code=${code}&fcmToken=${fcmToken}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();

          if (result.code === 0) {
            setStatus("success");
            localStorage.setItem("access_token", result.value.accessToken);
            localStorage.setItem("refresh_token", result.value.refreshToken);
            router.push("/home");
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
    router.push("/home")
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  return (
      <div>Loading...</div>
  );
}
