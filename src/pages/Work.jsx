import { motion } from "framer-motion";
import React, { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css"; // Import Swiper styles
import "swiper/css/navigation"; // Import Swiper navigation styles
import WorkSliderBtns from "@/components/WorkSliderBtns";


const projects = [
  {
    num: "01",
    category:"Design",
    title: "ControlAI Design",
    description: "Landing page for one of our clients. A modern and responsive design showcasing AI-powered solutions.",
    stack:[{name: "React.js"}, {name: "Tailwind CSS"}, {name: "Voice AI Agent"}],
    image: "/assets/work/controleAi.png",
    live:"https://controlai-design.vercel.app/",
    github:"",
  },
  {
    num: "02",
    category:"Fullstack",
    title: "Smart Blind Assistant",
    description: "An innovative application designed to support blind people with AI-powered assistance and accessibility features.",
    stack:[{name: "React.js"}, {name: "AI Integration"}, {name: "Accessibility"}],
    image: "/assets/work/eye.png",
    live:"https://smart-blind-assistant.vercel.app/home",
    github:"",
  },
  {
    num: "03",
    category:"Fullstack",
    title: "Management Store",
    description: "A comprehensive management system for store operations, built for one of our clients.",
    stack:[{name: "React.js"}, {name: "Node.js"}, {name: "Database"}, {name: "API Integration"}],
    image: "/assets/work/managment-store.png",
    live:"https://arpa-flow.vercel.app/",
    github:"",
  },
  {
    num: "04",
    category:"Fullstack",
    title: "Saudi Citizen Support",
    description: "A platform that won first place in a hackathon. Designed to provide support and services for Saudi citizens.",
    stack:[{name: "React.js"}, {name: "AI Integration"}, {name: "Backend Services"}, {name: "Arabic Support"}],
    image: "/assets/work/saudi-support.png",
    live:"https://saudi-citizen-support.vercel.app/",
    github:"",
  },
  {
    num: "05",
    category:"Fullstack",
    title: "Wedding Sales Manager",
    description: "A complete wedding sales management application for one of our clients, handling bookings, sales, and event management.",
    stack:[{name: "React.js"}, {name: "Node.js"}, {name: "Database"}, {name: "Payment Integration"}],
    image: "/assets/work/wedding-system.png",
    live:"https://najib-salles.vercel.app/",
    github:"",
  },
];

const Work = () => {
  const [project, setProject] = useState(projects[0]);

  const handleSlideChange = (swiper) => {
    //get current slide index (use realIndex when loop is enabled)
    const currentIndex = swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    //update project state based on current slide index
    setProject(projects[currentIndex]);
  };


  return (
  <motion.section
    initial={{opacity: 0 }} 
    animate={{opacity: 1, transition : {delay:1.4 ,duration:0.4, ease:"easeIn"} }}
    className=" min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
  >
    <div className="container mx-auto">
      {/* Disclaimer */}
      <div className="mb-8 text-center">
        <p className="text-white/50 text-sm italic">
          Those are not the real projects, just something like it because can't share the real project (NDA contract)
        </p>
      </div>
      <div className="flex flex-col xl:flex-row xl:gap-[30px]">
        {/* //^ data */}
        <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
                <div className="flex flex-col gap-[30px] h-[50%]">
                  {/* outline num */}
                  <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                    {project.num}
                  </div>
                  {/* project category */}
                  <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent-default transition-all duration-500 capitalize">{project.category} project</h2>
                  {/* project description */}
                  <p className="text-white/60">{project.description}</p>
                  {/* stack */}
                  <ul className="flex gap-4">
                    {project.stack.map((item,index)=>{
                      return (
                        <li key={index} className="text-xl text-accent-default">
                          {item.name}
                          {/* remove the last command */}
                          {index !== project.stack.length -1 && ","}
                        </li>
                      );
                    })} 
                  </ul>
                  {/* border */}
                  <div className="border border-white/20"></div>
                  {/* buttons */}
                  <div className="flex items-center gap-4">
                    {/* live project button */}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer">
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group cursor-pointer">
                              <BsArrowUpRight className="text-white text-3xl group-hover:text-accent-default"/>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>live project</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </a>
                    )}
                    {/* github project button */}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group cursor-pointer">
                              <BsGithub className="text-white text-3xl group-hover:text-accent-default"/>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>github repository</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </a>
                    )}
                  </div>
                </div>
        </div>
        {/* //^ animation  */}
        <div className="w-full xl:w-[50%]">
          <Swiper 
            spaceBetween={30}
            slidesPerView={1}
            modules={[Navigation]}
            className="xl:h-[520px] mb-12"
            onSlideChange={handleSlideChange}
            loop={true}
          >
            {projects.map((project,index) => {
              return <SwiperSlide key={index} className="w-full h-[460px]">
                <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20 overflow-hidden">
                  {/* overlay */}
                  <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>
                  {/* image */}
                  <img  
                    src={project.image}
                    className="object-contain w-full h-full"
                    alt={project.title}
                    />
                </div>
              </SwiperSlide>
            })}
            {/* Slider buttons */}
            <WorkSliderBtns 
              containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
              btnStyles="bg-accent-default hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all "
              />
          </Swiper>
        </div>
      </div>
    </div>
  </motion.section>
  )
}

export default Work

