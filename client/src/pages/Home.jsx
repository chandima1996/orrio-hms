import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <h1 className="text-4xl font-bold mb-4 text-slate-900">Welcome to Orrio</h1>
      <p className="text-slate-600 mb-8">AI Powered Hotel Management System</p>
      <div className="flex gap-4">
         <Button>Find Hotels</Button>
         <Button variant="outline">Learn More</Button>
      </div>
    </div>
  );
};

export default Home;