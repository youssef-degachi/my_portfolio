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
import { useRouter } from 'next/router'


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
      {navData.map((link,index) => {

        return <Link href={link.path} key={index}>{link.icon}</Link>//-
        // return <Link href={link.path} key={index}>{link.icon}</Link>//+
      })}
    </div>
  )
}


export default Sidebar