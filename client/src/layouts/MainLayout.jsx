import Header from "@/components/layout/Header";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
};

export default MainLayout;