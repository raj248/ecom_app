// components/Carousel.tsx
import { useMemo } from 'react';
import { View, FlatList, Image, Dimensions } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { LocalizedString, SliderSetting } from '~/models/Setting';

const { width } = Dimensions.get('window');

export interface Slide {
  img: string;
  title?: LocalizedString;
  description?: LocalizedString;
  button?: LocalizedString;
  link?: string;
}

interface CarouselProps {
  slider?: SliderSetting;
}

export default function Carousel({ slider }: CarouselProps) {
  const slides: Slide[] = useMemo(() => {
    if (!slider) return [];
    return [
      {
        img: slider.first_img!,
        title: slider.first_title,
        description: slider.first_description,
        button: slider.first_button,
        link: slider.first_link,
      },
      {
        img: slider.second_img!,
        title: slider.second_title,
        description: slider.second_description,
        button: slider.second_button,
        link: slider.second_link,
      },
      {
        img: slider.third_img!,
        title: slider.third_title,
        description: slider.third_description,
        button: slider.third_button,
        link: slider.third_link,
      },
      {
        img: slider.four_img!,
        title: slider.four_title,
        description: slider.four_description,
        button: slider.four_button,
        link: slider.four_link,
      },
      {
        img: slider.five_img!,
        title: slider.five_title,
        description: slider.five_description,
        button: slider.five_button,
        link: slider.five_link,
      },
    ].filter((slide) => Boolean(slide.img));
  }, [slider]);

  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={{ width, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: item.img }}
        style={{ width: width * 0.9, height: 200, borderRadius: 12 }}
        resizeMode="cover"
      />
      <View
        style={{
          position: 'absolute',
          left: 20,
          bottom: 20,
          right: 20,
          backgroundColor: 'rgba(0,0,0,0.3)',
          padding: 10,
          borderRadius: 8,
        }}>
        {item.title && <Text className="text-lg font-bold text-white">{item.title.en}</Text>}
        {item.description && <Text className="text-sm text-gray-200">{item.description.en}</Text>}
        {item.button && <Text className="mt-2 text-blue-300 underline">{item.button.en}</Text>}
      </View>
    </View>
  );

  return (
    <FlatList
      data={slides}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderSlide}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0, height: 220 }}
    />
  );
}
