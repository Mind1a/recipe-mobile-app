import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { getAuthErrorMessage } from "@/features/auth/utils/errors";

export default function SignUpScreen() {
  const { fetchStatus, signUp } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canStartSignUp = emailAddress.trim().length > 0 && password.length > 0;
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
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>
          {pendingVerification ? "Verify email" : "Create account"}
        </Text>
        <Text style={styles.subtitle}>
          {pendingVerification
            ? "Enter the verification code Clerk sent to your email."
            : "Create a Clerk account with email and password."}
        </Text>

        <View style={styles.form}>
          {pendingVerification ? (
            <>
              <Text style={styles.label}>Verification code</Text>
              <TextInput
                keyboardType="number-pad"
                onChangeText={setCode}
                placeholder="123456"
                placeholderTextColor="#8E8700"
                style={styles.input}
                textContentType="oneTimeCode"
                value={code}
              />
            </>
          ) : (
            <>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={setEmailAddress}
                placeholder="you@example.com"
                placeholderTextColor="#8E8700"
                style={styles.input}
                textContentType="emailAddress"
                value={emailAddress}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#8E8700"
                secureTextEntry
                style={styles.input}
                textContentType="newPassword"
                value={password}
              />
            </>
          )}

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Pressable
            disabled={
              pendingVerification
                ? !canVerify || isSubmitting || fetchStatus === "fetching"
                : !canStartSignUp || isSubmitting || fetchStatus === "fetching"
            }
            onPress={pendingVerification ? handleVerify : handleSignUp}
            style={({ pressed }) => [
              styles.primaryButton,
              (isSubmitting ||
                fetchStatus === "fetching" ||
                (pendingVerification ? !canVerify : !canStartSignUp)) &&
                styles.disabledButton,
              pressed && styles.pressedButton,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {pendingVerification ? "Verify" : "Sign up"}
              </Text>
            )}
          </Pressable>

          {pendingVerification ? (
            <Pressable
              disabled={isSubmitting}
              onPress={() => signUp.verifications.sendEmailCode()}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.secondaryButtonText}>Send a new code</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Link href="/sign-in" replace>
            <Text style={styles.link}>Sign in</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#2C2A28",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 0,
  },
  subtitle: {
    color: "#6B5F55",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  form: {
    gap: 12,
    marginTop: 32,
  },
  label: {
    color: "#2C2A28",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D8D0C7",
    borderRadius: 12,
    borderWidth: 1,
    color: "#2C2A28",
    fontSize: 16,
    height: 52,
    paddingHorizontal: 14,
  },
  errorText: {
    color: "#C8554C",
    fontSize: 13,
    lineHeight: 18,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#D86A25",
    borderRadius: 16,
    height: 54,
    justifyContent: "center",
    marginTop: 8,
  },
  secondaryButton: {
    alignItems: "center",
    height: 44,
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.55,
  },
  pressedButton: {
    opacity: 0.82,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  secondaryButtonText: {
    color: "#6B7F05",
    fontSize: 15,
    fontWeight: "700",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
  },
  linkText: {
    color: "#6B5F55",
    fontSize: 15,
  },
  link: {
    color: "#C97663",
    fontSize: 15,
    fontWeight: "700",
  },
});
