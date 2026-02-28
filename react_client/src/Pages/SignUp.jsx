import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Background from "../Components/Background";

const SignUp = () => {
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.username.trim()) return toast.error("Username required");
        if (!formData.email.trim()) return toast.error("Email required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid Email Format");
        if (!formData.password) return toast.error("Password required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

        return true;
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const valid = validateForm(formData);
        if (valid === true) {
            await signup(formData)
            navigate("/");
        };
    };

    // return (
        
    //     <div className="relative z-10 text-center h-screen flex flex-col justify-center items-center">
    //         <div className="bg-white shadow-lg rounded-2xl p-6 w-96 border-4 border-red-600">
    //             <h2 className="text-2xl font-bold text-center mb-4 font-mono text-red-600">
    //                 SIGN UP
    //             </h2>
    //             <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
    //                 <input
    //                     type="text"
    //                     name="username"
    //                     placeholder="Username"
    //                     value={formData.username}
    //                     onChange={handleChange}
    //                     className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        
    //                 />
    //                 <input
    //                     type="email"
    //                     name="email"
    //                     placeholder="Email"
    //                     value={formData.email}
    //                     onChange={handleChange}
    //                     className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        
    //                 />
    //                 <div className="relative">
    //                     <input
    //                         type={showPass ? "text" : "password"}
    //                         name="password"
    //                         placeholder="Password"
    //                         value={formData.password}
    //                         onChange={handleChange}
    //                         className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                            
    //                     />
    //                     <button
    //                         type="button"
    //                         className="absolute right-3 top-2 text-gray-500"
    //                         onClick={() => setShowPass(!showPass)}
    //                     >
    //                         {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
    //                     </button>
    //                 </div>
    //                 <button
    //                     type="submit"
    //                     disabled={isSigningUp}
    //                     className="bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition-all disabled:bg-gray-400"
    //                 >
    //                     {isSigningUp ? "Signing Up..." : "Sign Up"}
    //                 </button>
    //             </form>
    //             <p className="text-center mt-4 text-gray-700">
    //                 Existing user?{" "}
    //                 <Link to="/login" className="text-red-600 font-bold hover:underline">
    //                     Login
    //                 </Link>
    //             </p>
    //         </div>
    //     </div>
        
    // );
    return (
        <div
          className="
            relative z-10
            min-h-[100svh]
            flex items-center justify-center
            px-4
          "
        >
          <div
            className="
              w-full max-w-sm
              bg-[#fffdf6]
              border-[3px] border-monopoly-red
              rounded-3xl
              shadow-card
              p-6
              text-center
            "
          >
            {/* Title */}
            <h2
              className="
                font-display
                text-3xl
                font-black
                text-monopoly-red
                tracking-wide
                mb-2
              "
            >
              Sign Up
            </h2>
    
            {/* Subtitle */}
            <p className="text-sm text-text-light mb-5">
              Create your Monopoly account
            </p>
    
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Username */}
              <input
                type="text"
                name="username"
                placeholder="USERNAME"
                value={formData.username}
                onChange={handleChange}
                className="
                  w-full
                  text-center
                  
                  tracking-widest
                  font-black
                  text-sm
                  px-4 py-3
                  rounded-2xl
                  bg-white
                  border-[3px] border-black/20
                  shadow-piece
                  focus:outline-none
                  focus:border-monopoly-green
                "
              />
    
              {/* Email */}
              <input
                type="email"
                name="email"
                placeholder="EMAIL"
                value={formData.email}
                onChange={handleChange}
                className="
                  w-full
                  text-center
                  
                  tracking-widest
                  font-black
                  text-sm
                  px-4 py-3
                  rounded-2xl
                  bg-white
                  border-[3px] border-black/20
                  shadow-piece
                  focus:outline-none
                  focus:border-monopoly-blue
                "
              />
    
              {/* Password */}
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="PASSWORD"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    w-full
                    text-center
                    
                    tracking-widest
                    font-black
                    text-sm
                    px-4 py-3
                    rounded-2xl
                    bg-white
                    border-[3px] border-black/20
                    shadow-piece
                    focus:outline-none
                    focus:border-monopoly-red
                  "
                />
    
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    text-text-light
                    hover:text-dark-blue
                    transition
                  "
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
    
              {/* Submit */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="
                  btn-green
                  py-3
                  text-sm
                  tracking-widest
                  disabled:opacity-60
                  disabled:translate-y-0
                "
              >
                {isSigningUp ? "Signing Up..." : "Create Account"}
              </button>
            </form>
    
            {/* Footer */}
            <p className="text-xs text-text-light mt-5">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-black text-monopoly-red hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      );
};

export default SignUp;
