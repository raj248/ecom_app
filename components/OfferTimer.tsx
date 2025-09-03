import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

interface Props {
  expiryTimestamp: Date;
}

const OfferTimer: React.FC<Props> = ({ expiryTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

  function calcTimeLeft() {
    const diff = expiryTimestamp.getTime() - new Date().getTime();
    return {
      days: Math.max(Math.floor(diff / (1000 * 60 * 60 * 24)), 0),
      hours: Math.max(Math.floor((diff / (1000 * 60 * 60)) % 24), 0),
      minutes: Math.max(Math.floor((diff / 1000 / 60) % 60), 0),
      seconds: Math.max(Math.floor((diff / 1000) % 60), 0),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="mt-1 flex-row">
      {['days', 'hours', 'minutes', 'seconds'].map((unit, idx) => (
        <React.Fragment key={unit}>
          <Text className="mx-1 rounded bg-emerald-100 px-2 py-1 text-xs font-semibold text-gray-800">
            {timeLeft[unit as keyof typeof timeLeft]}
          </Text>
          {idx < 3 && <Text className="text-xs font-semibold">:</Text>}
        </React.Fragment>
      ))}
    </View>
  );
};

export default OfferTimer;
