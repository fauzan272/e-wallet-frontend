function Button({ 
  children, 
  variant = "primary", 
  onClick, 
  className = "", 
  disabled = false, 
  type = "button", 
  ...props 
}) {
  const getVariantClass = () => {
    const baseStyle = "px-[20px] py-[10px] rounded-[5px] font-normal transition-all duration-300 ease-in-out hover:opacity-80 hover:shadow-[0_4px_4px_rgba(0,0,0,0.25)] bg-black text-white border border-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    switch (variant) {
      case "outline":
        return "px-[20px] py-[10px] rounded-[5px] font-normal transition-all duration-300 ease-in-out hover:bg-gray-800 bg-transparent text-white border border-gray-600 cursor-pointer disabled:opacity-50";
      case "primary":
      default:
        return `${baseStyle} hover:bg-white hover:text-black hover:border-white`;
    }
  };

  return (
    <button 
      type={type} 
      className={`${getVariantClass()} ${className}`} 
      onClick={onClick} 
      disabled={disabled} 
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
