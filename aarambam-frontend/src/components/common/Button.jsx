import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled }) => {
  const baseStyle = "w-full py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Changed 'brand' to 'blue' to ensure visibility
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700", 
    outline: "border-2 border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;