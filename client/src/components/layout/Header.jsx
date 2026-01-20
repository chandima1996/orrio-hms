import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useSettings } from "@/context/SettingsContext";
import BrandLogo from "@/components/ui/BrandLogo";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, currency, toggleCurrency, userRole } = useSettings();
  const { user } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAdmin = userRole === "admin";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Hotels", path: "/search" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Transparent Pages List
  const isTransparentPage = [
    "/", "/search", "/about", "/contact", 
    "/careers", "/blog", "/help", "/terms", "/privacy", "/faq"
  ].includes(location.pathname);

  const isTransparent = isTransparentPage && !isScrolled;

  const textColorClass = isTransparent 
    ? "text-white hover:text-white/80" 
    : "text-slate-700 dark:text-slate-200 hover:text-primary";

  const buttonClass = isTransparent
    ? "text-white border-white/30 hover:bg-white/10"
    : "text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        !isTransparent
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 py-4 shadow-sm"
          : "bg-transparent border-white/5 py-6"
      }`}
    >
      <div className="container flex items-center justify-between px-4 mx-auto">
        
        <Link to="/" className="transition-opacity hover:opacity-90">
          <div className={isTransparent ? "drop-shadow-lg" : ""}>
             <BrandLogo className="text-3xl md:text-4xl" />
          </div>
        </Link>

        <nav className="items-center hidden gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-bold transition-all tracking-wide relative group ${textColorClass}`}
            >
              {item.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isTransparent ? 'bg-white' : 'bg-primary'}`} />
            </Link>
          ))}

          <SignedIn>
            {isAdmin ? (
               <Link to="/dashboard/admin" className="text-sm font-bold text-red-500 hover:text-red-600 drop-shadow-md">
                 Admin Dashboard
               </Link>
            ) : (
               <Link to="/dashboard/user" className={`text-sm font-bold ${textColorClass}`}>
                 Dashboard
               </Link>
            )}
          </SignedIn>
        </nav>

        <div className="items-center hidden gap-3 md:flex">
          <Button variant="outline" size="sm" onClick={toggleCurrency} className={`rounded-full font-bold bg-transparent transition-all border ${buttonClass}`}>
            {currency}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme} className={`rounded-full transition-all ${buttonClass}`}>
             {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className={`w-5 h-5 ${isTransparent ? "text-white" : "text-yellow-500"}`} />}
          </Button>

          <SignedOut>
            <SignInButton mode="modal">
                <Button className={`rounded-full px-6 font-bold shadow-lg transition-transform hover:scale-105 ${
                    !isTransparent 
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900" 
                        : "bg-white text-slate-900 hover:bg-slate-100"
                }`}>
                    Sign In
                </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>

        <div className="flex items-center gap-2 md:hidden">
            <SignedIn><UserButton /></SignedIn>
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={isTransparent ? "text-white" : "text-foreground"}>
                    <Menu className="w-8 h-8" />
                </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                  <div className="flex flex-col gap-6 mt-8">
                      <nav className="flex flex-col gap-4">
                          {navLinks.map((item) => (
                          <Link key={item.name} to={item.path} className="text-lg font-medium text-slate-800 dark:text-slate-200">
                              {item.name}
                          </Link>
                          ))}
                      </nav>
                      <div className="flex gap-4">
                          <Button variant="outline" onClick={toggleTheme} className="justify-center w-full">
                              {theme === 'light' ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                              Theme
                          </Button>
                          <Button variant="outline" onClick={toggleCurrency} className="w-full">
                              {currency}
                          </Button>
                      </div>
                      <SignedOut>
                        <SignInButton mode="modal"><Button className="w-full font-bold">Sign In</Button></SignInButton>
                    </SignedOut>
                  </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;