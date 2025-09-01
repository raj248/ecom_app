// components/FeatureSection.tsx
import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { LocalizedString } from '~/models/Setting';

interface FeatureSectionProps {
  status?: boolean;
  title?: LocalizedString;
  description?: LocalizedString;
}

export default function FeatureSection({ status, title, description }: FeatureSectionProps) {
  if (!status) return null;

  return (
    <View className="m-4">
      {title && <Text className="text-xl font-bold text-gray-900">{title.en}</Text>}
      {description && <Text className="mt-1 text-sm text-gray-600">{description.en}</Text>}
    </View>
  );
}
