import { useSignIn } from "@clerk/expo";
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

export default function SignInScreen() {
  const { fetchStatus, signIn } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Use your Clerk account to continue.</Text>

        <View style={styles.form}>
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
            textContentType="password"
            value={password}
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <Pressable
            disabled={!canSubmit || isSubmitting || fetchStatus === "fetching"}
            onPress={handleSignIn}
            style={({ pressed }) => [
              styles.primaryButton,
              (!canSubmit || isSubmitting || fetchStatus === "fetching") &&
                styles.disabledButton,
              pressed && styles.pressedButton,
            ]}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Continue</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Do not have an account? </Text>
          <Link href="/sign-up" replace>
            <Text style={styles.link}>Sign up</Text>
          </Link>
        </View>
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
