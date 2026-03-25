"use client";
import ScreenWithBackground from "@/components/ScreenWithBackground";
import { useNavigation } from "@/lib/navigation";
import { Block, Button, List, ListInput } from "konsta/react";
import React, { useState } from "react";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState({ value: "", changed: false });
  const [lastName, setLastName] = useState({ value: "", changed: false });
  const [email, setEmail] = useState({ value: "", changed: false });
  const [password, setPassword] = useState({ value: "", changed: false });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    changed: false,
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const onFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName({ value: e.target.value, changed: true });
  };

  const onLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName({ value: e.target.value, changed: true });
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail({ value: e.target.value, changed: true });
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ value: e.target.value, changed: true });
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword({ value: e.target.value, changed: true });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const passwordsMatch = () => {
    return password.value === confirmPassword.value;
  };

  const handleSignUp = () => {
    if (
      firstName.value &&
      lastName.value &&
      email.value &&
      password.value &&
      confirmPassword.value &&
      validateEmail(email.value) &&
      validatePassword(password.value) &&
      passwordsMatch() &&
      agreeToTerms
    ) {
      // Handle sign up logic here
      console.log("Sign up with:", {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      });
      navigation.navigate("Home");
    }
  };

  const handleSignIn = () => {
    // Navigate to sign in page
    navigation.replace("SignIn");
  };

  const isFormValid = () => {
    return (
      firstName.value.trim() &&
      lastName.value.trim() &&
      email.value &&
      password.value &&
      confirmPassword.value &&
      validateEmail(email.value) &&
      validatePassword(password.value) &&
      passwordsMatch() &&
      agreeToTerms
    );
  };

  return (
    <ScreenWithBackground headerProps={{ title: "Ready to wear the crown?" }}>
      <List strongIos insetIos>
        <ListInput
          outline
          floatingLabel
          label="First Name"
          type="text"
          placeholder="Enter your first name"
          value={firstName.value}
          error={
            firstName.changed && !firstName.value.trim()
              ? "Please enter your first name"
              : ""
          }
          onChange={onFirstNameChange}
          clearButton={firstName.value.length > 0}
          onClear={() => setFirstName({ value: "", changed: true })}
        />

        <ListInput
          outline
          floatingLabel
          label="Last Name"
          type="text"
          placeholder="Enter your last name"
          value={lastName.value}
          error={
            lastName.changed && !lastName.value.trim()
              ? "Please enter your last name"
              : ""
          }
          onChange={onLastNameChange}
          clearButton={lastName.value.length > 0}
          onClear={() => setLastName({ value: "", changed: true })}
        />

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

        <ListInput
          outline
          floatingLabel
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword.value}
          error={
            confirmPassword.changed && !confirmPassword.value.trim()
              ? "Please confirm your password"
              : confirmPassword.changed &&
                confirmPassword.value &&
                !passwordsMatch()
                ? "Passwords do not match"
                : ""
          }
          onChange={onConfirmPasswordChange}
          clearButton={confirmPassword.value.length > 0}
          onClear={() => setConfirmPassword({ value: "", changed: true })}
        />
      </List>

      <Block className="space-y-4 mt-6">
        {/* Terms and Conditions Checkbox */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
            I agree to the{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Terms and Conditions
            </span>{" "}
            and{" "}
            <span className="text-blue-600 underline cursor-pointer">
              Privacy Policy
            </span>
          </label>
        </div>

        <Button
          large
          rounded
          className="w-full"
          onClick={handleSignUp}
          disabled={!isFormValid()}
        >
          Create Account
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
          </span>
          <Button
            clear
            inline
            className="text-sm p-0 h-auto"
            onClick={handleSignIn}
          >
            Sign In
          </Button>
        </div>
      </Block>
    </ScreenWithBackground>
  );
}
