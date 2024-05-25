import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="h-full flex items-center justify-center">
    <SignIn
      // path="/sign-in"
      appearance={{
        elements: {
          formButtonPrimary:
            "bg-pink-500 hover:bg-pink-700 text-sm normal-case",
            footer: "hidden",
        },
      }}
    />
  </div>
);

export default SignInPage;
