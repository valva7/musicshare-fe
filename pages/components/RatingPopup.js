"use client"

import { useState, useEffect } from "react"
import { Star } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function RatingPopup({ isOpen, onClose, onRatingConfirm, initialRating = 0 }) {
  const [rating, setRating] = useState(initialRating)
  const [hoveredRating, setHoveredRating] = useState(0)

  useEffect(() => {
    if (isOpen) {
      // 팝업이 열릴 때 초기 별점 설정
      setRating(initialRating)
    }
  }, [isOpen, initialRating])

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating)
  }

  const handleStarHover = (hoveredRating) => {
    setHoveredRating(hoveredRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const handleConfirm = () => {
    onRatingConfirm(rating)
    onClose()
  }

  if (!isOpen) return null

  return (
      <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={onClose}
        >
          <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-black rounded-xl p-8 w-full max-w-sm flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
          >
            {/* 선택된 별점 숫자 표시 */}
            <motion.div
                key={rating}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white text-7xl font-bold mb-6"
            >
              {hoveredRating > 0 ? hoveredRating : rating}
            </motion.div>

            {/* 별점 선택 영역 */}
            <div className="flex space-x-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                  <button
                      key={star}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => handleStarHover(star)}
                      onMouseLeave={handleStarLeave}
                      className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                        size={40}
                        fill={(hoveredRating > 0 ? hoveredRating >= star : rating >= star) ? "#8B5CF6" : "transparent"}
                        color={(hoveredRating > 0 ? hoveredRating >= star : rating >= star) ? "#8B5CF6" : "#666"}
                        className="transition-colors"
                    />
                  </button>
              ))}
            </div>

            <p className="text-white text-lg mb-8">별점을 선택해 주세요.</p>

            {/* 확인 버튼 */}
            <button
                onClick={handleConfirm}
                className="bg-white text-black font-medium rounded-full py-3 px-8 w-full text-lg hover:bg-gray-100 transition-colors"
            >
              확인
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
  )
}