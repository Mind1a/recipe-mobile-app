import { Link } from "expo-router";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

export default function TermsOfServiceScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F4EEE6]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-12 pt-10"
      >
        <Link href="/sign-up" replace>
          <Text className="text-base font-bold text-[#C35E2D]">Back</Text>
        </Link>

        <Text className="mt-8 font-serif text-[34px] font-bold text-[#2C2A28]">
          Terms of Service
        </Text>
        <Text className="mt-3 text-base leading-[24px] text-[#6B5F55]">
          These temporary terms are here so the account creation flow can be
          tested while the final legal copy is prepared.
        </Text>

        <View className="mt-8 gap-5">
          <Text className="text-base leading-[24px] text-[#2C2A28]">
            By creating an account, you agree to use Sagzali respectfully and to
            share content that you have permission to publish.
          </Text>
          <Text className="text-base leading-[24px] text-[#2C2A28]">
            Do not upload harmful, illegal, misleading, or infringing content.
            Recipe images and profile content may be moderated in future app
            versions.
          </Text>
          <Text className="text-base leading-[24px] text-[#2C2A28]">
            Authentication is provided by Clerk. App-specific profile and recipe
            data will be handled by Sagzali according to the final privacy
            policy before production launch.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
