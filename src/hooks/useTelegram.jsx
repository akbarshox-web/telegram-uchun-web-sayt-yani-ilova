import { useEffect } from 'react';
import { tele } from '../utils/telegram.jsx';

export const useTelegram = () => {
  useEffect(() => {
    tele.ready();
    tele.expand();
  }, []);

  const onToggleButton = (show, text = '') => {
    if (show) {
      tele.MainButton.setParams({
        text: text,
        is_visible: true,
        color: '#2481cc'
      });
      tele.MainButton.show();
    } else {
      tele.MainButton.hide();
    }
  };

  return {
    tele,
    user: tele.initDataUnsafe?.user,
    queryId: tele.initDataUnsafe?.query_id,
    onToggleButton,
  };
};
