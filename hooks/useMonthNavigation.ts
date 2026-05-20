import { PanResponder } from 'react-native';
import { useBudgetStore, isMaxFutureMonthReached } from '../store/useBudgetStore';
import { useTranslation } from '../store/i18n';

export const useMonthNavigation = () => {
  const { activeMonth, setActiveMonth } = useBudgetStore();
  const { t } = useTranslation();

  const currentDateStr = new Date().toISOString().slice(0, 7);
  const isCurrentMonth = activeMonth === currentDateStr;
  const isPastMonth = activeMonth < currentDateStr;
  const isFutureMonth = activeMonth > currentDateStr;
  const isMaxFutureReached = isMaxFutureMonthReached(activeMonth, currentDateStr, 3);

  const handlePrevMonth = () => {
    const [year, month] = activeMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 2, 1);
    setActiveMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = activeMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month), 1);
    setActiveMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
  };

  const handleToday = () => setActiveMonth(currentDateStr);

  const getMonthName = (monthStr: string) => {
    const num = parseInt(monthStr.split('-')[1]);
    const months = [
      t('months.jan'), t('months.feb'), t('months.mar'), t('months.apr'),
      t('months.may'), t('months.jun'), t('months.jul'), t('months.aug'),
      t('months.sep'), t('months.oct'), t('months.nov'), t('months.dec')
    ];
    return `${months[num - 1]} ${monthStr.split('-')[0]}`;
  };

  const swipePanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dy) < 40,
    onPanResponderRelease: (_, g) => {
      if (g.dx < -30) {
        if (!isMaxFutureReached) handleNextMonth();
      } else if (g.dx > 30) {
        handlePrevMonth();
      }
    },
  });

  return {
    activeMonth,
    currentDateStr,
    isCurrentMonth,
    isPastMonth,
    isFutureMonth,
    isMaxFutureReached,
    handlePrevMonth,
    handleNextMonth,
    handleToday,
    getMonthName,
    swipePanResponder,
  };
};
