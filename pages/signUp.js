"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getWithoutAuthAndParamFetch, postWithoutFetch } from "@/pages/common/fetch"
import { Music, Mail, Lock, User, Phone, CheckCircle, AlertCircle } from "lucide-react"

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    emailDomain: "",
    emailFull: "",
    password: "",
    passwordConfirm: "",
    nickname: "",
    phone: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [code, setCode] = useState("")
  const [isSent, setIsSent] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isNicknameValidated, setIsNicknameValidated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  useEffect(() => {
    if (isSent) {
      alert("인증 코드가 발송되었습니다.")
    }
  }, [isSent])

  useEffect(() => {
    if (formData.email) {
      setIsEmailVerified(false)

      const valid = /^[A-Za-z0-9]+$/.test(formData.email)
      if (!valid) {
        setErrors((prev) => ({
          ...prev,
          email: "이메일은 영문만 가능합니다",
        }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.email
          return newErrors
        })
      }
    }
  }, [formData.email])

  useEffect(() => {
    if (formData.password || formData.passwordConfirm) {
      if (formData.password !== formData.passwordConfirm) {
        setErrors((prev) => ({
          ...prev,
          passwordConfirm: "비밀번호가 일치하지 않습니다",
        }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.passwordConfirm
          return newErrors
        })
      }
    }
  }, [formData.password, formData.passwordConfirm])

  useEffect(() => {
    if (formData.nickname) {
      setIsNicknameValidated(false)
      const valid = /^[A-Za-z가-힣]+$/.test(formData.nickname)
      if (!valid) {
        setErrors((prev) => ({
          ...prev,
          nickname: "닉네임은 한글과 영문만 가능합니다",
        }))
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors.nickname
          return newErrors
        })
      }
    }
  }, [formData.nickname])

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmitNothing = (e) => {
    e.preventDefault()
  }

  const handleSendCode = async () => {
    try {
      if (formData.email === "" || formData.emailDomain === "") {
        alert("이메일을 입력해주세요.")
        return
      }

      const email = formData.email + "@" + formData.emailDomain
      const params = { email: email }
      await getWithoutAuthAndParamFetch(`/email/signUp/verify`, params)

      setIsEmailVerified(false)
      setIsSent(true)
    } catch (error) {
      console.error("인증 코드 발송 오류:", error)
    }
  }

  const verifyCode = async () => {
    try {
      const email = formData.email + "@" + formData.emailDomain
      const params = { email: email, code: code }
      const result = await getWithoutAuthAndParamFetch("/auth/verify/check", params)

      if (result.value === true) {
        setIsEmailVerified(true)
        alert("이메일 인증 성공")
      } else {
        alert("인증번호가 틀립니다.")
      }
    } catch (error) {}
  }

  const validateNickname = async () => {
    try {
      const params = { nickname: formData.nickname }
      const result = await getWithoutAuthAndParamFetch("/auth/validate/nickname", params)

      if (result.value === false) {
        setIsNicknameValidated(true)
        alert("사용 가능한 닉네임입니다.")
      } else {
        alert("이미 사용 중인 닉네임입니다.")
      }
    } catch (error) {
      console.error("닉네임 중복 확인 오류:", error)
    }
  }

  // 가입 취소
  const handleCancel = () => {
    router.push("/login")
  }

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 유효성 검사
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요"
    } else if (!/^[A-Za-z]+$/.test(formData.email)) {
      newErrors.email = "이메일은 영문만 가능합니다"
    }
    if (!formData.emailDomain) {
      newErrors.email = "이메일 도메인을 선택해주세요"
    }
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.")
      return
    }

    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요"
    } else if (formData.password.length < 8 || formData.password.length > 20) {
      newErrors.password = "비밀번호는 8-20자 사이로 입력해주세요"
    }

    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호 확인을 입력해주세요"
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다"
    }

    if (!formData.nickname) {
      newErrors.nickname = "닉네임을 입력해주세요"
    } else if (formData.nickname.length < 4 || formData.nickname.length > 20) {
      newErrors.nickname = "닉네임은 6-20자 사이로 입력해주세요"
    } else if (!/^[A-Za-z가-힣]+$/.test(formData.nickname)) {
      newErrors.nickname = "닉네임은 한글과 영문만 가능합니다"
    }
    if (!isNicknameValidated) {
      alert("닉네임 중복확인을 완료해주세요.")
      return
    }

    if (!formData.phone) {
      newErrors.phone = "휴대폰 번호를 입력해주세요"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 회원가입 처리
    setIsSubmitting(true)

    try {
      formData.emailFull = formData.email + "@" + formData.emailDomain
      const result = await postWithoutFetch("/auth/signUp", formData)
      if (result.code === 0) {
        alert("회원가입이 완료되었습니다.")
        router.push("/login")
      } else {
        alert("회원가입 중 문제가 발생했습니다.")
      }
    } catch (error) {
      console.error("회원가입 오류:", error)
      setErrors({ submit: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen bg-[#1A1A1A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#4AFF8C]/20 flex items-center justify-center mb-6">
              <Music size={32} className="text-[#4AFF8C]" />
            </div>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-white">Melody & Voice</h2>
          <p className="mt-2 text-center text-sm text-gray-400">음악을 공유하고 발견하는 최고의 플랫폼</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#242424] py-8 px-6 shadow-lg shadow-black/50 sm:rounded-lg sm:px-10 border border-gray-800">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">회원가입</h1>
              <p className="text-gray-400 mt-1">회원이 되어 다양하게 음악을 즐겨보세요!</p>
            </div>

            <form onSubmit={handleSubmitNothing} className="space-y-6">
              {/* 이메일 주소 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-[#4AFF8C]" />
                  이메일<span className="text-[#4AFF8C] ml-1">*</span>
                  {errors.email && <span className="text-red-400 text-xs ml-1">{errors.email}</span>}
                </label>
                <div className="flex items-center space-x-2">
                  {/* 이메일 입력 */}
                  <input
                      type="text"
                      name="email"
                      placeholder="예: devKim"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-1/3 rounded-md border border-gray-700 px-3 py-2 text-sm bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                  />

                  {/* @ 기호 */}
                  <span className="text-gray-400">@</span>

                  {/* 이메일 도메인 선택 */}
                  <div className="relative w-1/3">
                    <select
                        name="emailDomain"
                        value={formData.emailDomain}
                        onChange={handleChange}
                        className="appearance-none w-full rounded-md border border-gray-700 px-3 py-2 text-sm bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                    >
                      <option value="">선택하기</option>
                      <option value="naver.com">naver.com</option>
                      <option value="gmail.com">gmail.com</option>
                      <option value="daum.net">daum.net</option>
                      <option value="hanmail.net">hanmail.net</option>
                      <option value="nate.com">nate.com</option>
                      <option value="kakao.com">kakao.com</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>

                  {/* 인증 코드 받기 버튼 */}
                  <button
                      type="button"
                      className="bg-[#4AFF8C] text-black rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap cursor-pointer hover:bg-[#3de97d] transition-colors"
                      onClick={handleSendCode}
                      disabled={isEmailVerified}
                  >
                    인증 코드 받기
                  </button>
                </div>

                {/* 인증 코드 입력 필드 */}
                {isSent && !isEmailVerified && (
                    <div className="mt-3 flex space-x-2">
                      <input
                          type="text"
                          placeholder="인증 코드 입력"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="border border-gray-700 rounded-md px-3 py-2 text-sm w-2/3 bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                      />
                      <button
                          type="button"
                          onClick={verifyCode}
                          className="bg-[#4AFF8C] text-black rounded-md px-3 py-2 text-xs font-medium w-1/3 cursor-pointer hover:bg-[#3de97d] transition-colors"
                      >
                        인증하기
                      </button>
                    </div>
                )}

                {isEmailVerified && (
                    <div className="mt-2 flex items-center text-[#4AFF8C]">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <p className="text-sm font-medium">인증 완료!</p>
                    </div>
                )}
              </div>

              {/* 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-1 text-[#4AFF8C]" />
                  비밀번호 <span className="text-[#4AFF8C]">*</span>
                  <span className="text-gray-500 text-xs ml-1">20자 이내의 비밀번호를 입력해주세요</span>
                </label>
                <div className="relative">
                  <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="비밀번호 입력 (영문, 숫자, 특수문자 포함 8~20자)"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-700 px-3 py-2 text-sm bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                  <Lock className="w-4 h-4 mr-1 text-[#4AFF8C]" />
                  비밀번호 확인 <span className="text-[#4AFF8C]">*</span>
                  {errors.passwordConfirm && <span className="text-red-400 text-xs ml-1">{errors.passwordConfirm}</span>}
                </label>
                <div className="relative">
                  <input
                      type={showPasswordConfirm ? "text" : "password"}
                      name="passwordConfirm"
                      placeholder="비밀번호 재입력"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-700 px-3 py-2 text-sm bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                  />
                  <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  >
                    {showPasswordConfirm ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                          />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* 닉네임 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                  <User className="w-4 h-4 mr-1 text-[#4AFF8C]" />
                  닉네임 <span className="text-[#4AFF8C]">*</span>
                  {errors.nickname && <span className="text-red-400 text-xs ml-1">{errors.nickname}</span>}
                </label>
                <div className="flex">
                  <input
                      type="text"
                      name="nickname"
                      placeholder="닉네임 입력 (6~20자)"
                      value={formData.nickname}
                      onChange={handleChange}
                      className="flex-grow rounded-md border border-gray-700 px-3 py-2 text-sm bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                  />
                  <button
                      type="button"
                      className="ml-2 bg-[#4AFF8C] text-black rounded-md px-4 py-2 text-sm font-medium cursor-pointer hover:bg-[#3de97d] transition-colors"
                      onClick={validateNickname}
                  >
                    중복 확인
                  </button>
                </div>
                {isNicknameValidated && (
                    <div className="mt-2 flex items-center text-[#4AFF8C]">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <p className="text-sm font-medium">사용 가능한 닉네임입니다</p>
                    </div>
                )}
              </div>

              {/* 휴대폰 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-[#4AFF8C]" />
                  휴대폰<span className="text-[#4AFF8C]">*</span>
                </label>
                <input
                    type="text"
                    name="phone"
                    placeholder="숫자만 입력해주세요."
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-700 px-3 py-2 text-sm bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-[#4AFF8C] focus:border-[#4AFF8C]"
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.phone}
                    </p>
                )}
              </div>

              {/* 버튼 */}
              <div className="flex space-x-3 pt-4">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="flex-1 bg-[#4AFF8C] text-black rounded-md py-2.5 text-sm font-medium hover:bg-[#3de97d] focus:outline-none focus:ring-2 focus:ring-[#4AFF8C] focus:ring-offset-2 focus:ring-offset-[#242424] disabled:opacity-50 cursor-pointer transition-colors"
                >
                  {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                          <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                          ></circle>
                          <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        처리 중...
                      </div>
                  ) : (
                      "가입하기"
                  )}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-700 text-white rounded-md py-2.5 text-sm font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#242424] cursor-pointer transition-colors"
                >
                  가입취소
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                이미 계정이 있으신가요?{" "}
                <a href="/login" className="text-[#4AFF8C] hover:underline font-medium">
                  로그인하기
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
  )
}

