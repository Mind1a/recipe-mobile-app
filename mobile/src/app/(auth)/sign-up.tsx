import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import { getAuthErrorMessage } from "@/features/auth/utils/errors";

const pastaImage = require("../../../design/auth-design/background-images-for-screens/bg-image-forgot-password--create-account-left-bottom--auth-page--home-page.png");
const pepperImage = require("../../../design/auth-design/background-images-for-screens/background-2.png");
const logoImage = require("../../../design/auth-design/background-images-for-screens/logo.png");

export default function SignUpScreen() {
  const { fetchStatus, signUp } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFetching = isSubmitting || fetchStatus === "fetching";
  const hasRequiredFields =
    emailAddress.trim().length > 0 && password.length > 0;
  const canStartSignUp = hasRequiredFields && acceptedTerms;
  const canVerify = code.trim().length > 0;

  function navigateHome({
    decorateUrl,
    session,
  }: {
    decorateUrl: (url: string) => string;
    session: { currentTask?: unknown } | null;
  }) {
    if (session?.currentTask) {
      setErrorMessage("Please complete the remaining Clerk session task.");
      return;
    }

    router.replace(decorateUrl("/") as Href);
  }

  async function handleSignUp() {
    if (!canStartSignUp) {
      if (!acceptedTerms) {
        setErrorMessage("Please accept the Terms of Service to continue.");
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      const { error } = await signUp.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        return;
      }

      await signUp.verifications.sendEmailCode();

      setPendingVerification(true);
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify() {
    if (!canVerify) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      await signUp.verifications.verifyEmailCode({
        code: code.trim(),
      });

      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: navigateHome,
        });
        return;
      }

      setErrorMessage("Sign-up is not complete yet. Please try again.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 overflow-hidden bg-[#FAF7F2]">
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Image
        source={pastaImage}
        resizeMode="contain"
        className="absolute -left-[74px] bottom-[106px] h-[230px] w-[230px]"
      />
      <Image
        source={pepperImage}
        resizeMode="contain"
        className="absolute -right-[54px] bottom-[126px] h-[166px] w-[166px]"
      />

      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="flex-1 items-center px-[74px]">
            <View className="mt-[102px] items-center">
              <Image
                source={logoImage}
                resizeMode="contain"
                className="h-[58px] w-[54px]"
              />
              <Text className="mt-1 font-serif text-[30px] font-bold text-[#2C2A28]">
                Sagzali
              </Text>
            </View>

            <View className="mt-[50px] items-center">
              <Text className="text-center font-serif text-[34px] font-bold text-[#2C2A28]">
                {pendingVerification ? "Verify email" : "Create account"}
              </Text>
              <Text className="mt-3 text-center text-base leading-[23px] text-[#4F4A45]">
                {pendingVerification
                  ? "Enter the code sent to your email."
                  : "Join our community of home cooks."}
              </Text>
            </View>

            <View className="mt-[34px] w-full">
              {pendingVerification ? (
                <>
                  <Text className="mb-2 text-[15px] font-bold text-[#2C2A28]">
                    Verification code
                  </Text>
                  <TextInput
                    keyboardType="number-pad"
                    onChangeText={setCode}
                    placeholder="123456"
                    placeholderTextColor="#A8A19A"
                    className="h-[53px] rounded-xl border border-[#CFC7BE] bg-transparent px-5 text-base text-[#2C2A28]"
                    textContentType="oneTimeCode"
                    value={code}
                  />
                </>
              ) : (
                <>
                  <Text className="mb-2 text-[15px] font-bold text-[#2C2A28]">
                    Email
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={setEmailAddress}
                    placeholder="Enter your email"
                    placeholderTextColor="#A8A19A"
                    className="h-[53px] rounded-xl border border-[#CFC7BE] bg-transparent px-5 text-base text-[#2C2A28]"
                    textContentType="emailAddress"
                    value={emailAddress}
                  />

                  <Text className="mb-2 mt-[28px] text-[15px] font-bold text-[#2C2A28]">
                    Password
                  </Text>
                  <TextInput
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    placeholderTextColor="#A8A19A"
                    secureTextEntry
                    className="h-[53px] rounded-xl border border-[#CFC7BE] bg-transparent px-5 text-base text-[#2C2A28]"
                    textContentType="newPassword"
                    value={password}
                  />

                  <View className="mt-[29px] flex-row items-start">
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: acceptedTerms }}
                      className={`mt-1 h-7 w-7 items-center justify-center rounded-md border-2 ${
                        acceptedTerms
                          ? "border-[#C35E2D] bg-[#C35E2D]"
                          : "border-[#C35E2D] bg-[#FAF7F2]"
                      }`}
                      onPress={() => setAcceptedTerms((value) => !value)}
                    >
                      {acceptedTerms ? (
                        <Text className="text-base font-bold leading-5 text-white">
                          ✓
                        </Text>
                      ) : null}
                    </Pressable>

                    <View className="ml-4 flex-1">
                      <Text className="text-base leading-[25px] text-[#2C2A28]">
                        I agree to the{" "}
                        <Link href="/terms-of-service" asChild>
                          <Text className="font-bold text-[#C35E2D]">
                            Terms of Service
                          </Text>
                        </Link>
                      </Text>
                      <Text className="text-base leading-[25px] text-[#2C2A28]">
                        and{" "}
                        <Text className="font-bold text-[#C35E2D]">
                          Privacy Policy
                        </Text>
                      </Text>
                    </View>
                  </View>
                </>
              )}

              {errorMessage ? (
                <Text className="mt-3 text-[13px] leading-[18px] text-[#C8554C]">
                  {errorMessage}
                </Text>
              ) : null}

              <Pressable
                disabled={
                  pendingVerification
                    ? !canVerify || isFetching
                    : !hasRequiredFields || isFetching
                }
                onPress={pendingVerification ? handleVerify : handleSignUp}
                className={`h-[56px] w-full items-center justify-center rounded-[20px] bg-[#D86A25] active:opacity-80 ${
                  pendingVerification ? "mt-[34px]" : "mt-[32px]"
                } ${
                  (pendingVerification ? !canVerify : !hasRequiredFields) ||
                  isFetching
                    ? "opacity-55"
                    : ""
                }`}
              >
                {isFetching ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-lg font-bold text-white">
                    {pendingVerification ? "Verify" : "Create Account"}
                  </Text>
                )}
              </Pressable>

              {pendingVerification ? (
                <Pressable
                  disabled={isFetching}
                  onPress={() => signUp.verifications.sendEmailCode()}
                  className="mt-4 h-11 items-center justify-center active:opacity-80"
                >
                  <Text className="text-[15px] font-bold text-[#6B7F05]">
                    Send a new code
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View className="absolute bottom-[69px] flex-row items-center justify-center">
              <Text className="text-base text-[#2C2A28]">
                Already have an account?{" "}
              </Text>
              <Link href="/sign-in" replace>
                <Text className="text-base font-bold text-[#C35E2D]">
                  Log in
                </Text>
              </Link>
            </View>

            <View nativeID="clerk-captcha" />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
