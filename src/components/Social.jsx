import {FaGithub, FaYoutube, FaTwitter, FaLinkedinIn}  from "react-icons/fa";

const socials = [
  { icon: <FaGithub/>, path:"https://github.com/youssef-degachi/", label: "GitHub" },
  { icon: <FaLinkedinIn/>, path:"https://www.linkedin.com/in/youssef-degachi/", label: "LinkedIn" },
  { icon: <FaYoutube/>, path:"https://www.youtube.com/@YoussefDegachi0", label: "YouTube" },
  { icon: <FaTwitter/>, path:"https://x.com/YoussefDegachi", label: "X" },
]


const Social = ({containerStyles, iconStyles}) => {
  return <div className={containerStyles}>
    {socials.map((item,index)=>{
      return (
      <a
        key={index}
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.label}
        className={iconStyles}
      >
          {item.icon}
      </a>)
    })}
  </div>
}

export default Social
