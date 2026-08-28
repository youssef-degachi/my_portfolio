import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import WorkSliderBtns from "@/components/WorkSliderBtns";
import { visibleWorkByKind, WORK_KIND } from "@/data/work";

const ClientWorkSlider = () => {
  const projects = visibleWorkByKind(WORK_KIND.CLIENT);
  const [project, setProject] = useState(projects[0]);

  const handleSlideChange = (swiper) => {
    const currentIndex =
      swiper.realIndex !== undefined ? swiper.realIndex : swiper.activeIndex;
    setProject(projects[currentIndex]);
  };

  if (!project) return null;

  return (
    <div>
      <p className="mb-8 text-center text-white/50 text-sm italic">
        Public demos in the same spirit as client work I cannot share under NDA.
      </p>
      <div className="flex flex-col xl:flex-row xl:gap-[30px]">
        <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
          <div className="flex flex-col gap-[30px] h-[50%]">
            <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
              {project.num}
            </div>
            <h2 className="text-[42px] font-bold leading-none text-white capitalize">
              {project.category} project
            </h2>
            <p className="text-white/60">{project.description}</p>
            <ul className="flex flex-wrap gap-4">
              {project.stack.map((item, index) => (
                <li key={index} className="text-xl text-accent-default">
                  {item.name}
                  {index !== project.stack.length - 1 && ","}
                </li>
              ))}
            </ul>
            <div className="border border-white/20"></div>
            <div className="flex items-center gap-4">
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group cursor-pointer">
                        <BsArrowUpRight className="text-white text-3xl group-hover:text-accent-default" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>live project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer">
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group cursor-pointer">
                        <BsGithub className="text-white text-3xl group-hover:text-accent-default" />
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
        <div className="w-full xl:w-[50%]">
          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            modules={[Navigation]}
            className="xl:h-[520px] mb-12"
            onSlideChange={handleSlideChange}
            loop={true}
          >
            {projects.map((item) => (
              <SwiperSlide key={item.num} className="w-full h-[460px]">
                <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20 overflow-hidden">
                  <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>
                  <img
                    src={item.image}
                    className="object-contain w-full h-full"
                    alt={item.title}
                  />
                </div>
              </SwiperSlide>
            ))}
            <WorkSliderBtns
              containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
              btnStyles="bg-accent-default hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all "
            />
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default ClientWorkSlider;
