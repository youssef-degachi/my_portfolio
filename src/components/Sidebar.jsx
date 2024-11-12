import React from 'react'
import {
  HiHome,
  HiUser,
  HiViewColumns,
  HiRectangleGroup,
  HiChatBubbleBottomCenterText,
  HiEnvelope
} from 'react-icons/hi'
import Link from 'next/link'

// Data for navigation
export const navData = [
  { name: 'home', path: '/', icon: <HiHome /> },
  { name: 'about', path: '/about', icon: <HiUser /> },
  { name: 'services', path: '/services', icon: <HiRectangleGroup /> },
  { name: 'work', path: '/work', icon: <HiViewColumns /> },
  {
    name: 'testimonials',
    path: '/testimonials',
    icon: <HiChatBubbleBottomCenterText />,
  },
  {
    name: 'contact',
    path: '/contact',
    icon: <HiEnvelope />,
  },
]

const Sidebar = () => {
  return (
    <div>
      {/* Render links based on navData */}
      {navData.map((link, index) => (
        <Link href={link.path} key={index}>
          <a className="sidebar-link">
            {link.icon}
            <span>{link.name}</span>
          </a>
        </Link>
      ))}
    </div>
  )
}

export default Sidebar
