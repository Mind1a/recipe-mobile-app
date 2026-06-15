import { useSignIn } from "@clerk/expo";
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

export default function SignInScreen() {
  const { fetchStatus, signIn } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFetching = isSubmitting || fetchStatus === "fetching";
  const canSubmit = emailAddress.trim().length > 0 && password.length > 0;

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

  async function handleSignIn() {
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(undefined);

    try {
      const { error } = await signIn.password({
        emailAddress: emailAddress.trim(),
        password,
      });

      if (error) {
        setErrorMessage(getAuthErrorMessage(error));
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: navigateHome,
        });
        return;
      }

      setErrorMessage("This account needs another verification step.");
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 overflow-hidden bg-[#F4EEE6]">
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
                Welcome back
              </Text>
              <Text className="mt-3 text-center text-base text-[#4F4A45]">
                Log in to continue to your account.
              </Text>
            </View>

            <View className="mt-[34px] w-full">
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
                placeholder="Enter your password"
                placeholderTextColor="#A8A19A"
                secureTextEntry
                className="h-[53px] rounded-xl border border-[#CFC7BE] bg-transparent px-5 text-base text-[#2C2A28]"
                textContentType="password"
                value={password}
              />

              <Pressable className="mt-4 self-start active:opacity-80">
                <Text className="text-[15px] font-bold text-[#C35E2D]">
                  Forgot password?
                </Text>
              </Pressable>

              {errorMessage ? (
                <Text className="mt-3 text-[13px] leading-[18px] text-[#C8554C]">
                  {errorMessage}
                </Text>
              ) : null}

              <Pressable
                disabled={!canSubmit || isFetching}
                onPress={handleSignIn}
                className={`mt-[39px] h-[56px] w-full items-center justify-center rounded-[20px] bg-[#D86A25] active:opacity-80 ${
                  !canSubmit || isFetching ? "opacity-80" : ""
                }`}
              >
                {isFetching ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text className="text-lg font-bold text-white">Log In</Text>
                )}
              </Pressable>
            </View>

            <View className="absolute bottom-[69px] flex-row items-center justify-center">
              <Text className="text-base text-[#2C2A28]">
                Do not have an account?{" "}
              </Text>
              <Link href="/sign-up" replace>
                <Text className="text-base font-bold text-[#C35E2D]">
                  Sign up
                </Text>
              </Link>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
