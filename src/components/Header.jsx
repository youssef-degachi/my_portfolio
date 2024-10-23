import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'

// component
import Nav from './Nav'
import MobileNav from './MobileNav'
import Sidebar from './Sidebar'



const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-white">
      <div className="container mx-auto flex justify-between items-center">
        {/* //& logo */}
        <Link href="/">
          <h1 className="text-4xl font-semibold" >
            Youssef <span className="text-accent-default">.</span>
            </h1>
        </Link>
        {/* //^ Desktop nav & hire me button*/}
        <div className="hidden xl:flex  items-center gap-8">
          <Nav />
          {/* <Button> Hire me </Button> */}
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