"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { LogIn, Eye, EyeOff } from "lucide-react"
import {loginCheckFetch, postWithoutFetch} from "@/pages/common/fetch"
import {initializeFirebaseMessaging} from "@/pages/common/firebase-messaging";

export default function KakaoLogin() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    loginCheckFetch()
  }, [])

  const BASE_URL_FRONT = process.env.NEXT_PUBLIC_BASE_URL_FRONT

  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_LOGIN_API_KEY
  const REDIRECT_URI = `${BASE_URL_FRONT}/kakao/callback` // redirect 주소
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData({
      ...loginData,
      [name]: value,
    })
  }

  // 로그인 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 유효성 검사
    const newErrors = {}
    if (!loginData.email) {
      newErrors.email = "이메일을 입력해주세요"
    }
    if (!loginData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const fcmToken = await initializeFirebaseMessaging()
      if (fcmToken) {
        loginData.fcmToken = fcmToken;
      }

      const result = await postWithoutFetch('/auth/login', loginData);
      console.log(result)
      if (result.code === 0) {
        localStorage.setItem("access_token", result.value.accessToken);
        localStorage.setItem("refresh_token", result.value.refreshToken);
        // 로그인 성공 시 홈페이지로 이동
        await router.push("/home")
      } else {
        setErrors({
          general: "이메일과 비밀번호를 확인해주세요.",
        })
      }
    } catch (error) {
      console.error("로그인 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#4AFF8C]/20 flex items-center justify-center mb-6">
              <LogIn size={32} className="text-[#4AFF8C]" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">Melody & Voice</h2>
          <p className="mt-2 text-center text-sm text-gray-400">음악을 공유하고 발견하는 최고의 플랫폼</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#242424] py-8 px-4 shadow-lg shadow-black/50 sm:rounded-lg sm:px-10 border border-gray-800">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* 이메일 입력 필드 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  이메일
                </label>
                <div className="mt-1">
                  <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={loginData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#1A1A1A] text-white focus:outline-none focus:ring-[#4AFF8C] focus:border-[#4AFF8C] sm:text-sm"
                      placeholder="이메일 주소 입력"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              {/* 비밀번호 입력 필드 */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  비밀번호
                </label>
                <div className="mt-1 relative">
                  <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={loginData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm placeholder-gray-500 bg-[#1A1A1A] text-white focus:outline-none focus:ring-[#4AFF8C] focus:border-[#4AFF8C] sm:text-sm"
                      placeholder="비밀번호 입력"
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/*
                  <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#4AFF8C] focus:ring-[#4AFF8C] border-gray-700 rounded bg-[#1A1A1A]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    로그인 상태 유지
                  </label>
                  */}
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#4AFF8C] hover:text-[#3de97d]">
                    비밀번호를 잊으셨나요?
                  </a>
                </div>
              </div>

              {errors.general && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm font-medium text-red-800">{errors.general}</p>
                      </div>
                    </div>
                  </div>
              )}

              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#4AFF8C] hover:bg-[#3de97d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4AFF8C] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#242424] text-gray-400">또는</span>
                </div>
              </div>

              <div>
                <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  {/*<a href={KAKAO_AUTH_URI}>카카오 계정으로 로그인</a>*/}
                  <a href="#">카카오 계정으로 로그인 (잠시 막습니다.)</a>
                </button>
              </div>

              <div className="text-center">
                <span className="text-gray-400 text-sm">계정이 없으신가요?</span>{" "}
                <a href="/signUp" className="text-[#4AFF8C] hover:underline text-sm font-medium">
                  회원가입
                </a>
              </div>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            로그인함으로써 Melody & Voice의{" "}
            <a href="#" className="text-[#4AFF8C] hover:underline">
              서비스 약관
            </a>{" "}
            및{" "}
            <a href="#" className="text-[#4AFF8C] hover:underline">
              개인정보 처리방침
            </a>
            에 동의할 건 따로 없으십니다 ^^
          </p>
        </div>
      </div>
  )
}

KakaoLogin.getInitialProps = async (ctx) => {
  return "login"
}

