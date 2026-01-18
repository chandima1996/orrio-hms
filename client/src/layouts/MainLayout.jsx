import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground selection:bg-primary selection:text-white">
      
      {/* Header එක Fixed නිසා එය අනිත් Content වලට උඩින් (Z-index) තියෙනවා */}
      <Header />
      
      {/* 
         FIX: අපි pt-20 අයින් කළා. දැන් හැම පිටුවකම Content එක පටන් ගන්නේ Screen එකේ උඩම කෙලවරෙන්.
         එතකොට Navbar එක Background Image එක උඩට ලස්සනට Set වෙනවා.
      */}
      <main className="flex-grow pt-0"> 
        {children}
      </main>

      <Footer />
      
    </div>
  );
};

export default MainLayout;