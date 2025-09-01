// components/PromotionBanner.tsx
import { View, TouchableOpacity } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { LocalizedString } from '~/models/Setting';

interface PromotionBannerProps {
  status?: boolean;
  title?: LocalizedString;
  description?: LocalizedString;
  buttonName?: LocalizedString;
  buttonLink?: string;
}

export default function PromotionBanner({
  status,
  title,
  description,
  buttonName,
  buttonLink,
}: PromotionBannerProps) {
  if (!status) return null;

  return (
    <View
      className="m-4 rounded-xl p-4"
      style={{ backgroundColor: '#fff2e5' }} // light background like screenshot
    >
      {title && <Text className="text-lg font-bold text-green-700">{title.en}</Text>}
      {description && <Text className="mt-1 text-sm text-gray-700">{description.en}</Text>}

      {buttonName && (
        <TouchableOpacity
          className="mt-3 self-start rounded-full bg-green-500 px-4 py-2"
          onPress={() => {
            // you can handle navigation here if using React Navigation
            console.log('Navigate to:', buttonLink);
          }}>
          <Text className="text-white">{buttonName.en}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
