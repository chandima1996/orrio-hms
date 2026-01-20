import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-background text-foreground selection:bg-primary selection:text-white">
      
     
      <Header />
      
     
      <main className="flex-grow pt-0"> 
        {children}
      </main>

      <Footer />
      
    </div>
  );
};

export default MainLayout;