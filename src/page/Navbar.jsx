
import { NavLink } from "react-router-dom";

const style = ({ isActive }) => {
  const base = 'font-normal no-underline transition-colors hover:text-gray-200 text-sm';
  return isActive ? `${base} text-white font-medium underline underline-offset-4` : `${base} text-gray-300`;
};

function Navbar({ user, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between bg-[#a52a2a] px-6 md:px-[50px] py-4 md:py-[20px] border-b border-black font-sans gap-4 md:gap-0">
      
      <div className="flex items-center gap-[10px] text-[18px] font-bold text-white">
        <div className="h-[40px] w-[40px] flex items-center justify-center bg-white text-[#a52a2a] font-extrabold rounded-full text-lg shadow-sm">
          W
        </div>
        E-wallet
      </div>


      <span className="flex items-center gap-4 justify-self-end">
        {user ? (
          <>
            <span className="text-sm text-gray-100">
              {user.email}
            </span>
            <button 
              onClick={onLogout} 
              className="px-4 py-2 text-sm font-medium bg-white text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={style}>Login</NavLink>
            <span className="text-gray-400 text-sm">|</span>
            <NavLink to="/register" className={style}>Register</NavLink>
          </>
        )}
      </span>
      
    </nav>
  );
}

export default Navbar;
