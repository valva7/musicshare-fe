"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from 'next/router';
import Image from "next/image"
import { Play, Pause, Bookmark, Download, Share2, Smile, Link, X, Heart, MessageSquare } from "lucide-react"
import {
  getAccessToken,
  getWithoutAuthAndParamFetch
} from "@/pages/common/fetch"
import AudioWaveformC from "@/pages/common/AudioWaveFormC";


export default function MusicDetailPage({}) {
  const router = useRouter();
  const { id } = router.query;

  // 상태 관리
  const [music, setMusic] = useState(null)
  const [moods, setMoods] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [similarMusics, setSimilarMusics] = useState([])
  const [comments, setComments] = useState([])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  // refs
  const audioRef = useRef(null)
  const progressRef = useRef(null)

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token)
  }, [router.query]);

  useEffect(() => {
    if (!id) return;  // id가 없으면 종료

    async function loadMusicData() {
      const musicData = await getWithoutAuthAndParamFetch(`/music/public/${id}`, null);
      setMusic(musicData.value);

      const moodMap = musicData.value.mood.split(' ');
      setMoods(moodMap);

      setIsLoading(false);
    }

    loadMusicData();
  }, [id])

  // 댓글 등록
  const addComment = async () => {
    if (commentText.trim() && musicId) {
      try {
        // 새로운 댓글 객체 생성
        const newComment = {
          musicId: musicId,
          content: commentText,
        }

        // 댓글 저장
        const response = await postWithAuthFetch("/comment/auth", newComment)

        if (response && response.code === 0) {
          // 댓글 추가 성공 시 댓글 다시 로드
          await loadComments(musicId)
        }
      } catch (error) {
        console.error("댓글 추가 중 오류 발생:", error)
        // 임시로 댓글 추가 (실제 구현에서는 제거)
        setComments((prev) => [
          {
            id: Date.now().toString(),
            user: "사용자",
            text: commentText,
            timestamp: "방금 전",
            likes: 0,
          },
          ...prev,
        ])
      }

      // 상태 초기화
      setCommentText("")
    }
  }

  // 가짜 유사곡 데이터
  const similarTracks = [
    {
      id: "2",
      title: "후회(Regret)",
      artist: "(2022)",
      duration: "03:45",
      imageUrl: "/placeholder.svg?height=48&width=48",
    }
  ]

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] text-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#4AFF8C] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>트랙 정보를 불러오는 중...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-[#4a6d8c] to-black text-white">
        <div className="max-w-6xl mx-auto p-4">
          {/* 메인 플레이어 카드 */}
          <div className="bg-[#1e1e1e] rounded-xl p-6 shadow-lg mb-4">
            <div className="flex flex-col md:flex-row">
              {/* 왼쪽 섹션: 앨범 아트, 제목, 파형, 컨트롤 */}
              <div className="w-full md:w-1/2 pr-4">
                {/* 앨범 아트와 제목 */}
                <div className="flex items-start mb-6">
                  <div className="mr-4">
                    <Image
                        src={"https://cdn-icons-png.flaticon.com/512/64/64572.png" || music.profileImageUrl}
                        alt={music.title}
                        width={100}
                        height={100}
                        className="rounded-lg"
                    />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold text-white mb-1">{music.title}</h2>
                    <p className="text-xl text-gray-400">{music.nickname}</p>
                  </div>
                </div>

                {/* 오디오 파형 */}
                <div className="mb-8">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <AudioWaveformC audioUrl={music.url}/>
                    </div>
                  </div>
                </div>

                {/* 컨트롤 및 메타데이터 */}
                <div className="grid grid-cols-6 gap-4 text-center">
                  <div>
                    <p className="text-gray-400 text-sm">길이</p>
                    <p className="text-xl font-medium text-white">{music.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">BPM</p>
                    <p className="text-xl font-medium text-white">{music.bpm}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">평점</p>
                    <p className="text-xl font-medium text-white">{music.rating}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">마이앨범</p>
                    <button className="text-xl text-white cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">
                      <Bookmark size={20} className="mx-auto" />
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">다운로드</p>
                    <button className="text-xl text-white cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">
                      <Download size={20} className="mx-auto" />
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">공유하기</p>
                    <button className="text-xl text-white cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">
                      <Share2 size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 오른쪽 섹션: 음악 정보 및 유사곡 */}
              <div className="w-full md:w-1/2 mt-6 md:mt-0 md:pl-4">
                <div className="flex flex-col md:flex-row">
                  {/* 음악 정보 */}
                  <div className="w-full md:w-1/2 pr-2">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-white mb-2">음악 장르</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#333] rounded-full text-white text-sm cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">{music.genre}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-white mb-2">분위기</h3>
                      <div className="flex flex-wrap gap-2">
                        {moods.map((mood) => (
                          <span className="px-3 py-1 bg-[#333] rounded-full text-white text-sm cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">{mood}</span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-white mb-2">테마</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-[#333] rounded-full text-white text-sm cursor-pointer hover:text-[#4AFF8C] transition-colors duration-300">{music.theme}</span>
                      </div>
                    </div>
                  </div>

                  {/* 유사곡 */}
                  <div className="w-full md:w-1/2 pl-2">
                    <h3 className="text-lg font-medium text-white mb-4">유사곡</h3>
                    <div className="space-y-3">
                      {similarTracks.map((similarTrack) => (
                          <div
                              key={similarTrack.id}
                              className="flex items-center space-x-3 hover:bg-[#333] rounded-lg transition-colors cursor-pointer"
                          >
                            <Image
                                src={"https://cdn-icons-png.flaticon.com/512/64/64572.png" || similarTrack.imageUrl}
                                width={40}
                                height={40}
                                className="rounded-md"
                            />
                            <div className="flex-1">
                              <p className="text-white font-medium">{similarTrack.title}</p>
                              <p className="text-sm text-gray-400">{similarTrack.artist}</p>
                            </div>
                            <span className="text-gray-400">{similarTrack.duration}</span>
                          </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="bg-black rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">댓글</h2>

            {/* 댓글 입력 */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">에대봉</span>
                <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="댓글을 입력하세요."
                    className="flex-1 bg-transparent border-b border-gray-700 focus:border-gray-500 outline-none py-2"
                />
                <button className="ml-2 text-gray-400">
                  <Smile size={20} />
                </button>
                <button className="ml-2 text-gray-400">
                  <Link size={20} />
                </button>
              </div>
            </div>

            {/* 댓글 정렬 옵션 */}
            <div className="flex mb-6">
              <button className="text-red-500 mr-4 flex items-center">
                <span className="mr-1">▼</span> 추천순
              </button>
              <button className="text-gray-400 flex items-center">
                <span className="mr-1">▼</span> 최신순
              </button>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-xs text-gray-500 mr-2">🔄</span>
                <span className="text-xs text-gray-500">상단 고정됨 댓글</span>
              </div>

              <div className="bg-[#222] rounded-lg p-4">
                <div className="flex items-start">
                  <div className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-2">셀뮤GPT</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-300">
                      이 노래는 정말 밝고 행복한 느낌이 물씬 나는, 귀여운면서도 사랑스러운 피아노 연주가 돋보이는 뉴에이지
                      음악이에요!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 응답 버튼 */}
            <div className="absolute bottom-4 right-4">
              <div className="relative">
                <div className="absolute -top-10 right-0 bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center">
                  G
                </div>
                <button className="bg-green-500 text-white rounded-full px-4 py-2">등록</button>
              </div>
            </div>
          </div>
        </div>

        {/* 오디오 요소 */}
        <audio
            ref={audioRef}
            src={music.url || ""}
            onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
            onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
        />
      </div>
  )
}

