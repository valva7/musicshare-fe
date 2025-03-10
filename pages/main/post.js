"use client"

import { useState } from "react"
import {
  Home,
  Search,
  Compass,
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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const stories = [
    { id: 1, username: "sunzzang...", image: "/placeholder.svg" },
    { id: 2, username: "sejin.kr", image: "/placeholder.svg" },
    { id: 3, username: "imfinetha...", image: "/placeholder.svg" },
    { id: 4, username: "hyunsom__", image: "/placeholder.svg" },
    { id: 5, username: "fitvely_m...", image: "/placeholder.svg" },
    { id: 6, username: "food2alley", image: "/placeholder.svg" },
    { id: 7, username: "tukmedia_", image: "/placeholder.svg" },
    { id: 8, username: "dopamine...", image: "/placeholder.svg" },
  ]

  const slides = ["세계에서 가장\n고립된 장소에서\n발견된 것", "두 번째 슬라이드", "세 번째 슬라이드"]

  return (
      <div className="min-h-screen bg-gray-900 flex justify-center">
        <div className="w-full max-w-[576px] bg-black text-white flex relative overflow-hidden rounded-xl shadow-2xl">
          {/* Left Navigation Bar */}
          <nav className="w-[73px] h-full border-gray-800 flex flex-col items-center py-8">
            <div className="mb-8">
              <svg aria-label="Instagram" className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                <path d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064M12 1c-2.987 0-3.362.013-4.535.066a8.074 8.074 0 0 0-2.67.511 5.392 5.392 0 0 0-1.949 1.27 5.392 5.392 0 0 0-1.269 1.948 8.074 8.074 0 0 0-.51 2.67C1.012 8.638 1 9.013 1 12s.013 3.362.066 4.535a8.074 8.074 0 0 0 .511 2.67 5.392 5.392 0 0 0 1.27 1.949 5.392 5.392 0 0 0 1.948 1.269 8.074 8.074 0 0 0 2.67.51C8.638 22.988 9.013 23 12 23s3.362-.013 4.535-.066a8.074 8.074 0 0 0 2.67-.511 5.625 5.625 0 0 0 3.218-3.218 8.074 8.074 0 0 0 .51-2.67C22.988 15.362 23 14.987 23 12s-.013-3.362-.066-4.535a8.074 8.074 0 0 0-.511-2.67 5.392 5.392 0 0 0-1.27-1.949 5.392 5.392 0 0 0-1.948-1.269 8.074 8.074 0 0 0-2.67-.51C15.362 1.012 14.987 1 12 1Zm0 5.351A5.649 5.649 0 1 0 17.649 12 5.649 5.649 0 0 0 12 6.351Zm0 9.316A3.667 3.667 0 1 1 15.667 12 3.667 3.667 0 0 1 12 15.667Zm5.872-10.859a1.32 1.32 0 1 0 1.32 1.32 1.32 1.32 0 0 0-1.32-1.32Z" />
              </svg>
            </div>
            <div className="space-y-6">
              <button className="p-3">
                <Home className="w-6 h-6" />
              </button>
              <button className="p-3">
                <Search className="w-6 h-6" />
              </button>
              <button className="p-3">
                <Compass className="w-6 h-6" />
              </button>
              <button className="p-3">
                <Film className="w-6 h-6" />
              </button>
              <button className="p-3">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="p-3">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3">
                <PlusSquare className="w-6 h-6" />
              </button>
              <button className="p-3">
                <Image src="/placeholder.svg" alt="Profile" width={24} height={24} className="rounded-full" />
              </button>
            </div>
            <button className="mt-auto p-3">
              <Menu className="w-6 h-6" />
            </button>
          </nav>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {/* Stories */}
            <div className="flex space-x-4 p-4 overflow-x-auto">
              {stories.map((story) => (
                  <div key={story.id} className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-purple-600">
                      <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                        <Image
                            src={story.image || "/placeholder.svg"}
                            alt={story.username}
                            width={64}
                            height={64}
                            className="rounded-full"
                        />
                      </div>
                    </div>
                    <span className="text-xs mt-1 text-gray-400">{story.username}</span>
                  </div>
              ))}
            </div>

            {/* Post */}
            <article className="border-gray-800">
              {/* Post Header */}
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold">hel_p_me_plz_</span>
                  <span className="text-gray-400">• 7분</span>
                </div>
                <button>
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>

              {/* Post Content */}
              <div className="relative aspect-square bg-black flex items-center justify-center">
                <div className="text-center text-4xl font-bold whitespace-pre-line">{slides[currentSlide]}</div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {slides.map((_, index) => (
                      <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-gray-600"}`}
                      />
                  ))}
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <button onClick={() => setIsLiked(!isLiked)}>
                      <Heart
                          className="w-6 h-6"
                          fill={isLiked ? "#ff0000" : "none"}
                          color={isLiked ? "#ff0000" : "white"}
                      />
                    </button>
                    <button>
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button>
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                  <button>
                    <Bookmark className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  <p className="font-semibold">좋아요 27개</p>
                  <p>
                    <span className="font-semibold">hel_p_me_plz_</span> 메일 공포썰 올릴 필요욕 박아주세요.
                  </p>
                  <button className="text-gray-400 text-sm">댓글 달기...</button>
                </div>
              </div>
            </article>
          </main>
        </div>
      </div>
  )
}

