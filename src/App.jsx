import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";
import Vapi from "@vapi-ai/web";
import { useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

function App() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const [volumeLevel, setVolumeLevel] = useState(0);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);

  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } =
    usePublicKeyInvalid();

  // hook into Vapi events
  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);

      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);

      setShowPublicKeyInvalidMessage(false);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("error", (error) => {
      console.error(error);

      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    });
  }, []);

  // call start handler
  const startCallInline = () => {
    setConnecting(true);
    vapi.start(import.meta.env.VITE_SANJEEVNI_AI_ASSISTANT_ID);
  };
  const endCall = () => {
    vapi.stop();
  };

  // check if able to access the Vapi environment variable
  console.log(import.meta.env.VITE_SANJEEVNI_AI_ASSISTANT_ID);

  return (
    <>
      {connected ? (
        <>
          <Loader />
          <Leva hidden />
          <UI
            logOut={endCall}
            volumeLevel={volumeLevel}
          />
          <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
            <Experience assistantIsSpeaking={assistantIsSpeaking} />
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
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <button
              onClick={startCallInline}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              {connecting ? (
                <ScaleLoader
                  color="#fff"
                  height={20}
                  width={3}
                  margin={0.5}
                  loading={true}
                />
              ) : (
                "Start"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

const usePublicKeyInvalid = () => {
  const [showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage] =
    useState(false);

  // close public key invalid message after delay
  useEffect(() => {
    if (showPublicKeyInvalidMessage) {
      setTimeout(() => {
        setShowPublicKeyInvalidMessage(false);
      }, 3000);
    }
  }, [showPublicKeyInvalidMessage]);

  return {
    showPublicKeyInvalidMessage,
    setShowPublicKeyInvalidMessage,
  };
};

const PleaseSetYourPublicKeyMessage = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "25px",
        left: "25px",
        padding: "10px",
        color: "#fff",
        backgroundColor: "#f03e3e",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      Is your Vapi Public Key missing? (recheck your code)
    </div>
  );
};
