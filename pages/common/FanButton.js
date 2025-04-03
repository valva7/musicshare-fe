"use client"

import { useState } from "react"
import {
  postWithAuthAndParamsFetch,
  postWithAuthFetch
} from "@/pages/common/fetch";

export default function FanButton({
  initialFanning ,
  artistId,
  size = "medium",
  variant = "primary",
  className = "",
}) {
  const [isFanning, setIsFanning] = useState(initialFanning)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // 버튼 크기에 따른 스타일 클래스
  const sizeClasses = {
    small: "text-xs px-3 py-1",
    medium: "text-sm px-4 py-1.5",
    large: "text-base px-5 py-2",
  }

  // 버튼 변형에 따른 스타일 클래스
  const variantClasses = {
    primary: isFanning
        ? "bg-purple-600 text-white hover:bg-purple-700 border border-purple-600"
        : "bg-purple-600 text-white hover:bg-purple-700 border border-purple-600",
    outline: isFanning
        ? "bg-transparent text-purple-600 border border-purple-600 hover:bg-purple-50"
        : "bg-transparent text-purple-600 border border-purple-600 hover:bg-purple-50",
    minimal: isFanning
        ? "bg-transparent text-purple-600 hover:text-purple-700"
        : "bg-transparent text-purple-600 hover:text-purple-700",
  }

  const handleToggleFollow = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
        await handleFan(artistId)
    } catch (error) {
      console.error("팬 상태 변경 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFan = async (artistId) => {
    const params = { artistId: artistId }
    const result = await postWithAuthAndParamsFetch("/fan", params)
    return Promise.resolve()
  }

  return (
      <button
          className={`
        rounded-full font-medium transition-all duration-200 ease-in-out
        flex items-center justify-center
        ${sizeClasses[size] || sizeClasses.medium}
        ${variantClasses[variant] || variantClasses.primary}
        ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
          onClick={handleToggleFollow}
          disabled={isLoading}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-pressed={isFanning}
      >
        {isLoading ? (
            <span className="flex items-center">
          <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          처리 중
        </span>
        ) : (
            <>{isFanning ? (isHovered ? "UnFan" : "Fan ♪") : "Fan"}</>
        )}
      </button>
  )
}

