import { ComponentProps, forwardRef } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet } from 'react-native';
import { cn } from '~/lib/cn';

type FontAwesomeIconName = ComponentProps<typeof FontAwesome>['name'];

export const HeaderButton = forwardRef<
  typeof Pressable,
  { onPress?: () => void; icon?: FontAwesomeIconName }
>(({ onPress, icon }, ref) => {
  return (
    <Pressable onPress={onPress} className={cn('pr-4', icon === 'bug' && 'pl-4')}>
      {({ pressed }) => (
        <FontAwesome
          name={(icon as FontAwesomeIconName) ?? 'info-circle'}
          size={25}
          color="gray"
          style={[
            styles.headerRight,
            {
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        />
      )}
    </Pressable>
  );
});

HeaderButton.displayName = 'HeaderButton';

export const styles = StyleSheet.create({
  headerRight: {
    marginRight: 15,
  },
});
