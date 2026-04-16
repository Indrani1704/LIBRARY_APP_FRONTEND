// import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"
// import { useCart } from "../../context/CartContext"

// export default function TopNavbar(){

// const navigate = useNavigate()

// const { cart } = useCart()  

// return(

// <div className="bg-white text-black px-10 py-3 flex items-center justify-between">

// {/* Logo */}

// <div
// className="text-2xl font-bold text-orange-500 cursor-pointer"
// onClick={()=>navigate("/")}>
// StoryTeller
// </div>


// {/* Search */}

// <div className="flex items-center border rounded-lg overflow-hidden w-[450px]">

// <input
// placeholder="Search for Book Title, Author, Publisher"
// className="flex-1 px-4 py-2 outline-none"
// />

// <button className="px-4 text-gray-500">
// <FaSearch/>
// </button>

// </div>


// {/* Icons */}

// <div className="flex items-center gap-6 text-gray-600">

// {/* User */}
// <FaUser className="cursor-pointer"/>

// {/* Cart */}

// <div
// className="relative cursor-pointer"
// onClick={()=>navigate("/cart")}
// >

// <FaShoppingCart size={18}/>

// {/* Dynamic Count */}

// {cart.length > 0 && (
// <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 rounded-full">
// {cart.length}
// </span>
// )}

// </div>

// </div>

// </div>

// )

// }