import { FaHtml5, FaCss3, FaJs, FaReact, FaFigma, FaNodeJs } from "react-icons/fa"

import { SiTailwindcss, SiNextdotjs } from "react-icons/si"

//  about
const about = {
  title: "About me",
  description: "Senior Software Engineer & Co-Founder (Andalib AI, JeridSchool) Senior Software Engineer and Co-Founder of Andalib AI and JeridSchool, with extensive experience in designing and building scalable, high-performance, and intelligent digital platforms. I thrive on exploring new technologies, continuously evolving my skill set, and tackling complex, large-scale projects from architecture to execution. Known for transforming challenging requirements into reliable, user-centric solutions, I am passionate about innovation, system design, and delivering meaningful impact within dynamic, fast-paced teams.",
  info: [
    {
      fieldName: "Name",
      fieldValue: " Youssef Degachi"
    },
    {
      fieldName: "Phone",
      fieldValue: "(+216) 50 702 320"
    },
    {
      fieldName: "Experience",
      fieldValue: "3+ Years"
    },
    {
      fieldName: "Nationality",
      fieldValue: "Tunisia"
    },
    {
      fieldName: "Freelance",
      fieldValue: "Unavailable"
    },
    {
      fieldName: "Languages",
      fieldValue: "English, Arabic"
    },
    {
      fieldName: "Email",
      fieldValue: "youssefdegachi0@gmail.com"
    },
  ]
}

// experience data

const experience = {
  icon: '/assets/resume/work.svg',
  title: 'My Experience',
  description: `I have hands-on experience in software development through my internship, where I gained practical skills in full stack development and collaborated on real-world projects.`,
  items: [
    {
      company: "WEB AGENCY TOZEUR",
      position: "Full Stack Developer Intern",
      duration: "4 months",
    },
    {
      company: "ISET Tozeur",
      position: "Software Developer Student",
      duration: "2022-Present"
    },
    {
      company: "CodeCooperation",
      position: "Software Developer Student",
      duration: "2024-Present"
    },
    // You can add more experience items here if needed
  ]
}
// education data

const education = {
  icon: '/assets/resume/cap.svg',
  title: 'My education',
  description: `I have a solid foundation in software development and design, complemented by ongoing education in full stack web development and data structures.`,
  items: [
    {
      institution: "ISET Tozeur",
      degree: "Software Developer Student",
      duration: "2022-2025"
    },
    {
      institution: "Yanfaa Academy",
      degree: "Technology and Design",
      duration: "2023-2024"
    },
    {
      institution: "Online Course Platform.",
      degree: "Full Stack Web Development Bootcamp",
      duration: "2023",
    },
    {
      institution: "Online Course.",
      degree: "Data Structer and Algorith",
      duration: "2023",
    },
  ]
}

// skills data
const skills = {
  title: "My Skills",
  description: `I specialize in web development and design, with expertise in HTML, CSS, JavaScript, and frameworks like React and Next.js. I also create responsive designs using Tailwind CSS and utilize Node.js for back-end development.`,
  skillList: [
    {
      icon: <FaHtml5 />,
      name: "HTML5",
    },
    {
      icon: <FaCss3 />,
      name: "CSS3",
    },
    {
      icon: <FaJs />,
      name: "JavaScript",
    },
    {
      icon: <FaReact />,
      name: "React.js",
    },
    {
      icon: <SiNextdotjs />,
      name: "Next.js",
    },
    {
      icon: <SiTailwindcss />,
      name: "Tailwind CSS",
    },
    {
      icon: <FaNodeJs />,
      name: "Node.js",
    },
    {
      icon: <FaFigma />,
      name: "Figma",
    },
  ],
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

const Resume = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 1.4, duration: 0.4, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex items-center justify-center py-12 xl:py-0"
    >
      <div className="container mx-auto">
        <Tabs defaultValue="about" className="flex flex-col xl:flex-row gap-[60px]">
          <TabsList className="flex flex-col w-full max-w-[380px] mx-auto xl:mx-0 gap-6">
            <TabsTrigger value="about">About me</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>
          {/* content */}

          <div className="min-h-[70vh] w-full">
            {/* //^ about me */}
            <TabsContent value="about" className="w-full text-center xl:text-left">
              <div className="flex flex-col gap-[30px]">
                <h3 className="text-4xl font-bold">{about.title}</h3>
                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">{about.description}</p>
                <ul className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 max-w-[620px] mx-auto xl:mx-0">
                  {about.info.map((item, index) => {
                    return (
                      <li key={index} className="flex items-center justify-center xl:justify-start gap-4">
                        <span className="text-white/60">{item.fieldName} </span>
                        <span className="text-xl">{item.fieldValue}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </TabsContent>
            {/* //^ experience */}
            <TabsContent value="experience" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold">
                  {experience.title}
                </h3>

                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">
                  {experience.description}
                </p>

                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {experience.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl
                    flex flex-col justify-center items-center lg:items-start gap-1">
                          <span className="text-accent-default">{item.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">{item.position}</h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent-default"></span>
                            <p className="text-white/60">{item.company}</p>
                          </div>
                        </li>)
                    })}
                  </ul>

                </ScrollArea>
              </div>
            </TabsContent>
            {/* //^ education */}
            <TabsContent value="education" className="w-full">
              <div className="flex flex-col gap-[30px] text-center xl:text-left">
                <h3 className="text-4xl font-bold"> {education.title} </h3>

                <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0"> {education.description} </p>

                <ScrollArea className="h-[400px]">
                  <ul className="grid grid-cols-1 lg:grid-cols-2 gap-[30px]">
                    {education.items.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className="bg-[#232329] h-[184px] py-6 px-10 rounded-xl
                    flex flex-col justify-center items-center lg:items-start gap-1">
                          <span className="text-accent-default">{item.duration}</span>
                          <h3 className="text-xl max-w-[260px] min-h-[60px] text-center lg:text-left">{item.degree}</h3>
                          <div className="flex items-center gap-3">
                            {/* dot */}
                            <span className="w-[6px] h-[6px] rounded-full bg-accent-default"></span>
                            <p className="text-white/60">{item.institution}</p>
                          </div>
                        </li>)
                    })}
                  </ul>
                </ScrollArea>
              </div>
            </TabsContent>
            {/* //^ skills */}
            <TabsContent value="skills" className="w-full">
              <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[30px] text-center xl:text-left">
                  <h3 className="text-4xl font-bold">{skills.title}</h3>
                  <p className="max-w-[600px] text-white/60 mx-auto xl:mx-0">{skills.description}</p>
                </div>
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:gap-[30px] gap-4">
                  {skills.skillList.map((skill, index) => {
                    return <li key={index}>
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger className="w-full h-[150px] bg-[#232329] rounded-xl flex justify-center items-center group">
                            <div className="text-6xl group-hover:text-accent-default transition-all duration-300">
                              {skill.icon}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">
                              {skill.name}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </li>
                  })}
                </ul>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  )
}

export default Resume

