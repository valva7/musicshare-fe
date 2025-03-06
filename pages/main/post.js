"use client"

import { useState } from "react"
import {
  Home,
  Search,
  Film,
  MessageCircle,
  Heart,
  PlusSquare,
  Menu,
  Bookmark,
  Send,
  MoreHorizontal,
} from "lucide-react"
import Image from "next/image"

export default function InstagramPage() {
  const [isLiked, setIsLiked] = useState(false)

  const stories = [
    { id: 1, username: "sejin.kr", image: "/placeholder.svg" },
    { id: 2, username: "imfinetha...", image: "/placeholder.svg" },
    { id: 3, username: "hyunsom_", image: "/placeholder.svg" },
    { id: 4, username: "9.75_hj", image: "/placeholder.svg" },
    { id: 5, username: "fitvely_m...", image: "/placeholder.svg" },
    { id: 6, username: "un_expec...", image: "/placeholder.svg" },
    { id: 7, username: "dubbing...", image: "/placeholder.svg" },
    { id: 8, username: "dldk/hd", image: "/placeholder.svg" },
  ]

  const suggestedUsers = [
    { id: 1, username: "kim_gleam", name: "김태욱", image: "/placeholder.svg" },
    { id: 2, username: "_xn_bunxs", status: "k_light_h님 외 4명이 팔로우합니다", image: "/placeholder.svg" },
    { id: 3, username: "1nesus", status: "mew_531님이 팔로우합니다", image: "/placeholder.svg" },
    { id: 4, username: "dongh__k_im", status: "donghw15님이 팔로우합니다", image: "/placeholder.svg" },
    { id: 5, username: "leehoyeOn", status: "회원님을 위한 추천", image: "/placeholder.svg" },
  ]

  return (
      <div className="min-h-screen bg-black text-white">
        {/* Left Sidebar */}
        <nav className="fixed left-0 top-0 h-full w-[245px] border-r border-gray-800 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Instagram</h1>
          </div>

          <div className="space-y-2">
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <Home size={24} />
              <span>홈</span>
            </button>
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <Search size={24} />
              <span>검색</span>
            </button>
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <Film size={24} />
              <span>릴스</span>
            </button>
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <MessageCircle size={24} />
              <span>메시지</span>
            </button>
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <Heart size={24} />
              <span>알림</span>
            </button>
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <PlusSquare size={24} />
              <span>만들기</span>
            </button>
            <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg">
              <Image src="/placeholder.svg" alt="Profile" width={24} height={24} className="rounded-full" />
              <span>프로필</span>
            </button>
          </div>

          <button className="flex items-center space-x-4 p-3 w-full hover:bg-gray-900 rounded-lg mt-auto absolute bottom-4">
            <Menu size={24} />
            <span>더 보기</span>
          </button>
        </nav>

        {/* Main Content */}
        <main className="ml-[245px] mr-[320px] p-8">
          {/* Stories */}
          <div className="flex justify-center space-x-4 mb-8 overflow-x-auto">
            {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-purple-500 p-0.5">
                    <Image
                        src={story.image || "/placeholder.svg"}
                        alt={story.username}
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                  </div>
                  <span className="text-xs mt-1 text-gray-400">{story.username}</span>
                </div>
            ))}
          </div>

          {/* Post */}
          <div className="max-w-[470px] mx-auto border border-gray-800 rounded-lg mb-6">
            {/* Post Header */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <Image src="/placeholder.svg" alt="Profile" width={32} height={32} className="rounded-full" />
                <div>
                  <span className="font-semibold">dopamine.gaezuk</span>
                  <span className="text-gray-400 text-sm ml-2">• 1시간</span>
                </div>
              </div>
              <button>
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Post Image */}
            <div className="relative aspect-square">
              <Image src="/placeholder.svg" alt="Post" fill className="object-cover" />
            </div>

            {/* Post Actions */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-4">
                  <button onClick={() => setIsLiked(!isLiked)}>
                    <Heart size={24} fill={isLiked ? "#ff0000" : "none"} color={isLiked ? "#ff0000" : "white"} />
                  </button>
                  <button>
                    <MessageCircle size={24} />
                  </button>
                  <button>
                    <Send size={24} />
                  </button>
                </div>
                <button>
                  <Bookmark size={24} />
                </button>
              </div>
              <div className="text-sm">
                <p className="font-semibold">좋아요 86개</p>
                <p>
                  <span className="font-semibold">dopamine.gaezuk</span> 작성자의 레전드 녹취이유
                </p>
                <p className="text-gray-400">댓글 4개 모두 보기</p>
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="fixed right-0 top-0 w-[320px] p-6 border-l border-gray-800 h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Image src="/placeholder.svg" alt="Profile" width={56} height={56} className="rounded-full" />
              <div>
                <p className="font-semibold">kim_gleam</p>
                <p className="text-gray-400">김태욱</p>
              </div>
            </div>
            <button className="text-blue-500 text-sm font-semibold">전환</button>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 font-semibold">회원님을 위한 추천</span>
              <button className="text-sm font-semibold">모두 보기</button>
            </div>

            {suggestedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.username}
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-sm">{user.username}</p>
                      <p className="text-gray-400 text-xs">{user.status || user.name}</p>
                    </div>
                  </div>
                  <button className="text-blue-500 text-xs font-semibold">팔로우</button>
                </div>
            ))}
          </div>

          <div className="mt-8 text-xs text-gray-400">
            <p>© 2025 INSTAGRAM FROM META</p>
          </div>
        </aside>
      </div>
  )
}

