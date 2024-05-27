import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { useState } from "react";
import Vapi from "@vapi-ai/web";
import { useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import {
  callStarted,
  callEnded,
  logToTerminal,
  registerUser,
} from "./utils/logger";
import useUnload from "./hooks/useUnload"; // Adjust the path as needed
import { useUser } from "@clerk/clerk-react";

const vapi = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);

function App() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser();
  const [sessionId, setSessionId] = useState(null);

  const [volumeLevel, setVolumeLevel] = useState(0);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);

  const { showPublicKeyInvalidMessage, setShowPublicKeyInvalidMessage } =
    usePublicKeyInvalid();

  // hook into Vapi events
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const handleCallStart = async () => {
      setConnecting(false);
      // try {
      //   const res = await callStarted(user.emailAddresses[0].emailAddress);
      //   if (res.data.message === "Daily usage limit exceeded") {
      //     console.error("Daily usage limit exceeded", res.data.message);
      //     setConnecting(false);
      //     return;
      //   }
      //   console.log("call started", res);
      //   setSessionId(res.data._id);
      //   setConnecting(false);
      //   setConnected(true);
      //   setShowPublicKeyInvalidMessage(false);
      //   // vapi.start(import.meta.env.VITE_SANJEEVNI_AI_ASSISTANT_ID);
      // } catch (error) {
      //   console.error("Error starting call:", error);
      //   setConnecting(false);
      // }
    };

    const handleCallEnd = async () => {
      try {
        const res = await callEnded(
          user.emailAddresses[0].emailAddress,
          sessionId
        );
        console.log("call ended", res);
        setSessionId(null);
        // setConnecting(false);
        setConnected(false);
        setShowPublicKeyInvalidMessage(false);
      } catch (error) {
        console.error("Error ending call:", error);
      }
    };

    const handleSpeechStart = () => {
      setAssistantIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setAssistantIsSpeaking(false);
    };

    const handleVolumeLevel = (level) => {
      setVolumeLevel(level);
    };

    const handleError = (error) => {
      logToTerminal("Error");
      console.error(error);

      setConnecting(false);
      if (isPublicKeyMissingError({ vapiError: error })) {
        setShowPublicKeyInvalidMessage(true);
      }
    };

    // Attach event listeners
    vapi.on("call-start", handleCallStart);
    // vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("volume-level", handleVolumeLevel);
    vapi.on("error", handleError);

    // Cleanup event listeners on component unmount
    return () => {
      vapi.off("call-start", handleCallStart);
      // vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("volume-level", handleVolumeLevel);
      vapi.off("error", handleError);
    };
  }, [isLoaded, sessionId]);

  useEffect(() => {
    const registerUserAtLogin = async () => {
      if (isLoaded && isSignedIn) {
        const res = await registerUser(user.emailAddresses[0].emailAddress);
        console.log("user registered", res);
      }
    };
    registerUserAtLogin();
  }, [isLoaded]);

  // call start handler
  const startCallInline = async () => {
    setConnecting(true);
    const res = await callStarted(user.emailAddresses[0].emailAddress);
    if (res.data.message === "Daily usage limit exceeded") {
      alert("Daily usage limit exceeded, please try again tomorrow.");
      console.error("Daily usage limit exceeded", res.data.message);
      setConnecting(false);
      return;
    }
    console.log("call started", res);
    vapi.start(import.meta.env.VITE_SANJEEVNI_AI_ASSISTANT_ID);
    setSessionId(res.data._id);
    // setConnecting(false);
    setConnected(true);
    setShowPublicKeyInvalidMessage(false);
  };
  const endCall = async () => {
    const res = await callEnded(user.emailAddresses[0].emailAddress, sessionId);
    vapi.stop();
    console.log("call ended", res);
    setSessionId(null);
    setConnected(false);
    setShowPublicKeyInvalidMessage(false);
  };

  useUnload(callEnded, connected);

  return (
    <>
      <SignedOut>
        <SignInPage />
      </SignedOut>
      <SignedIn>
        <>
          <Loader />
          <Leva hidden />
          <UI
            logOut={endCall}
            volumeLevel={volumeLevel}
            connected={connected}
            connecting={connecting}
            startCallInline={startCallInline}
          />
          <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
            <Experience assistantIsSpeaking={assistantIsSpeaking} />
          </Canvas>
        </>
      </SignedIn>
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
