import React, { useState } from 'react';
import type { SelectedDate, Theme } from 'src/types';
import type { LanguageCode, Mode } from '../utils/locals/types';
import { EthiopianCalender } from './components/EthiopianCalendar';
import { GregorianCalendar } from './components/GregorianCalender';
import {toEthiopic} from '../utils/Calendar/Convertor';
type Props = {
  /**
   * set to 'EC' or 'GC' to switch between Gregorian calendar & Ethiopian calendar.
   * the default value is EC
   * @type {Mode}
   */
  mode?: Mode;
  /**
   * to change the language of days names and months names.
   * the default 'ENG' for Gregorian calendar & 'AMH' for Ethiopian calendar.
   * @type {LanguageCode}
   */
  locale?: LanguageCode;
  /**
   * to override default style
   *
   * @type {Theme}
   */
  theme?: Theme;
  /**
   * to hide switch mode & change language dropdowns.
   *
   * @type {boolean}
   */
  hideHeaderButtons?: boolean;
  /**
   * a callback gets executed when date press event is fired.
   *
   */
  onDatePress: (date: SelectedDate) => void;
  /**
   * a callback invoked on mode change.
   *
   */
  onModeChange?: (mode: Mode) => void;
  /**
   * a callback invoked on language change.
   *
   */
  onLanguageChange?: (language: LanguageCode) => void;
  /**
   * if this prop is not set, the calendar will start from current month.
   * ONLY GREGORIAN DATE
   * @type {Date}
   */
  initialDate?: Date;
  minDate?: { year: number; month: number; day: number };
};

export const Calendar: React.FC<Props> = React.memo((props) => {
  const {
    mode = 'EC',
    locale = 'AMH',
    onDatePress,
    onModeChange,
    onLanguageChange,
    hideHeaderButtons,
    theme,
    initialDate,
    minDate
  } = props;

  const [selectedDate, setSelectedDate] = useState<SelectedDate>();

  if (mode === 'EC')
    return (
      <EthiopianCalender
        date={
          initialDate && {
            year: initialDate.getFullYear(),
            month: initialDate.getMonth() + 1,
            day: initialDate.getDate(),
          }
        }
        locale={locale}
        onDatePress={onDatePress}
        theme={theme}
        onModeChange={onModeChange}
        onLanguageChange={onLanguageChange}
        hideHeaderButtons={hideHeaderButtons}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        minDate={toEthiopic(minDate?.year,minDate?.month,minDate?.day)}
      />
    );
  return (
    <GregorianCalendar
      date={
        initialDate && {
          year: initialDate.getFullYear(),
          month: initialDate.getMonth() + 1,
          day: initialDate.getDate(),
        }
      }
      minDate={minDate}
      onDatePress={onDatePress}
      theme={theme}
      onModeChange={onModeChange}
      hideHeaderButtons={hideHeaderButtons}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
});
