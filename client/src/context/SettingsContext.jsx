import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { syncUser, fetchFavorites, toggleFavorite as apiToggleFav } from "@/services/api";
import { toast } from "sonner";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const { user } = useUser();
  
  // App Settings State
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState("USD");
  const [favorites, setFavorites] = useState([]); // Hotel IDs
  
  // User Role State (Derived from Clerk Metadata)
  // Default to 'user' if not set
  const userRole = user?.publicMetadata?.role || "user"; 

  // --- INITIALIZATION & SYNC ---
  useEffect(() => {
    if (user) {
      const initUser = async () => {
        try {
          // 1. Sync User to our Backend (MongoDB)
          // We pass the role too, so backend knows about admins
          await syncUser({
            clerkId: user.id,
            email: user.primaryEmailAddress.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            role: userRole 
          });
          
          // 2. Fetch User Favorites from Backend
          const favs = await fetchFavorites(user.id);
          setFavorites(favs.map(h => h._id));
        } catch (error) {
          console.error("User Sync Error", error);
        }
      };
      initUser();
    } else {
        // Clear data on logout
        setFavorites([]);
    }
  }, [user, userRole]); // Re-run if user or role changes

  // --- HANDLERS ---

  // Favorite Toggle
  const handleToggleFavorite = async (hotelId) => {
    if (!user) {
        toast.error("Please sign in to save hotels.");
        return;
    }

    const isAlreadyFav = favorites.includes(hotelId);
    
    // Optimistic Update
    if (isAlreadyFav) {
        setFavorites(prev => prev.filter(id => id !== hotelId));
        toast.success("Removed from Favorites");
    } else {
        setFavorites(prev => [...prev, hotelId]);
        toast.success("Added to Favorites");
    }

    try {
        await apiToggleFav(user.id, hotelId);
    } catch (error) {
        console.error("Favorite Error", error);
        toast.error("Failed to update favorites");
    }
  };

  // Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Currency Logic
  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "LKR" : "USD"));
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        currency, 
        toggleCurrency, 
        favorites, 
        handleToggleFavorite,
        userRole // Export Role to be used in Header
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);