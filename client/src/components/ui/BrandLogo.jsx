const BrandLogo = ({ className = "" }) => {
    return (
      <span 
        className={`font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent drop-shadow-sm select-none ${className}`}
        style={{ fontFamily: "'Inter', sans-serif" }} // Ensure modern font
      >
        ORRIO
      </span>
    );
  };
  
  export default BrandLogo;