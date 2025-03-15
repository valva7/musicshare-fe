"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Download, Share2, Bookmark, MessageSquare, X,  Send, Smile, ImageIcon, AtSign, Heart } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function MusicPlayer() {
  // 상태 관리 부분 수정
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null) // 현재 재생 중인 트랙 정보
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerBarVisible, setPlayerBarVisible] = useState(false) // 플레이어 바 표시 여부
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [currentCommentIndex, setCurrentCommentIndex] = useState(0)
  const [showComments, setShowComments] = useState(true)
  const commentIntervalRef = useRef(null)
  const [accessToken, setAccessToken] = useState(null)

  // 상태 관리 부분에 댓글 작성 모달 관련 상태 추가
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [selectedTrackForComment, setSelectedTrackForComment] = useState(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [allComments, setAllComments] = useState(false)

  // 이모지 선택 옵션
  const emojiOptions = ["👍", "❤️", "🔥", "👏", "🎵", "🎧", "✨", "😊", "🥰", "😎"]

  const tracks = [
    {
      id: 1,
      title: "SoundHelix Song 7",
      artist: "SoundHelix Song 7",
      duration: "07:00",
      tags: ["일렉트로닉"],
      image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      audioSrc: "https://musicfile-bucket.s3.ap-southeast-2.amazonaws.com//62d3c868-59fd-4395-bd26-61e62375fc4d_SoundHelix-Song-1.mp3",
    },
    {
      id: 2,
      title: "SoundHelix Song 8",
      artist: "SoundHelix Song 8",
      duration: "05:25",
      tags: ["일렉트로닉"],
      image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      audioSrc: "https://musicfile-bucket.s3.ap-southeast-2.amazonaws.com//62d3c868-59fd-4395-bd26-61e62375fc4d_SoundHelix-Song-1.mp3",
    }
  ]

  // 샘플 댓글 데이터
  const sampleComments = {
    1: [
      { id: 1, user: "음악좋아", text: "귀엽고 신나는 곡이네요!"},
      { id: 2, user: "멜로디", text: "이런 분위기 좋아요~"},
      { id: 3, user: "비트메이커", text: "BPM이 딱 좋습니다"},
    ],
    2: [
      { id: 1, user: "재잘재잘", text: "경쾌한 리듬이 매력적!"},
      { id: 2, user: "음악여행", text: "신디사이저 소리가 예술이에요"},
      { id: 3, user: "작곡가", text: "인디음악의 진수!"},
    ]
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // 트랙 재생 함수 수정
  const handlePlayPause = (trackId) => {
    const selectedTrack = tracks.find((track) => track.id === trackId)

    if (currentTrackId === trackId && isPlaying) {
      // 현재 재생 중인 트랙을 다시 클릭하면 일시정지
      audioRef.current.pause()
      setIsPlaying(false)
      // 일시정지 상태에서도 현재 시간 유지
    } else {
      // 다른 트랙을 클릭하거나 일시정지된 트랙을 다시 재생
      if (currentTrackId !== trackId) {
        // 트랙이 변경되면 오디오 소스 변경
        audioRef.current.src = selectedTrack.audioSrc
        audioRef.current.load()
        setCurrentTime(0) // 새 트랙은 처음부터 시작
        setCurrentCommentIndex(0) // 댓글 인덱스 초기화
      }

      audioRef.current.play()
      setIsPlaying(true)
      setCurrentTrackId(trackId)
      setCurrentTrack(selectedTrack) // 현재 트랙 정보 설정
      setPlayerBarVisible(true) // 플레이어 바 표시
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleProgressClick = (e, isMainPlayer = true) => {
    if (!currentTrackId) return // 선택된 트랙이 없으면 무시

    const progressBar = isMainPlayer ? progressRef.current : e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newTime = clickPosition * audioRef.current.duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  // 트랙별 진행 상태 계산 - 수정됨
  const getTrackProgress = (trackId) => {
    if (currentTrackId !== trackId) return 0
    // 재생 중이 아니더라도 현재 트랙의 진행 상태 반환
    return (currentTime / duration) * 100
  }

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setAccessToken(token)
  })

  // 댓글 순환 효과
  useEffect(() => {
    if (isPlaying && currentTrackId && showComments) {
      // 이전 인터벌 클리어
      if (commentIntervalRef.current) {
        clearInterval(commentIntervalRef.current)
      }

      // 새로운 인터벌 설정
      commentIntervalRef.current = setInterval(() => {
        setCurrentCommentIndex((prevIndex) => {
          const comments = sampleComments[currentTrackId]
          return comments ? (prevIndex + 1) % comments.length : 0
        })
      }, 3000) // 3초마다 댓글 변경
    }

    return () => {
      if (commentIntervalRef.current) {
        clearInterval(commentIntervalRef.current)
      }
    }
  }, [isPlaying, currentTrackId, showComments])

  // 현재 트랙의 댓글 가져오기
  const getCurrentComments = () => {
    return currentTrackId ? sampleComments[currentTrackId] || [] : []
  }

  // 현재 표시할 댓글
  const currentComment = getCurrentComments()[currentCommentIndex]

  // 이모지 추가 핸들러
  const addEmoji = (emoji) => {
    setCommentText((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[#4AFF8C]"></div>
              <h1 className="text-lg">다운로드 순으로 자동 집계될 예정 ㅎㅎ</h1>
            </div>
            <h2 className="text-6xl font-bold mb-8">
              <span className="text-[#4AFF8C]">HOT</span> 10
            </h2>
            <div className="flex gap-4">
              <span className="px-4 py-2 rounded-full border border-[#4AFF8C] text-[#4AFF8C]">3월 2주차 (개발중)</span>
              <span className="px-4 py-2">장르별 (개발 예정)</span>
              <span className="px-4 py-2">월간 BGM (개발 예정)</span>
            </div>
          </div>

          {/* Track List */}
          <div className="space-y-4">
            {tracks.map((track, index) => (
                <div key={track.id} className="group bg-[#242424] hover:bg-[#2A2A2A] rounded-lg p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-[#4AFF8C] text-2xl font-medium w-8">{index + 1}</span>
                    <Image
                        src={track.image || "/placeholder.svg"}
                        alt={track.title}
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <button
                            className="w-10 h-10 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black"
                            onClick={() => handlePlayPause(track.id)}
                        >
                          {isPlaying && currentTrackId === track.id ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-sm text-gray-400">{track.artist}</p>
                        </div>
                      </div>

                      {/* 트랙별 재생 바 */}
                      <div className="mt-4 mb-2">
                        <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {currentTrackId === track.id ? formatTime(currentTime) : "00:00"}
                      </span>
                          <div
                              className="flex-1 h-1 bg-[#333] rounded-full cursor-pointer"
                              onClick={(e) => currentTrackId === track.id && handleProgressClick(e, false)}
                          >
                            <div
                                className="h-full bg-[#4AFF8C] rounded-full"
                                style={{ width: `${getTrackProgress(track.id)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{track.duration}</span>
                        </div>
                      </div>

                      {/* 태그 */}
                      <div className="flex items-center gap-2 mt-2">
                        {track.tags.map((tag, i) => (
                            <span key={i} className="text-xs text-gray-400">
                        #{tag}
                      </span>
                        ))}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {accessToken ? (
                        <>
                          <button className="p-2 hover:text-[#4AFF8C]">
                            <Bookmark size={20} />
                          </button>
                          <button className="p-2 hover:text-[#4AFF8C]">
                            <Download size={20} />
                          </button>
                          <button className="p-2 hover:text-[#4AFF8C]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedTrackForComment(track.id)
                              setIsCommentModalOpen(true)
                            }}>
                            <MessageSquare size={20} />
                          </button>
                        </>
                        ) : null
                      }
                    </div>
                    <span className="text-sm text-gray-400 w-16 text-right">{track.duration}</span>
                  </div>

                  {/* 트랙 아이템 닫는 div 바로 위에 추가 */}
                  {isPlaying && currentTrackId === track.id && showComments && (
                      <div className="mt-4 pl-20">
                        <AnimatePresence mode="wait">
                          {currentComment && (
                              <motion.div
                                  key={currentComment.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-[#333] rounded-lg p-3"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span className="text-[#4AFF8C] font-medium">{currentComment.user}</span>
                                    <p className="text-sm text-gray-300 mt-1">{currentComment.text}</p>
                                  </div>
                                </div>
                              </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                  )}
                </div>
            ))}
          </div>
        </div>

        {/* Fixed Player Bar */}
        {playerBarVisible && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#242424] border-t border-[#333] p-4">
              <div className="max-w-6xl mx-auto flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <SkipBack size={20} />
                  </button>
                  <button
                      className="w-10 h-10 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black"
                      onClick={() => currentTrackId && handlePlayPause(currentTrackId)}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="p-2 hover:text-[#4AFF8C]">
                    <SkipForward size={20} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{formatTime(currentTime)}</span>
                    <div
                        ref={progressRef}
                        className="flex-1 h-1 bg-[#333] rounded-full cursor-pointer"
                        onClick={(e) => handleProgressClick(e)}
                    >
                      <div
                          className="h-full bg-[#4AFF8C] rounded-full"
                          style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{formatTime(duration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{currentTrack?.title || "선택된 트랙 없음"}</h4>
                    <span className="text-sm text-gray-400">by {currentTrack?.artist || ""}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {accessToken ? (
                  <>
                    <button className="p-2 hover:text-[#4AFF8C]">
                      <Bookmark size={20} />
                    </button>
                    <button className="p-2 hover:text-[#4AFF8C]">
                      <Share2 size={20} />
                    </button>
                  </>
                    ) : null
                  }
                  <button className="p-2 hover:text-[#4AFF8C]" onClick={() => setPlayerBarVisible(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* 오디오 요소 */}
        <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => setDuration(audioRef.current.duration)}
            onEnded={() => setIsPlaying(false)}
            src={currentTrack?.audioSrc || null}
        >
          브라우저가 오디오 태그를 지원하지 않습니다.
        </audio>

        {/* 댓글 작성 모달 */}
        <AnimatePresence>
          {isCommentModalOpen && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50"
                  onClick={() => setIsCommentModalOpen(false)}
              >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-xl w-full max-w-lg p-6 shadow-2xl border border-[#333] relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                  {/* 네온 효과 */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#4AFF8C] opacity-20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#4AFF8C] opacity-10 rounded-full blur-3xl"></div>

                  {/* 헤더 */}
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                      <h3 className="text-2xl font-bold text-white">댓글 작성</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {tracks.find((t) => t.id === selectedTrackForComment)?.title || ""}
                      </p>
                    </div>
                    <button
                        onClick={() => setIsCommentModalOpen(false)}
                        className="text-gray-400 hover:text-white bg-[#333] hover:bg-[#444] p-2 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* 트랙 정보 */}
                  <div className="flex items-center gap-4 p-4 bg-[#333] rounded-lg mb-6 relative z-10">
                    <Image
                        src={tracks.find((t) => t.id === selectedTrackForComment)?.image || "/placeholder.svg"}
                        alt="Track"
                        width={60}
                        height={60}
                        className="rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-white">
                        {tracks.find((t) => t.id === selectedTrackForComment)?.title || ""}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {tracks.find((t) => t.id === selectedTrackForComment)?.artist || ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#4AFF8C]">
                      {tracks.find((t) => t.id === selectedTrackForComment)?.duration || ""}
                    </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                      {sampleComments[selectedTrackForComment]?.length || 0} 댓글
                    </span>
                      </div>
                    </div>
                  </div>

                  {/* 댓글 목록 */}
                  {selectedTrackForComment && sampleComments[selectedTrackForComment] && (
                      <div className="mb-6 max-h-[200px] overflow-y-auto custom-scrollbar relative z-10">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-300">최근 댓글</h4>
                          <button
                              className="text-xs text-[#4AFF8C] hover:underline"
                              onClick={() => setAllComments(!allComments)}
                          >
                            {allComments ? "접기" : "모두 보기"}
                          </button>
                        </div>

                        {(allComments
                                ? sampleComments[selectedTrackForComment]
                                : sampleComments[selectedTrackForComment].slice(0, 2)
                        ).map((comment) => (
                            <div key={comment.id} className="bg-[#2A2A2A] rounded-lg p-3 mb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center text-[#4AFF8C]">
                                    {comment.user.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[#4AFF8C] font-medium">{comment.user}</span>
                                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#4AFF8C]">
                                        <Heart size={12} />
                                        <span>{comment.likes}</span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}

                  {/* 댓글 입력 */}
                  <div className="relative z-10">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black font-bold">
                        U
                      </div>
                      <div className="flex-1">
                        <div className="relative">
                      <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="댓글을 입력하세요..."
                          className="w-full p-4 bg-[#333] border border-[#444] rounded-lg text-white focus:outline-none focus:border-[#4AFF8C] focus:ring-1 focus:ring-[#4AFF8C] min-h-[100px] pr-24 resize-none transition-all"
                      />
                          <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <div className="relative">
                              <button
                                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                  className="p-2 text-gray-400 hover:text-[#4AFF8C] bg-[#2A2A2A] rounded-full"
                              >
                                <Smile size={18} />
                              </button>

                              {/* 이모지 선택기 */}
                              {showEmojiPicker && (
                                  <div className="absolute bottom-full right-0 mb-2 bg-[#2A2A2A] border border-[#444] rounded-lg p-2 shadow-xl">
                                    <div className="grid grid-cols-5 gap-2">
                                      {emojiOptions.map((emoji, index) => (
                                          <button
                                              key={index}
                                              onClick={() => addEmoji(emoji)}
                                              className="w-8 h-8 flex items-center justify-center hover:bg-[#333] rounded-md text-lg"
                                          >
                                            {emoji}
                                          </button>
                                      ))}
                                    </div>
                                  </div>
                              )}
                            </div>
                            <button className="p-2 text-gray-400 hover:text-[#4AFF8C] bg-[#2A2A2A] rounded-full">
                              <ImageIcon size={18} />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-[#4AFF8C] bg-[#2A2A2A] rounded-full">
                              <AtSign size={18} />
                            </button>
                          </div>

                          {/* 글자 수 카운터 */}
                          <div className="absolute bottom-3 left-3 text-xs text-gray-500">{commentText.length}/300</div>
                        </div>
                      </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex justify-end space-x-3 mt-4 relative z-10">
                      <button
                          onClick={() => setIsCommentModalOpen(false)}
                          className="px-4 py-2 border border-[#444] rounded-lg text-white hover:bg-[#333] transition-colors"
                      >
                        취소
                      </button>
                      <button
                          onClick={() => {
                            // 댓글 추가 로직
                            if (commentText.trim() && selectedTrackForComment) {
                              // 실제 구현에서는 API 호출 등으로 댓글 저장
                              const newComment = {
                                id: Date.now(),
                                user: "사용자",
                                text: commentText,
                                timestamp: formatTime(currentTime),
                                likes: 0,
                              }

                              // 샘플 댓글에 추가 (실제 구현에서는 상태 업데이트 또는 API 호출)
                              console.log("새 댓글:", newComment)

                              // 모달 닫기 및 상태 초기화
                              setCommentText("")
                              setIsCommentModalOpen(false)

                              // 댓글 작성 후 댓글 표시 활성화
                              setShowComments(true)
                            }
                          }}
                          className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                              commentText.trim()
                                  ? "bg-gradient-to-r from-[#4AFF8C] to-[#3de07d] text-black hover:from-[#3de07d] hover:to-[#32c06a]"
                                  : "bg-[#333] text-gray-500 cursor-not-allowed"
                          } transition-all shadow-lg ${commentText.trim() ? "shadow-[#4AFF8C]/20" : ""}`}
                          disabled={!commentText.trim()}
                      >
                        <Send size={18} />
                        댓글 등록
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>

      </div>
  )
}

