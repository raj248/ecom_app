import { View } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { LocalizedString } from '~/models/Setting';

interface Props {
  status?: boolean;
  title?: LocalizedString;
  description?: LocalizedString;
}

export default function PopularProductsSection({ status, title, description }: Props) {
  if (!status) return null;

  return (
    <View className="px-4 py-6">
      <Text className="text-lg font-bold text-gray-900">{title?.en}</Text>
      {description?.en ? (
        <Text className="mt-2 text-sm text-gray-600">{description.en}</Text>
      ) : null}
    </View>
  );
}
