"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import Link from "next/link"

const menuItems = [
  {
    title: "AI 검색",
    icon: <Search className="w-5 h-5" />,
    submenu: ["검색", "숏폼", "루프", "플레이리스트", "공모전 수상곡"],
  },
  {
    title: "음악",
    submenu: ["검색", "게임", "카툰", "전체보기"],
  },
  {
    title: "효과음",
    submenu: ["게임", "카툰", "전체보기"],
  },
  {
    title: "무료",
    submenu: ["배민음악", "전체보기"],
  },
  {
    title: "special에디션",
    isSpecial: true,
    submenu: ["변신섭", "갓대급", "이채빈", "더보이즈(THE BOYZ)", "전체보기"],
  },
  {
    title: "이벤트",
    submenu: ["봉어빵", "이벤트목록"],
  },
]

export default function MegaNav() {
  const [activeMenu, setActiveMenu] = useState(null)

  return (
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Main Navigation */}
          <div className="flex justify-between">
            <div className="flex-1 flex">
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

                    {/* Mega Menu Dropdown */}
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

          {/* Mega Menu Overlay */}
          {activeMenu !== null && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setActiveMenu(null)} />
          )}
        </div>
      </nav>
  )
}

