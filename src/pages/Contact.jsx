import { Button } from "@/components/ui/button";
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

const contactMethods = [
  {
    icon: <FaEnvelope />,
    title: "Email",
    description: "youssefdegachi0@gmail.com",
    link: "mailto:youssefdegachi0@gmail.com",
    action: "Send Email"
  },
  {
    icon: <FaPhoneAlt />,
    title: "Phone",
    description: "(+216) 50 702 320",
    link: "tel:+21650702320",
    action: "Call Now"
  },
  {
    icon: <FaLinkedin />,
    title: "LinkedIn",
    description: "Youssef Degachi",
    link: "https://www.linkedin.com/in/youssef-degachi", // Update with your actual LinkedIn URL
    action: "Connect"
  },
  {
    icon: <FaWhatsapp />,
    title: "WhatsApp",
    description: "(+216) 50 702 320",
    link: "https://wa.me/21650702320",
    action: "Chat on WhatsApp"
  },
]

const Contact = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 1.4, duration: 0.4, ease: "easeIn" } }}
      className="py-6"
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-center mb-12">
            <h3 className="text-accent-default text-4xl mb-4">Let's work together</h3>
            <p className="text-white/60 text-lg">Choose your preferred way to reach me</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
            {contactMethods.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 1.6 + index * 0.1, duration: 0.4 }
                }}
                className="p-8 bg-[#27272c] rounded-xl hover:bg-[#2f2f35] transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-[72px] h-[72px] bg-[#1a1a1d] text-accent-default rounded-full flex items-center justify-center mb-2">
                    <div className="text-[32px]">{item.icon}</div>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">{item.title}</p>
                    <h3 className="text-xl mb-4">{item.description}</h3>
                  </div>
                  <a href={item.link} target={item.link.startsWith('http') ? '_blank' : '_self'} rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}>
                    <Button 
                      size="lg" 
                      className="w-full bg-accent-default hover:bg-accent-default/90 text-primary font-semibold"
                    >
                      {item.action}
                    </Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;

