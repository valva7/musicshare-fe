"use client"

import { useEffect, useRef, useState } from "react"
import {
  AtSign,
  Bookmark,
  Download,
  Heart,
  ImageIcon,
  MessageSquare,
  Pause,
  Play,
  Send,
  Share2,
  SkipBack,
  SkipForward,
  Smile,
  Volume2,
  X,
} from "lucide-react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import {
  getWithAuthFetch,
  postWithAuthFetch,
  getWithAuthAndParamsFetch,
  getWithoutAuthFetch
} from "@/pages/common/fetch"

// 이모지 선택 옵션
const emojiOptions = ["👍", "❤️", "🔥", "👏", "🎵", "🎧", "✨", "😊", "🥰", "😎"]

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

  // Tracks
  const [musicTracks, setMusicTracks] = useState([])
  // Comments
  const [trackComments, setTrackComments] = useState({})
  const [isLoadingComments, setIsLoadingComments] = useState(false)

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // 트랙 재생 함수 (재생 시 댓글 로드 추가)
  const handlePlayPause = async (trackId) => {
    const selectedTrack = musicTracks.find((track) => track.musicId === trackId)

    if (currentTrackId === trackId && isPlaying) {
      // 현재 재생 중인 트랙을 다시 클릭하면 일시정지
      audioRef.current.pause()
      setIsPlaying(false)
      // 일시정지 상태에서도 현재 시간 유지
    } else {
      // 다른 트랙을 클릭하거나 일시정지된 트랙을 다시 재생
      if (currentTrackId !== trackId) {
        // 트랙이 변경되면 오디오 소스 변경
        audioRef.current.src = selectedTrack.url
        audioRef.current.load()
        setCurrentTime(0) // 새 트랙은 처음부터 시작
        setCurrentCommentIndex(0) // 댓글 인덱스 초기화

        // 새 트랙의 댓글 로드
        await loadTrackComments(trackId)
      }

      audioRef.current.play()
      setIsPlaying(true)
      setCurrentTrackId(trackId)
      setCurrentTrack(selectedTrack) // 현재 트랙 정보 설정
      setPlayerBarVisible(true) // 플레이어 바 표시
    }
  }

  // 특정 트랙의 댓글을 로드
  const loadTrackComments = async (trackId) => {
    if (!trackId) return

    try {
      setIsLoadingComments(true)
      const params = { musicId: trackId }
      const result = await getWithAuthAndParamsFetch("/comment", params)

      if (result && Array.isArray(result.value)) {
        setTrackComments((prev) => ({
          ...prev,
          [trackId]: result.value.map((comment) => ({
            id: comment.id,
            authorId: comment.authorId,
            user: comment.authorNickname,
            authorProfile: comment.authorProfile,
            text: comment.content,
            timestamp: comment.regDt,
            likes: comment.likeCount || 0,
          })),
        }))
      } else {
        // 빈 배열로 설정하여 에러 방지
        setTrackComments((prev) => ({ ...prev, [trackId]: [] }))
      }
    } catch (error) {
      console.error("댓글 로드 중 오류 발생:", error)
      setTrackComments((prev) => ({ ...prev, [trackId]: [] }))
    } finally {
      setIsLoadingComments(false)
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

  // 트랙별 진행 상태 계산
  const getTrackProgress = (trackId) => {
    if (currentTrackId !== trackId) return 0
    // 재생 중이 아니더라도 현재 트랙의 진행 상태 반환
    return (currentTime / duration) * 100
  }

  // 현재 트랙의 댓글 가져오기
  const getCurrentComments = () => {
    return currentTrackId && trackComments[currentTrackId] ? trackComments[currentTrackId] : []
  }

  // 현재 표시할 댓글
  const currentComment = getCurrentComments()[currentCommentIndex]

  // 이모지 추가 핸들러
  const addEmoji = (emoji) => {
    setCommentText((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  // 댓글 등록
  const addComment = async () => {
    if (commentText.trim() && selectedTrackForComment) {
      try {
        // 새로운 댓글 객체 생성
        const newComment = {
          musicId: selectedTrackForComment,
          content: commentText,
        }

        // 댓글 저장
        const response = await postWithAuthFetch("/comment", newComment)

        if (response && response.code === 0) {
          // 댓글 추가 성공 시 해당 트랙의 댓글 다시 로드
          await loadTrackComments(selectedTrackForComment)

          // 현재 재생 중인 트랙에 댓글을 추가한 경우 댓글 인덱스 초기화
          if (selectedTrackForComment === currentTrackId) {
            setCurrentCommentIndex(0)
          }
        }
      } catch (error) {
        console.error("댓글 추가 중 오류 발생:", error)
      }

      // 모달 닫기 및 상태 초기화
      setCommentText("")
      setIsCommentModalOpen(false)
      setShowComments(true)
    }
  }

  // 트랙 목록 로드
  useEffect(() => {
    const getTracks = async () => {
      try {
        const result = await getWithoutAuthFetch("/music/public/hot/current", {})
        if (result && result.value) {
          setMusicTracks(result.value)
        }
      } catch (error) {
        console.error("트랙 로드 중 오류 발생:", error)
      }
    }

    getTracks()
  }, [])

  // 액세스 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setAccessToken(token)
  }, [])

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
          const comments = trackComments[currentTrackId] || []
          return comments.length > 0 ? (prevIndex + 1) % comments.length : 0
        })
      }, 3000) // 3초마다 댓글 변경
    }

    return () => {
      if (commentIntervalRef.current) {
        clearInterval(commentIntervalRef.current)
      }
    }
  }, [isPlaying, currentTrackId, showComments, trackComments])

  return (
      <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-1 w-12 bg-[#4AFF8C]"></div>
              <h1 className="text-lg">좋아요 순으로 자동 집계될 예정 ㅎㅎ</h1>
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
            {musicTracks.map((track, index) => (
                <div key={track.musicId} className="group bg-[#242424] hover:bg-[#2A2A2A] rounded-lg p-4 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-[#4AFF8C] text-2xl font-medium w-8">{index + 1}</span>
                    <Image
                        src={track.profileImageUrl || "https://cdn-icons-png.flaticon.com/512/64/64572.png"}
                        alt={track.title}
                        width={48}
                        height={48}
                        className="rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <button
                            className="w-10 h-10 rounded-full bg-[#4AFF8C] flex items-center justify-center text-black"
                            onClick={() => handlePlayPause(track.musicId)}
                        >
                          {isPlaying && currentTrackId === track.musicId ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <div>
                          <h3 className="font-medium">{track.title}</h3>
                          <p className="text-sm text-gray-400">{track.nickname}</p>
                        </div>
                      </div>

                      {/* 트랙별 재생 바 */}
                      <div className="mt-4 mb-2">
                        <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {currentTrackId === track.musicId ? formatTime(currentTime) : "00:00"}
                      </span>
                          <div
                              className="flex-1 h-1 bg-[#333] rounded-full cursor-pointer"
                              onClick={(e) => currentTrackId === track.musicId && handleProgressClick(e, false)}
                          >
                            <div
                                className="h-full bg-[#4AFF8C] rounded-full"
                                style={{ width: `${getTrackProgress(track.musicId)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">{track.duration}</span>
                        </div>
                      </div>

                      {/* 태그 */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">{track.mood}</span>
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
                            <button
                                className="p-2 hover:text-[#4AFF8C]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedTrackForComment(track.musicId)
                                  setIsCommentModalOpen(true)
                                }}
                            >
                              <MessageSquare size={20} />
                            </button>
                          </>
                      ) : null}
                    </div>
                  </div>

                  {/* 트랙 아이템 닫는 div 바로 위에 추가 */}
                  {isPlaying && currentTrackId === track.musicId && showComments && (
                      <div className="mt-4 pl-20">
                        <AnimatePresence mode="wait">
                          {isLoadingComments ? (
                              <motion.div
                                  key="loading"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-[#333] rounded-lg p-3"
                              >
                                <div className="flex items-center justify-center">
                                  <div className="w-5 h-5 border-2 border-[#4AFF8C] border-t-transparent rounded-full animate-spin"></div>
                                  <span className="ml-2 text-sm text-gray-300">댓글 로딩 중...</span>
                                </div>
                              </motion.div>
                          ) : currentComment ? (
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
                          ) : (
                              <motion.div
                                  key="no-comments"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="bg-[#333] rounded-lg p-3"
                              >
                                <p className="text-sm text-gray-300">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
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
                    <span className="text-sm text-gray-400">by {currentTrack?.nickname || ""}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {accessToken ? (
                      <>
                        <button className="p-2 hover:text-[#4AFF8C]">
                          <Volume2 size={20} />
                        </button>
                        <button className="p-2 hover:text-[#4AFF8C]">
                          <Bookmark size={20} />
                        </button>
                        <button className="p-2 hover:text-[#4AFF8C]">
                          <Share2 size={20} />
                        </button>
                      </>
                  ) : null}
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
            src={currentTrack?.url || null}
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
                        {musicTracks.find((t) => t.musicId === selectedTrackForComment)?.title || ""}
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
                        src={
                            musicTracks.find((t) => t.musicId === selectedTrackForComment)?.profileImageUrl ||
                            "https://cdn-icons-png.flaticon.com/512/64/64572.png"
                        }
                        alt="Track"
                        width={60}
                        height={60}
                        className="rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-white">
                        {musicTracks.find((t) => t.musicId === selectedTrackForComment)?.title || ""}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {musicTracks.find((t) => t.musicId === selectedTrackForComment)?.nickname || ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#4AFF8C]">
                      {musicTracks.find((t) => t.musicId === selectedTrackForComment)?.duration || ""}
                    </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-400">
                      {trackComments[selectedTrackForComment]?.length || 0} 댓글
                    </span>
                      </div>
                    </div>
                  </div>

                  {/* 댓글 목록 */}
                  {selectedTrackForComment && trackComments[selectedTrackForComment] && (
                      <div className="mb-6 max-h-[200px] overflow-y-auto scrollbar-hide relative z-10">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-300">최근 댓글</h4>
                          <button
                              className="text-xs text-[#4AFF8C] hover:underline"
                              onClick={() => setAllComments(!allComments)}
                          >
                            {allComments ? "접기" : "모두 보기"}
                          </button>
                        </div>

                        {trackComments[selectedTrackForComment].length > 0 ? (
                            (allComments
                                    ? trackComments[selectedTrackForComment]
                                    : trackComments[selectedTrackForComment].slice(0, 2)
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
                                          {comment.timestamp && (
                                              <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                          )}
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
                            ))
                        ) : (
                            <div className="bg-[#2A2A2A] rounded-lg p-3 text-center">
                              <p className="text-sm text-gray-400">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
                            </div>
                        )}
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
                                  <div className="absolute top-0 right-0 transform -translate-y-[120%] bg-[#2A2A2A] border border-[#444] rounded-lg p-2 shadow-xl z-50">
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
                          onClick={addComment}
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

