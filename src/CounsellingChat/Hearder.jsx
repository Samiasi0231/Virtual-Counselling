import image from "../images/AcadabooLogo.png";


const Header = () => (
  <header className="h-10 flex items-center px-4 bg-[#7b30a7] text-white font-semibold text-lg shadow-md">
      <div className="mr-4">
    <img src={image} alt="Acadaboo Logo" className="w-8 h-8" />
  </div>
    <h3>ACADABOO</h3>
  </header>
);

export default Header;
