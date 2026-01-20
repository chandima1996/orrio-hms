import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Send, Youtube } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import BrandLogo from "@/components/ui/BrandLogo";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) return;
    toast.success("Subscribed successfully!", {
        description: `You will receive updates at ${email}`,
        duration: 3000,
    });
    setEmail("");
  };

  return (
    <footer className="pt-20 pb-10 transition-colors duration-300 border-t bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800">
      <div className="container px-4 mx-auto">
        
        
        <div className="grid grid-cols-1 gap-12 mb-12 md:grid-cols-2 lg:grid-cols-4">
          
          
          <div className="space-y-4">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <BrandLogo className="text-3xl" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Experience the future of hospitality. Orrio's AI powered engine finds the perfect stay tailored just for you, combining luxury with technology.
            </p>
          </div>

          
          <div>
            <h3 className="mb-6 text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-white">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="transition-colors hover:text-primary">Careers</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="mb-6 text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/help" className="transition-colors hover:text-primary">Help Center</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-primary">FAQs</Link></li>
            </ul>
          </div>

          
          <div>
            <h3 className="mb-6 text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-white">Stay Updated</h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Subscribe to our newsletter for the latest luxury deals and travel inspiration.</p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 focus-visible:ring-primary text-slate-900 dark:text-white placeholder:text-slate-400"
              />
              <Button size="icon" onClick={handleSubscribe} className="text-white bg-primary hover:bg-primary/90 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="mb-8 bg-slate-200 dark:bg-slate-800" />

        
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-sm font-medium text-slate-500">© 2024 Orrio Inc. All rights reserved.</p>
          
          
          <div className="flex items-center gap-6">
            
            <a href="https://facebook.com" target="_blank" rel="noreferrer" 
               className="transition-all transform text-slate-400 hover:text-blue-600 hover:scale-110 hover:-translate-y-1">
                <Facebook className="w-5 h-5" />
            </a>
            
            <a href="https://twitter.com" target="_blank" rel="noreferrer" 
               className="transition-all transform text-slate-400 hover:text-sky-500 hover:scale-110 hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
            </a>
            
            <a href="https://instagram.com" target="_blank" rel="noreferrer" 
               className="transition-all transform text-slate-400 hover:text-pink-600 hover:scale-110 hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
            </a>
            
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" 
               className="transition-all transform text-slate-400 hover:text-blue-700 hover:scale-110 hover:-translate-y-1">
                <Linkedin className="w-5 h-5" />
            </a>

            <a href="https://youtube.com" target="_blank" rel="noreferrer" 
               className="transition-all transform text-slate-400 hover:text-red-600 hover:scale-110 hover:-translate-y-1">
                <Youtube className="w-5 h-5" />
            </a>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;