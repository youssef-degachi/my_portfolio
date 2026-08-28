import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'

// component
import Nav from './Nav'
import MobileNav from './MobileNav'

const WHATSAPP_URL = "https://wa.me/21650702320"

const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* //& logo */}
        <Link to="/">
          <h1 className="text-4xl font-semibold" >
            Youssef <span className="text-accent-default">.</span>
            </h1>
        </Link>
        {/* //^ Desktop nav & hire me button*/}
        <div className="hidden xl:flex  items-center gap-8">
          <Nav />
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button>Hire me</Button>
          </a>
        </div>
        {/* //^ mobile nav*/}
        <div className="xl:hidden">
          <MobileNav/>
        </div>

      </div>
    </header>
  )
}

export default Header
