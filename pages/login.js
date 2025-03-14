import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function KakaoLogin() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch("http://localhost:8080/login/check", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        // JSON 응답을 파싱
        const result = await response.json();

        if (result.code === 0) {
          router.replace("/main/home"); // 로그인 상태이면 메인으로 이동
        }
      } catch (error) {
      }
    };

    checkLogin();
  }, []);

  // 카카오 개발자 앱 키 선언
  const REST_API_KEY = "b5b4e67b3c1c519d3dd172cdc4cd5cc8"; // RestAPI 키
  const REDIRECT_URI = "http://localhost:3000/kakao/callback"; // redirect 주소
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">카카오 계정으로 로그인</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div>
              <button type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                <a href={KAKAO_AUTH_URI}>
                    카카오 계정으로 로그인
                  </a>
              </button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <a
                      href="#"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Sign up</span>
                    회원가입
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

KakaoLogin.getInitialProps = async (ctx) => {
  return 'login'
};
