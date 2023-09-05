import React, { useEffect, useState } from "react";
import {
  Banner,
  Text,
  Tag,
  Image,
  Spinner,
  useApi,
  useTranslate,
  useTarget,
  useStorage,
  useCustomer,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';
import { Divider } from "@shopify/ui-extensions/checkout";

export default reactExtension(
  'purchase.checkout.contact.render-after',
  () => <Extension2 />,
);

function Extension2() {
  const [showError, setShowError] = useState(false);
  const storage = useStorage();

  const calculateTimeLeft = async () => {
    let endTime = await storage.read('endTime');
    let difference = endTime - new Date().getTime();
    
    let timeLeft = { minutes: 0, seconds: 0 };

    if (difference > 0) {
        timeLeft = {
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState({ minutes: 5, seconds: 0 });

  useEffect(() => {
    const calculateInitialTimeLeft = async () => {
      let endTime = await storage.read('endTime');
      let difference = endTime - new Date().getTime();
      
      let timeLeft = { minutes: 0, seconds: 0 };

      if (difference > 0) {
          timeLeft = {
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
          };
      }

      setTimeLeft(timeLeft);
    };

    calculateInitialTimeLeft();
  }, []);

  useEffect(() => {
    const initializeEndTime = async () => {
      let endTime = await storage.read('endTime');
      if (!endTime) {
        endTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
        await storage.write("endTime", endTime);
      }
    };

    initializeEndTime();

    const timer = setInterval(async () => {
      setTimeLeft(await calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  //show errors if it breaks
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <>
    <Text size="extraLarge">🔥</Text>
    <Text size="medium" emphasis="bold">  An item you have orders is in high demand. No worries, we have reserved your order. </Text>
   <Banner status="warning">Your order is reserved for {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds} minutes! </Banner>
    </>
  );
}