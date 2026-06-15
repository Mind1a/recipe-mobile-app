import { useAuth, useClerk, useUser } from "@clerk/expo";
import { type Href, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";

const pastaImage = require("../../design/auth-design/background-images-for-screens/bg-image-forgot-password--create-account-left-bottom--auth-page--home-page.png");
const pepperImage = require("../../design/auth-design/background-images-for-screens/background-2.png");
const logoImage = require("../../design/auth-design/background-images-for-screens/logo.png");

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF7F2]">
        <ActivityIndicator color="#C97663" size="large" />
      </View>
    );
  }

  if (isSignedIn) {
    return (
      <SafeAreaView className="flex-1 justify-center bg-[#FAF7F2] px-6">
        <Text className="text-sm font-bold uppercase text-[#C97663]">
          Signed in with Clerk
        </Text>
        <Text className="mt-2.5 text-[34px] font-bold text-[#2C2A28]">
          Welcome!
        </Text>
        <Text className="mt-2 text-base leading-[23px] text-[#6B5F55]">
          {user?.primaryEmailAddress?.emailAddress || user?.id}
        </Text>
        <Pressable
          className="mt-7 h-[54px] items-center justify-center rounded-2xl bg-[#2C2A28] active:opacity-80"
          onPress={() => signOut()}
        >
          <Text className="text-[17px] font-bold text-white">Sign out</Text>
        </Pressable>
      </SafeAreaView>
    );
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
        className="absolute -left-[67px] bottom-6 h-[265px] w-[265px]"
      />
      <Image
        source={pepperImage}
        resizeMode="contain"
        className="absolute -right-[50px] bottom-28 h-[180px] w-[180px]"
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center px-6">
          <View className="z-10 mt-56 items-center">
            <Image
              source={logoImage}
              resizeMode="contain"
              className="h-[82px] w-[76px]"
            />
            <Text className="mt-[13px] font-serif text-[39px] font-bold text-[#2C2A28]">
              Sagzali
            </Text>
          </View>

          <View className="z-10 mt-[62px] items-center">
            <Text className="font-serif text-[32px] font-bold leading-[40px] text-[#2C2A28]">
              Share recipes.
            </Text>
            <Text className="font-serif text-[32px] font-bold leading-[40px] text-[#2C2A28]">
              Inspire moments.
            </Text>
            <Text className="mt-6 text-center text-base leading-[25px] text-[#6B5F55]">
              Join a community of home cooks
            </Text>
            <Text className="text-center text-base leading-[25px] text-[#6B5F55]">
              and food lovers.
            </Text>
          </View>

          <View className="absolute bottom-[58px] z-10 w-[250px] items-center">
            <Pressable
              className="h-14 w-full items-center justify-center rounded-[20px] bg-[#D86A25] active:opacity-80"
              onPress={() => router.push("/sign-up" as Href)}
            >
              <Text className="text-lg font-bold text-white">Get Started</Text>
            </Pressable>

            <Pressable
              className="mt-[30px] flex-row items-center justify-center active:opacity-80"
              onPress={() => router.push("/sign-in" as Href)}
            >
              <Text className="text-base text-[#3F3F3F]">
                Already have an account?{" "}
              </Text>
              <Text className="text-base font-bold text-[#C35E2D]">Log in</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
