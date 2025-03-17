import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {LogIn} from "lucide-react";
import {loginCheckFetch} from "@/pages/common/fetch";

export default function KakaoLogin() {
  const router = useRouter();

  useEffect(() => {
    loginCheckFetch();
  }, []);

  const BASE_URL_FRONT = process.env.NEXT_PUBLIC_BASE_URL_FRONT;

  const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_LOGIN_API_KEY;
  const REDIRECT_URI = `${BASE_URL_FRONT}/kakao/callback`; // redirect 주소
  const KAKAO_AUTH_URI = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

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
            <div className="space-y-6">
              <div>
                <button type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                  <a href={KAKAO_AUTH_URI}>
                    카카오 계정으로 로그인
                  </a>
                </button>
              </div>
            </div>
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
  return 'login'
};
