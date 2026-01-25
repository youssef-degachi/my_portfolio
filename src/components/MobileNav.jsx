import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import { useLocation, Link } from 'react-router-dom';
import { CiMenuFries } from 'react-icons/ci'


const links = [
  {
    name: "home",
    path : "/",
  },{
    name: "services",
    path : "/services",
  },{
    name: "resume",
    path : "/resume",
  },{
    name: "work",
    path : "/work",
  },{
    name: "contact", 
    path : "/contact",
  }
]

const MobileNav = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-accent-default" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        {/* logo */}
        <div className="mt-32 mb-40 text-center text-2xl">
          <Link to="/">
            <h1 className="text-4xl font-semibold">
              Youssef<span className="text-accent-default">.</span>
            </h1>
          </Link>
        </div>
        {/* nav */}
        <div className="flex flex-col justify-center items-center gap-8">
          {links.map((link ,index) => {
            return (
              <Link to={link.path} key={index} className={`
                ${link.path=== pathname && "text-accent-default border-b-2 border-accent-default"}
                text-xl capitalize hover:text-accent-default transition-all`}
                >
                    {link.name}
              </Link>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
