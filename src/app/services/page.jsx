"use client"
import { BsArrowDownRight } from "react-icons/bs";
import Link from "next/link";
// import { createContext } from 'react';

const services = [
  {
    num: '01',
    title: 'Web Development',
    description: "Building responsive and user-friendly websites using modern technologies like React and Node.js.",
    href: "/contact",
  },
  {
    num: '02',
    title: 'UI/UX Design',
    description: "Crafting intuitive interfaces and engaging user experiences tailored to your audience.",
    href: "/contact",
  },
  {
    num: '03',
    title: 'Logo Design',
    description: "Creating memorable logos that reflect your brand's identity and values.",
    href: "/contact",
  },
  {
    num: '04',
    title: 'SEO',
    description: "Optimizing your website to improve visibility and rank higher in search engine results.",
    href: "/contact",
  },
];
import { motion } from "framer-motion";


const Services = () => {
  return  ( 
  <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
      <div  className="container mx-auto">
        <motion.div 
          initial={{opacity:0}} 
          animate={{
          opacity:1,
          transition:{ delay:1.4, duration : 0.4, ease: "easeIn"},
        }} 
          className="grid grid-cols-1 md:grid-cols-2 gap-[60px] "
        >
          {services.map((service, index) =>{
            return (
              <div key={index} className="flex-1 flex flex-col justify-center gap-6 group ">
                {/* top */}
                <div className="w-full flex justify-between items-center">
                  <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover transition-all duration-500">{service.num}</div>
                  <Link href={service.href} className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent-default transition-all duration-500 flex justify-center items-center hover:-rotate-45 ">
                  {/* <Link href={service.href}> */}
                    <BsArrowDownRight  className="text-primary text-3xl"/>
                  </Link>
                </div>
                  {/* title */}
                <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent-default transition-all duration-500">{service.title}</h2>
                {/* description */}
                <p className="text-white/60">{service.description}</p>
                {/* border */}
                <div className="border-b border-white/20 w-full"></div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Services