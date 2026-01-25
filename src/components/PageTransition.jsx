import  { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const PageTransition = ({children}) => {
  const location = useLocation();
  const pathname = location.pathname;
  
  return <AnimatePresence mode="wait">
      <motion.div 
        key={pathname}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3}}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  
}

export default PageTransition
