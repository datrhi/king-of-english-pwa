"use client";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { useTransitionRouter } from "@/lib/next-view-transitions";
import { Block, Button, List, ListInput } from "konsta/react";
import React, { useState } from "react";

export default function SignInPage() {
  const router = useTransitionRouter();
  const [email, setEmail] = useState({ value: "", changed: false });
  const [password, setPassword] = useState({ value: "", changed: false });
  const [rememberMe, setRememberMe] = useState(false);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail({ value: e.target.value, changed: true });
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ value: e.target.value, changed: true });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = () => {
    if (email.value && password.value && validateEmail(email.value)) {
      // Handle sign in logic here
      console.log("Sign in with:", {
        email: email.value,
        password: password.value,
      });
      router.push("/");
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password clicked");
  };

  const handleSignUp = () => {
    // Navigate to sign up page
    router.replace("/signup");
  };

  return (
    <ScreenWithBackground headerProps={{ title: "The King is back!" }}>
      <List strongIos insetIos>
        <ListInput
          outline
          floatingLabel
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email.value}
          error={
            email.changed && !email.value.trim()
              ? "Please enter your email"
              : email.changed &&
                email.value.trim() &&
                !validateEmail(email.value)
                ? "Please enter a valid email"
                : ""
          }
          onChange={onEmailChange}
          clearButton={email.value.length > 0}
          onClear={() => setEmail({ value: "", changed: true })}
        />

        <ListInput
          outline
          floatingLabel
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password.value}
          error={
            password.changed && !password.value.trim()
              ? "Please enter your password"
              : password.changed && password.value.length < 6
                ? "Password must be at least 6 characters"
                : ""
          }
          onChange={onPasswordChange}
          clearButton={password.value.length > 0}
          onClear={() => setPassword({ value: "", changed: true })}
        />
      </List>

      <Block className="space-y-4 mt-6">
        <Button
          large
          rounded
          className="w-full"
          onClick={handleSignIn}
          disabled={
            !email.value ||
            !password.value ||
            !validateEmail(email.value) ||
            password.value.length < 6
          }
        >
          Sign In
        </Button>

        <Button
          large
          rounded
          clear
          className="w-full"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
          </span>
          <Button
            clear
            inline
            className="text-sm p-0 h-auto"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </div>
      </Block>
    </ScreenWithBackground>
  )
}
