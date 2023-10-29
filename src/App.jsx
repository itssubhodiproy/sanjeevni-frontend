import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [aadharNo, setAadharNo] = useState("");
  const [botLang, setBotLang] = useState("");

  const AADHARDB_URL = "https://aadhar-db.vercel.app";

  const loginIntoApp = () => {
    setIsLogin(true);
  };

  const logOut = () => {
    setIsOtp(false);
    setIsLogin(false);
    setBotLang("");
    window.location.reload();
  };

  console.log(aadharNo);

  const sendOtp = async () => {
    if (aadharNo === "") {
      alert("Please enter aadhar details to send OTP");
      return;
    }
    console.log("I'm here");
    // api call to get the data from aadhar-db
    let res = await fetch(`${AADHARDB_URL}/get-info?aadharNo=${aadharNo}`);
    res = await res.json();
    res = res.data[0];

    console.log(res);
    setBotLang(res.lang);
    setIsOtp(true);
  };

  return (
    <>
      {isLogin ? (
        <>
          <Loader />
          <Leva hidden />
          <UI logOut={logOut} botLang={botLang} />
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
          {isOtp === false ? (
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Enter Aadhar No:
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="text"
                      onChange={(e) => setAadharNo(e.target.value)}
                      value={aadharNo}
                      placeholder="XXXX-XXXX-4865"
                      required
                      className="block w-full rounded-md border-0 p-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-pink-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <div
                    onClick={sendOtp}
                    className="flex w-full justify-center rounded-md bg-pink-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 cursor-pointer"
                  >
                    Send OTP
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="relative bg-white px-6 pt-6 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl mt-6">
                <div className="mx-auto flex w-full max-w-md flex-col space-y-10">
                  <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="flex flex-row text-sm font-medium text-gray-400">
                      <p>We have sent a code to your phone +91 XXXXXXXX98</p>
                    </div>
                  </div>

                  <div>
                    <form action="" method="post">
                      <div className="flex flex-col space-y-16">
                        <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                          <div className="w-16 h-16 ">
                            <input
                              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-pink-500"
                              type="text"
                              name=""
                              id=""
                            />
                          </div>
                          <div className="w-16 h-16 ">
                            <input
                              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-pink-500"
                              type="text"
                              name=""
                              id=""
                            />
                          </div>
                          <div className="w-16 h-16 ">
                            <input
                              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-pink-500"
                              type="text"
                              name=""
                              id=""
                            />
                          </div>
                          <div className="w-16 h-16 ">
                            <input
                              className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-pink-700"
                              type="text"
                              name=""
                              id=""
                            />
                          </div>
                        </div>

                        <div className="flex flex-col space-y-5">
                          <div>
                            <button
                              className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-pink-500 border-none text-white text-sm shadow-sm"
                              onClick={loginIntoApp}
                            >
                              Verify Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;
