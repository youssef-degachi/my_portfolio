import { Link } from "react-router-dom";

import {FaGithub, FaYoutube, FaTwitter, FaLinkedinIn}  from "react-icons/fa";

const socials = [
  { icon: <FaGithub/>, path:"https://github.com/youssef-degachi/"},
  { icon: <FaLinkedinIn/>, path:"https://www.linkedin.com/in/youssef-degachi/"},
  { icon: <FaYoutube/>, path:"https://www.youtube.com/@YoussefDegachi0"},
  { icon: <FaTwitter/>, path:"https://x.com/YoussefDegachi"},
]


const Social = ({containerStyles, iconStyles}) => {
  return <div className={containerStyles}>
    {socials.map((item,index)=>{
      return (
      <Link key={index} to={item.path} className={iconStyles}>
          {item.icon}
      </Link>)
    })}
  </div>
}

export default Social
