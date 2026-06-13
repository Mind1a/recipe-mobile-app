import { useClerk, useAuth, useUser } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const pastaImage = require("../../design/auth-design/background-images-for-screens/bg-image-forgot-password--create-account-left-bottom--auth-page--home-page.png");
const pepperImage = require("../../design/auth-design/background-images-for-screens/background-2.png");

const COLORS = {
  background: "#FAF7F2",
  textPrimary: "#2C2A28",
  textMuted: "#6B5F55",
  terracotta: "#C97663",
  warmGold: "#D89E5E",
  softCream: "#F4EEE6",
};

const serifFont = Platform.select({
  ios: "Georgia",
  android: "serif",
  default: "serif",
});

export default function Index() {
  const { width, height } = useWindowDimensions();
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const scale = Math.min(width / 393, height / 852);

  if (!isLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={COLORS.terracotta} size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return (
      <SafeAreaView style={styles.signedInScreen}>
        <Text style={styles.signedInEyebrow}>Signed in with Clerk</Text>
        <Text style={styles.signedInTitle}>Welcome!</Text>
        <Text style={styles.signedInText}>
          {user?.primaryEmailAddress?.emailAddress || user?.id}
        </Text>
        <Pressable
          onPress={() => signOut()}
          style={({ pressed }) => [
            styles.signOutButton,
            pressed && styles.pressedButton,
          ]}
        >
          <Text style={styles.signOutButtonText}>Sign out</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <Image
        source={pastaImage}
        resizeMode="contain"
        style={[
          styles.pastaImage,
          {
            width: 265 * scale,
            height: 265 * scale,
            left: -67 * scale,
            bottom: 24 * scale,
          },
        ]}
      />
      <Image
        source={pepperImage}
        resizeMode="contain"
        style={[
          styles.pepperImage,
          {
            width: 180 * scale,
            height: 180 * scale,
            right: -50 * scale,
            bottom: 112 * scale,
          },
        ]}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={[styles.brandBlock, { marginTop: 224 * scale }]}>
            <TemporaryLogo scale={scale} />
            <Text style={[styles.brandName, { fontSize: 39 * scale }]}>
              Sagzali
            </Text>
          </View>

          <View style={[styles.copyBlock, { marginTop: 62 * scale }]}>
            <Text style={[styles.headline, { fontSize: 32 * scale }]}>
              Share recipes.
            </Text>
            <Text style={[styles.headline, { fontSize: 32 * scale }]}>
              Inspire moments.
            </Text>
            <Text style={[styles.subtitle, { fontSize: 16 * scale }]}>
              Join a community of home cooks
            </Text>
            <Text style={[styles.subtitle, { fontSize: 16 * scale }]}>
              and food lovers.
            </Text>
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={() => router.push("/sign-up" as Href)}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/sign-in" as Href)}
              style={({ pressed }) => [
                styles.loginRow,
                pressed && styles.pressedButton,
              ]}
            >
              <Text style={styles.loginText}>Already have an account? </Text>
              <Text style={styles.loginLink}>Log in</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function TemporaryLogo({ scale }: { scale: number }) {
  return (
    <View style={[styles.logo, { width: 66 * scale, height: 70 * scale }]}>
      <View style={[styles.logoSideLine, { height: 50 * scale }]} />
      <View style={styles.fork}>
        <View style={styles.forkTines}>
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
          <View style={styles.forkTine} />
        </View>
        <View style={styles.forkNeck} />
        <View style={styles.forkHandle} />
      </View>
      <View style={styles.logoSprig}>
        <View style={styles.leaf} />
        <View style={[styles.leaf, styles.leafRight]} />
        <View style={[styles.leaf, styles.leafSmall]} />
      </View>
      <View style={styles.logoRuleLong} />
      <View style={styles.logoRuleShort} />
      <View style={styles.logoBookmark} />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    alignItems: "center",
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  pastaImage: {
    position: "absolute",
    zIndex: 0,
  },
  pepperImage: {
    position: "absolute",
    zIndex: 0,
  },
  brandBlock: {
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    borderWidth: 2.5,
    borderColor: "#3B3026",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(250, 247, 242, 0.7)",
  },
  logoSideLine: {
    position: "absolute",
    left: 7,
    top: 7,
    width: 3,
    borderRadius: 999,
    backgroundColor: COLORS.warmGold,
  },
  fork: {
    width: 20,
    height: 45,
    marginTop: -4,
    alignItems: "center",
  },
  forkTines: {
    width: 20,
    height: 19,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  forkTine: {
    width: 3,
    height: 19,
    borderRadius: 999,
    backgroundColor: COLORS.textPrimary,
  },
  forkNeck: {
    width: 13,
    height: 8,
    marginTop: -2,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: COLORS.textPrimary,
  },
  forkHandle: {
    width: 6,
    height: 24,
    borderRadius: 999,
    backgroundColor: COLORS.textPrimary,
  },
  logoSprig: {
    position: "absolute",
    right: 5,
    top: 24,
    width: 20,
    height: 32,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.warmGold,
    transform: [{ rotate: "-18deg" }],
  },
  leaf: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 11,
    height: 7,
    borderTopLeftRadius: 9,
    borderBottomRightRadius: 9,
    backgroundColor: COLORS.warmGold,
    transform: [{ rotate: "30deg" }],
  },
  leafRight: {
    left: 7,
    top: 13,
    transform: [{ rotate: "-35deg" }],
  },
  leafSmall: {
    left: 1,
    top: 24,
    width: 9,
    height: 6,
  },
  logoRuleLong: {
    position: "absolute",
    right: 4,
    bottom: 13,
    width: 28,
    height: 2,
    borderRadius: 999,
    backgroundColor: COLORS.textPrimary,
  },
  logoRuleShort: {
    position: "absolute",
    right: 4,
    bottom: 7,
    width: 37,
    height: 2,
    borderRadius: 999,
    backgroundColor: COLORS.textPrimary,
  },
  logoBookmark: {
    position: "absolute",
    left: 12,
    bottom: -8,
    width: 13,
    height: 21,
    backgroundColor: COLORS.warmGold,
    transform: [{ skewY: "-20deg" }],
  },
  brandName: {
    marginTop: 13,
    color: COLORS.textPrimary,
    fontFamily: serifFont,
    fontWeight: "700",
    letterSpacing: 0,
  },
  copyBlock: {
    alignItems: "center",
    zIndex: 1,
  },
  headline: {
    color: COLORS.textPrimary,
    fontFamily: serifFont,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: 0,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.textMuted,
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    left: 72,
    right: 72,
    bottom: 58,
    zIndex: 1,
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D86A25",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0,
  },
  loginRow: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "#3F3F3F",
    fontSize: 16,
    letterSpacing: 0,
  },
  loginLink: {
    color: "#C35E2D",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0,
  },
  signedInScreen: {
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  signedInEyebrow: {
    color: COLORS.terracotta,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  signedInTitle: {
    color: COLORS.textPrimary,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0,
    marginTop: 10,
  },
  signedInText: {
    color: COLORS.textMuted,
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  signOutButton: {
    alignItems: "center",
    backgroundColor: COLORS.textPrimary,
    borderRadius: 16,
    height: 54,
    justifyContent: "center",
    marginTop: 28,
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  pressedButton: {
    opacity: 0.82,
  },
});
