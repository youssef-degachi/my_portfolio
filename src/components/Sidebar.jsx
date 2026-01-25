import React from 'react'
import {
  HiHome,
  HiUser,
  HiViewGrid,
  HiCollection,
  HiChatAlt,
  HiMail
} from 'react-icons/hi'
import { Link } from 'react-router-dom'

// Data for navigation
export const navData = [
  { name: 'home', path: '/', icon: <HiHome /> },
  { name: 'about', path: '/about', icon: <HiUser /> },
  { name: 'services', path: '/services', icon: <HiCollection /> },
  { name: 'work', path: '/work', icon: <HiViewGrid /> },
  {
    name: 'testimonials',
    path: '/testimonials',
    icon: <HiChatAlt />,
  },
  {
    name: 'contact',
    path: '/contact',
    icon: <HiMail />,
  },
]

const Sidebar = () => {
  return (
    <div>
      {/* Render links based on navData */}
      {navData.map((link, index) => (
        <Link to={link.path} key={index} className="sidebar-link">
          {link.icon}
          <span>{link.name}</span>
        </Link>
      ))}
    </div>
  )
}

export default Sidebar
