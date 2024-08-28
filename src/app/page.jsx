import { Button } from "@/components/ui/button"
import { FiDownload } from "react-icons/fi"
//components
import Social from "@/components/Social"
import Photo from "@/components/Photo"
import Stats from "@/components/Stats"
import StairTransition from "@/components/StairTransition"

const Home = () => {
  return (
    
    <section className="h-full">
      
      <div className="container mx-auto h-full">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-8 xl:pb-24">
          {/* text */}
          <div className="text-center xl:text-left order-2 xl:order-none ">
            <span className="text-xl">Software Developer</span>
            <h1 className="h1 mb-6">
              Hello I'm <br/> <span className="text-accent-default">Youssef Degachi</span> 
            </h1>
            <p>
              I excel at crafting elegant digital experiences and I am
              proficient in various programming languages and technologies.
            </p>
            {/* btn and socials */}
          <div className="flex flex-col xl:flex-row items-center gap-8 pt-3">
            <Button 
              variant="outline"
              size="lg"
              className="uppercase flex items-center gap-2"
              >
              <span>Download CV</span>
              <FiDownload className="text-xl" />
            </Button>
            <div className="mb-8 xl:mb-0">
              <Social  
                containerStyles="flex gap-6" 
                iconStyles="w-9 h-9 border border-accent-default rounded-full 
                flex justify-center items-center text-accent-default text-base 
                hover:bg-accent-default hover:text-primary hover:transition-all duration-500"
              />
              </div>
            </div>
          </div>
          {/* photo */}
          
            <div className="order-1 xl:order-none mb-8 xl:mb-0">
              <Photo />
            </div>
          
        </div>
      </div>
      <Stats/>
    </section>
  )
}

export default Home