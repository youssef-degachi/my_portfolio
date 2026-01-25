import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

// components
import Stairs from "./Stairs";

const StairTransition = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
      <>
        <AnimatePresence mode="wait">
          <div key={pathname}>
            <div className="h-screen w-screen fixed top-0  left-0  right-0 pointer-events-none z-40 flex">
              <Stairs />
            </div>
            <motion.div className="h-screen w-screen fixed bg-primary top-0 pointer-events-none z-50"
              initial={{opacity: 1}}
              animate={{
                opacity: 0,
                transition: { delay:0.5, duration: 0.4,ease:"easeInOut" }
              }}
            />
          </div>
        </AnimatePresence>
      </>
    )
  
}

export default StairTransition
