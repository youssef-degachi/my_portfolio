import { Link, useLocation } from 'react-router-dom';

const links =[
  {
    name: "home",
    path : "/",
  },{
    name: "services",
    path : "/services",
  },{
    name: "pricing",
    path : "/pricing",
  },{
    name: "resume",
    path : "/resume",
  },{
    name: "work",
    path : "/work",
  },{
    name: "knowledge",
    path : "/knowledge",
  },{
    name: "contact",
    path : "/contact",
  }
]; 

const Nav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const isActive = (path) => (path === "/" ? pathname === "/" : pathname.startsWith(path));
  
  return ( 
    <nav className="flex gap-8">
      {links.map((link, index) =>{
        return <Link to={link.path} key={index} className={
          `${isActive(link.path) && "text-accent-default  border-b-2 border-accent-default"} capitalize font-medium hover:text-accent-default transition-all`}>
              {link.name}</Link>
      })}
    </nav>
  )
    
}

export default Nav
