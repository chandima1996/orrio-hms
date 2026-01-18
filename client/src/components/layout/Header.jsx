import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Hotel, Sun, Moon, DollarSign, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useSettings } from "@/context/SettingsContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme, currency, toggleCurrency } = useSettings();
  const { user } = useUser(); // Log වුන user ගේ විස්තර ගන්න

  // Scroll effect logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Admin Check (සරල විදියට: email එක admin@orrio.com නම් admin dashboard පෙන්නනවා)
  // Industry standard විදියට නම් user role එක metadata වලින් ගන්න ඕනේ. දැනට email එකෙන් යමු.
  const isAdmin = user?.primaryEmailAddress?.emailAddress === "admin@orrio.com";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Hotels", path: "/search" }, // Search page එකට (තාම හැදුවේ නෑ, දැනට තියමු)
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
            <Hotel className="h-6 w-6 text-primary" />
          </div>
          <span className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
  Orrio
</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}

          {/* User Links (Logged In Only) */}
          <SignedIn>
            <Link to="/dashboard/user" className="text-sm font-medium text-slate-600 hover:text-primary">My Dashboard</Link>
            {isAdmin && (
                <Link to="/dashboard/admin" className="text-sm font-bold text-red-500 hover:text-red-600">Admin Panel</Link>
            )}
          </SignedIn>
        </nav>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Currency Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleCurrency} className="rounded-full">
            <span className="font-bold text-xs">{currency}</span>
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
             {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>

          {/* Auth Buttons */}
          <SignedOut>
            <SignInButton mode="modal">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/25">
                    Sign In
                </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* Mobile Menu (Hamburger) - Updated */}
        <div className="md:hidden flex items-center gap-2">
            <SignedIn>
                <UserButton />
            </SignedIn>
            
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
                </SheetTrigger>
                <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                    {navLinks.map((item) => (
                    <Link key={item.name} to={item.path} className="text-lg font-medium py-2 border-b">
                        {item.name}
                    </Link>
                    ))}
                    
                    <SignedIn>
                        <Link to="/dashboard/user" className="text-lg font-medium py-2 border-b">My Dashboard</Link>
                        {isAdmin && <Link to="/dashboard/admin" className="text-lg font-bold text-red-500 py-2 border-b">Admin Panel</Link>}
                    </SignedIn>

                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" onClick={toggleTheme} className="w-full">
                            {theme === 'light' ? "Dark Mode" : "Light Mode"}
                        </Button>
                        <Button variant="outline" onClick={toggleCurrency} className="w-full">
                            {currency}
                        </Button>
                    </div>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button className="w-full mt-4">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </nav>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;