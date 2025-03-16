"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { Search, Bell, Upload, Menu, X, Music, User, LogOut, Settings, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import UploadModal from "@/pages/components/UploadModal";

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeMenu, setActiveMenu] = useState(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [accessToken, setAccessToken] = useState(null)

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    setAccessToken(token)
    console.log(token);

    // const checkLogin = async () => {
    //   try {
    //     const response = await fetch("http://localhost:8080/login/check", {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //
    //     // JSON 응답을 파싱
    //     const result = await response.json();
    //
    //     console.log('로그인 체크1')
    //     console.log(result)
    //     if (result.code === 0) {
    //       console.log('로그인 체크2')
    //       setAccessToken(token)
    //     }
    //   } catch (error) {
    //   }
    // };
    //
    // checkLogin();
  }, [router.query]);


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)
  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const openUploadModal = () => {
    if (accessToken) {
      setIsUploadModalOpen(true)
    }
  }

  const closeUploadModal = () => setIsUploadModalOpen(false)

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    setAccessToken(null)
    setIsProfileOpen(false)
  }

  const menuItems = [
    {
      title: "음악",
      submenu: ["게임", "전체보기"],
    },
    {
      title: "효과음",
      submenu: ["게임","전체보기"],
    },
    {
      title: "무료",
      submenu: ["전체보기"],
    },
    {
      title: "special에디션",
      isSpecial: true,
      submenu: ["devKim의 숨은명곡"],
    },
  ]

  const themeClass = isDarkMode ? "bg-black text-white border-gray-800" : "bg-white text-black border-gray-200"

  return (
      <>
        <header className={`${themeClass} border-b transition-colors duration-300`}>
          {/* Top Header */}
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <Music className={`h-8 w-8 ${isDarkMode ? "text-white" : "text-black"}`} />
                  <span className="ml-2 text-xl font-bold">Melody & Voice</span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className={`relative w-64 ${isDarkMode ? "text-white" : "text-black"}`}>
                    <input
                        type="text"
                        placeholder="노래 또는 아티스트 검색..."
                        className={`w-full py-2 pl-10 pr-4 rounded-full ${
                            isDarkMode
                                ? "bg-gray-900 border-gray-700 focus:bg-gray-800"
                                : "bg-gray-100 border-gray-300 focus:bg-white"
                        } border focus:outline-none transition-colors`}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  </div>

                  <button
                      className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors`}
                  >
                    <Bell className="h-5 w-5" />
                  </button>

                  {accessToken && (
                      <button
                          onClick={openUploadModal}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                              isDarkMode ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                          } transition-colors`}
                      >
                        <Upload className="h-5 w-5" />
                        <span>업로드</span>
                      </button>
                  )}

                  <div className="relative">
                    <button onClick={toggleProfile} className="flex items-center space-x-2">
                      <div
                          className={`w-8 h-8 rounded-full overflow-hidden border-2 ${isDarkMode ? "border-white" : "border-black"}`}
                      >
                        <Image src="/placeholder.svg?height=32&width=32" alt="Profile" width={32} height={32} />
                      </div>
                    </button>

                    {isProfileOpen && (
                        <div
                            className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                                isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
                            }`}
                        >
                          {accessToken ? (
                              <>
                                <a href="#" className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white">
                                  <User className="mr-2 h-4 w-4" />
                                  <span>프로필</span>
                                </a>
                                <a href="#" className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white">
                                  <LogOut className="mr-2 h-4 w-4" />
                                  <span>로그아웃</span>
                                </a>
                              </>
                          ) : (
                              <a href="http://localhost:3000/login" className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 hover:text-white">
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>로그인</span>
                              </a>
                          )}
                        </div>
                    )}


                  </div>
              </div>
            </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <div className="relative mr-2">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                  <input
                      type="text"
                      placeholder="검색..."
                      className={`w-40 py-2 pl-10 pr-4 rounded-full ${
                          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300"
                      } border focus:outline-none`}
                  />
                </div>
                <button
                    onClick={toggleMenu}
                    className={`p-2 rounded-md ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"} transition-colors`}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden py-3 border-t border-gray-700">
                  <div className="space-y-1 px-2">
                    <button
                        className={`flex items-center w-full px-3 py-2 rounded-md ${
                            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                        } transition-colors`}
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      <span>알림</span>
                    </button>

                    {accessToken && (
                        <button
                            onClick={openUploadModal}
                            className={`flex items-center w-full px-3 py-2 rounded-md ${
                                isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                            } transition-colors`}
                        >
                          <Upload className="h-5 w-5 mr-3" />
                          <span>업로드</span>
                        </button>
                    )}

                    <button
                        onClick={toggleTheme}
                        className={`flex items-center w-full px-3 py-2 rounded-md ${
                            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                        } transition-colors`}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      <span>{isDarkMode ? "라이트 모드" : "다크 모드"}</span>
                    </button>

                    {accessToken ? (
                        <>
                          <a
                              href="#"
                              className={`flex items-center px-3 py-2 rounded-md ${
                                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                              } transition-colors`}
                          >
                            <User className="h-5 w-5 mr-3" />
                            <span>프로필</span>
                          </a>
                          <button
                              onClick={handleLogout}
                              className={`flex items-center w-full text-left px-3 py-2 rounded-md ${
                                  isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"
                              } transition-colors`}
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            <span>로그아웃</span>
                          </button>
                        </>
                    ) : null}
                  </div>
                </div>
            )}
          </div>

          {/* Mega Menu Navigation */}
          <nav className="border-t border-gray-800">
            <div className="container mx-auto px-4">
              <div className="flex justify-between">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className="relative group"
                        onMouseEnter={() => setActiveMenu(index)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                      <button
                          className={`px-6 py-4 text-sm transition-colors duration-200 ${
                              item.isSpecial ? "text-[#4AFF8C] hover:text-[#3de07d]" : "text-gray-300 hover:text-white"
                          }`}
                      >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </span>
                      </button>

                      {/* Dropdown Menu */}
                      <div
                          className={`absolute left-0 w-[200px] bg-black border border-gray-800 shadow-xl transition-all duration-200 ${
                              activeMenu === index ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                          }`}
                      >
                        <div className="p-4">
                          <ul className="space-y-2">
                            {item.submenu.map((subItem, subIndex) => (
                                <li key={subIndex}>
                                  <Link
                                      href="#"
                                      className="block text-gray-400 hover:text-white transition-colors duration-200 text-sm py-1"
                                  >
                                    {subItem}
                                  </Link>
                                </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </nav>
        </header>

        {/* 업로드 모달 */}
        <UploadModal isOpen={isUploadModalOpen} onClose={closeUploadModal} />
      </>
  )
}

