import { animate, motion } from "framer-motion"

//variables
const stairAnimation = {
  initial:{
    top: ["0%"],
  },
  animate:{
    top: ["100%","0%","100%"],
  },
  exit:{
    top: ["0%" , "100%"],
  },
};

// calculate the reverse index fot staggred deploy
const reverseIndex = (index) => {
  const totalSteps = 6; // total number of steps
  return (totalSteps - index - 1);
}

const Stairs = () => {
  return (
    <>
      {/* 
        render 6 motion divs, each representing o step of the stairs.
        Each div will have the same animotion defined by the stoirsAnimation object.
        The delay for each div is calculated sinomicolly(dynamically) based on it's reversed index,
        creating a staggered effect with decreasing deloy for eoch subsequent step.
        //! i remove initial and exit before and after animate because is won't work   
      */}
      {[...Array(6)].map((_, index) =>{
        return(
          <motion.div
            key={index}
            variants={stairAnimation}
            animate="animate"
            transition={{
              duration: 0.8, // duration of the animation
              ease: "easeInOut", // easing function for the animation
              delay:reverseIndex(index) * 0.1, // delay each step by 100ms (0.1s) 
            }}
            className="h-full w-full bg-white relative"
          />
        );
      })}

    </>
  )
}

export default Stairs