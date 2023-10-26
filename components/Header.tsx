import { BuyIcon, LoginIcon, LogoIcon, MenuIcon, SearchIcon, ThemeModeIcon } from "./icons";

export default function Header() {
  return (
    <div>
      <div className="flex items-center justify-between py-2 mt-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="chatbot-shop-logo">
            <LogoIcon />
          </div>
          <button className='chatbot-button hidden md:flex rounded-md items-center justify-center px-2.5 origin:px-3'>
            <MenuIcon />
            <span className='hidden lg:block font-semibold text-sm ml-2'>Categories</span>
          </button>
          <div className="hidden md:flex chatbot-input">
            <SearchIcon />
            <input placeholder="Search" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className='chatbot-button flex rounded-md items-center justify-center px-2.5 origin:px-3'>
            <LoginIcon />
            <span className='hidden lg:block font-semibold text-sm ml-2'>Login</span>
          </button>
          <div className="chatbot-icon">
            <BuyIcon />
          </div>
          <div className="chatbot-icon">
            <ThemeModeIcon />
          </div>
        </div>
      </div>
      <div className="flex md:hidden items-center gap-3 mt-3">
        <button className='chatbot-button flex rounded-md items-center justify-center px-2.5 origin:px-3'>
          <MenuIcon />
          <span className='hidden lg:block font-semibold text-sm ml-2'>Categories</span>
        </button>
        <div className="chatbot-input  flex w-full">
          <SearchIcon />
          <input placeholder="Search" />
        </div>
      </div>
    </div>
  )
}