import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  // const [isOtp, setIsOtp] = useState(false);
  // const [aadharNo, setAadharNo] = useState("");
  const [botLang, setBotLang] = useState("en"); // default language is english

  const loginIntoApp = () => {
    setIsLogin(true);
  };

  const logOut = () => {
    setIsLogin(false);
    setBotLang("");
    // window.location.reload();
  };
  
  const handleChange = (event) => {
    setBotLang(event.target.value);
};

  return (
    <>
      {isLogin ? (
        <>
          <Loader />
          <Leva hidden />
          <UI logOut={logOut} botLang={botLang} handleChange={handleChange}/>
          <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
            <Experience />
          </Canvas>
        </>
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-30 w-auto"
              src="logo.png"
              alt="Your Company"
            />
          </div>
          {/* a red button which says enter */}
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <button
              onClick={loginIntoApp}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
