import { router } from 'expo-router';
import { GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';
import { Text } from '~/components/nativewindui/Text';
import useGetSetting from '~/hooks/useGetSetting';

import ProductServices from '~/services/ProductServices';
import { BASE_URL } from '~/utils/api/base';

export default function Modal() {
  async function handlePress(event: GestureResponderEvent) {
    ProductServices.getShowingProducts();
    console.log('handlePress');
    console.log('Debug baseurl: ', BASE_URL);
  }
  const { storeCustomizationSetting } = useGetSetting();
  console.log(storeCustomizationSetting?.slider.first_description?.en);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="GetShowProducts" onPress={handlePress} />
      <Button title="Push to Search" onPress={() => router.push('/search')} />
    </SafeAreaView>
  );
}
