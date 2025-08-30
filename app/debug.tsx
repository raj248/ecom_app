import { GestureResponderEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/Button';

import ProductServices from '~/services/ProductServices';
import { BASE_URL } from '~/utils/api/base';

export default function Modal() {
  async function handlePress(event: GestureResponderEvent) {
    ProductServices.getShowingProducts();
    console.log('handlePress');
    console.log('Debug baseurl: ', BASE_URL);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Button title="GetShowProducts" onPress={handlePress} />
    </SafeAreaView>
  );
}
