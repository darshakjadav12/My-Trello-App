import  logo  from "../assets/logo.webp";

const Header = () => {
  return (
    <>
    <div className="bg-[#1d2125] w-100 h-12 p-3 border-b border-b-[#9fadbc29] 
          border-box flex flex-row justify-between  ">
        <div className="left flex justify-center items-center">
              <h3 className="text-slate-50">Trello App</h3>
        </div>
        <div className="right flex items-center space-x-4">
            <span>Development</span>
            <img className="rounded-full" src={logo} alt="sorry" width={38}/>
        </div>
    </div>
    </>
  )
}

export default Header