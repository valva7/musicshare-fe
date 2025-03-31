"use client"

import { initializeApp } from "firebase/app"
import { getMessaging, getToken } from "firebase/messaging"

export const apiKey = process.env.NEXT_PUBLIC_API_KEY
export const authDomain = process.env.NEXT_PUBLIC_AUTH_DOMAIN
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
export const storageBucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET
export const senderId = process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID
export const appId = process.env.NEXT_PUBLIC_APP_ID

// Firebase 구성 객체
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: senderId,
  appId: appId
}

// Firebase 앱 초기화
let app
let messaging

// 브라우저 환경에서만 실행되도록 함
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig)
    messaging = getMessaging(app)
  } catch (error) {
    console.error("Firebase 초기화 오류:", error)
  }
}

// 알림 권한 요청 및 토큰 발급
export async function requestNotificationPermission() {
  if (typeof window === "undefined") return ""

  try {
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      return await retrieveToken()
    } else {
      console.warn("알림 권한이 거부되었습니다.")
      return ""
    }
  } catch (error) {
    console.error("알림 권한 요청 중 오류 발생:", error)
    return ""
  }
}

// FCM 토큰 발급
export async function retrieveToken() {
  if (typeof window === "undefined" || !messaging) return ""

  try {
    const apiKey = "BLiMA5KA2RFHz07tWHse81eNyDNM6GRV0mESDDLNdH-lWPwTk3EyYrCgp1v51zHh09mIVy2TuGmas-gyMAQKX3o"
    const currentToken = await getToken(messaging, { vapidKey: apiKey })

    if (currentToken) {
      return currentToken
    } else {
      console.warn("등록된 토큰이 없습니다.")
      return ""
    }
  } catch (error) {
    console.error("토큰 검색 중 오류 발생:", error)
    return ""
  }
}

// 사용 예시 함수
export async function initializeFirebaseMessaging() {
  return await requestNotificationPermission()
}

