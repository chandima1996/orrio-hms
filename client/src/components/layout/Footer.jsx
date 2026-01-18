import { Link } from "react-router-dom";
import { Hotel, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Hotel className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold text-white">Orrio</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Experience the future of hospitality. Orrio's AI powered engine finds the perfect stay tailored just for you.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-slate-400 text-sm mb-4">Subscribe to our newsletter for latest updates and offers.</p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-slate-900 border-slate-800 focus-visible:ring-primary text-white"
              />
              <Button size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2024 Orrio Inc. All rights reserved.</p>
          
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram className="h-5 w-5" /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;