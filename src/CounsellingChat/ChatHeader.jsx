import image from "../images/AcadabooLogo.png";


const Header = () => (
  <header className="h-12 flex items-center px-4 bg-[#7b30a7] text-[#6264A7] font-semibold text-lg shadow-md">
      <div className="mr-4">
    <img src={image} alt="Acadaboo Logo" className="w-8 h-8" />
  </div>
    <h6>ACADABOO</h6>
  </header>
);

export default Header;
