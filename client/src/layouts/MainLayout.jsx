import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer"; // 1. Footer Import එක තියෙනවද බලන්න

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
      
      {/* Header එක උඩින් */}
      <Header />
      
      {/* Page Content එක මැදින් (flex-grow දාලා තියෙන්නේ Footer එක පල්ලෙහාට තල්ලු කරන්න) */}
      <main className="flex-grow pt-20"> 
        {children}
      </main>

      {/* 2. Footer එක මෙන්න මෙතන තියෙන්නම ඕනේ */}
      <Footer />
      
    </div>
  );
};

export default MainLayout;