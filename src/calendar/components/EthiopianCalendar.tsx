import React, { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import {
  ethiopicCalendar,
  toEthiopic,
  toGregorian,
} from '../../utils/Calendar/Convertor';
import { Header } from './header';
import { Day } from './day';
import { iterator } from '../../utils/generics';
import type { LanguageCode, Mode } from '../../utils/locals/types';
import { makeStyle } from './styles';
import type { SelectedDate, Theme } from 'src/types';

type EthiopianCalenderProps = {
  date?: { year: number; month: number; day: number };
  locale: LanguageCode;
  onDatePress: (date: SelectedDate) => void;
  theme?: Theme;
  onModeChange?: (mode: Mode) => void;
  onLanguageChange?: (language: LanguageCode) => void;
  hideHeaderButtons?: boolean;
  selectedDate: SelectedDate | undefined;
  setSelectedDate: React.Dispatch<
    React.SetStateAction<SelectedDate | undefined>
  >;
  minDate?: { year: number; month: number; day: number };
  maxDate?: { year: number; month: number; day: number };
};

export const EthiopianCalender: React.FC<EthiopianCalenderProps> = (props) => {
  const {
    date = {
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
    locale,
    onDatePress,
    onModeChange,
    onLanguageChange,
    theme,
    hideHeaderButtons,
    selectedDate,
    setSelectedDate,
    minDate,
    maxDate
  } = props;

  const styles = makeStyle(theme);

  const [_day, _setDay] = useState(
    selectedDate
      ? selectedDate.ethiopian.date
      : (toEthiopic(date.year, date.month, date.day).day as number)
  );

  const [month, setMonth] = useState(
    selectedDate
      ? selectedDate.ethiopian.month
      : (toEthiopic(date.year, date.month, date.day).month as number)
  );

  const [year, setYear] = useState(
    selectedDate
      ? selectedDate.ethiopian.year
      : (toEthiopic(date.year, date.month, date.day).year as number)
  );

  const firstDayOfTheMonthIndex = useMemo(() => {
    const {
      year: gregorianYear,
      month: gregorianMonth,
      day: gregorianDay,
    } = toGregorian(year, month, 1);
    return new Date(
      gregorianYear as number,
      (gregorianMonth as number) - 1,
      gregorianDay as number
    ).getDay();
  }, [month, year]);

  const lastDayOfTheMonthIndex = useMemo(() => {
    let lastDay = 30;
    if (month === 13) {
      if (ethiopicCalendar.isLeap(year)) {
        lastDay = 6;
      } else {
        lastDay = 5;
      }
    }

    const {
      year: gregorianYear,
      month: gregorianMonth,
      day: gregorianDay,
    } = toGregorian(year, month, lastDay);

    return new Date(
      gregorianYear as number,
      (gregorianMonth as number) - 1,
      gregorianDay as number
    ).getDay();
  }, [month, year]);

  const nextDays = useMemo(() => {
    return 7 - lastDayOfTheMonthIndex - 1;
  }, [lastDayOfTheMonthIndex]);

  const currentDay = useMemo(() => {
    return toEthiopic(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ).day as number;
  }, []);

  const currentMonthIndex = useMemo(() => {
    return toEthiopic(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ).month as number;
  }, []);

  const currentYear = useMemo(() => {
    return toEthiopic(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      new Date().getDate()
    ).year as number;
  }, []);

  const gotoToday = useCallback(() => {
    setMonth(currentMonthIndex)
    setYear(currentYear)
  }, [currentYear, currentMonthIndex])

  const next = useCallback(() => {
    const newMonth = month + 1;
    if (newMonth > 13) {
      setMonth(() => 1);
      setYear((previous: number) => previous + 1);
    } else {
      setMonth(() => newMonth);
    }
  }, [month]);

  const setYears = useCallback((year: any) => {
    setYear(year)
  }, [year]);

  const setMonths = useCallback((newMonth: any) => {
    setMonth(() => newMonth)
  }, [month]);

  const prev = useCallback(() => {
    const newMonth = month - 1;
    if (newMonth < 1) {
      setMonth(() => 13);
      setYear((previous: number) => previous - 1);
    } else {
      setMonth(() => newMonth);
    }
  }, [month]);

  const isBeforeMinDate = (day: number) => {
    if (!minDate) return false;
    const selectedDate = new Date(year, month - 1, day);
    const min = new Date(minDate.year, minDate.month - 1, minDate.day);
    return selectedDate < min;
  };

  const isAfterMaxDate = (day: number) => {
    if (!maxDate) return false;
    const selectedDate = new Date(year, month - 1, day);
    const max = new Date(maxDate.year, maxDate.month - 1, maxDate.day);
    return selectedDate > max;
  };

  const today = (iDate: number) => {
    return (
      iDate === currentDay &&
      month === currentMonthIndex &&
      year === currentYear
    );
  };

  const selected = (iDate: number) => {
    if (selectedDate) {
      return (
        selectedDate.ethiopian.date === iDate &&
        selectedDate.ethiopian.month === month &&
        selectedDate.ethiopian.year === year
      );
    }
    return false;
  };

  const handleDayPress = (pressedDay: number) => {
    const toGregorianDate = toGregorian(year, month, pressedDay);
    setSelectedDate({
      ethiopian: {
        date: pressedDay,
        month: month,
        year: year,
      },
      gregorian: {
        date: toGregorianDate.day as number,
        month: toGregorianDate.month as number,
        year: toGregorianDate.year as number,
      },
    });

    onDatePress({
      ethiopian: {
        date: pressedDay,
        month: month,
        year: year,
      },
      gregorian: {
        date: toGregorianDate.day as number,
        month: toGregorianDate.month as number,
        year: toGregorianDate.year as number,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header
        currentDay={currentDay}
        today={gotoToday}
        next={next}
        prev={prev}
        month={month}
        setMonths={setMonths}
        year={year}
        setYears={setYears}
        locals={locale}
        mode={'EC'}
        theme={theme}
        onModeChange={onModeChange}
        onLanguageChange={onLanguageChange}
        hideHeaderButtons={hideHeaderButtons}
      />
      <View style={[styles.daysWrapper]}>
        {/* EXTRA DAYS IN THE CALENDAR */}
        {iterator(firstDayOfTheMonthIndex).map((_item, i) => (
          <Day
            key={i}
            dayNumber={30 - firstDayOfTheMonthIndex + i + 1}
            extraDays
            theme={theme}
          />
        ))}
        {/* EXCEPT TO ጳጉሜ, EVERY OTHER MONTH HAS EXACTLY 30 DAYS.*/}
        {month !== 13
          ? iterator(30).map((_item, i) => (
            <Day
              key={i}
              dayNumber={i + 1}
              today={today(i + 1)}
              selected={selected(i + 1)}
              onPress={() => handleDayPress(i + 1)}
              theme={theme}
              disabled={isBeforeMinDate(i + 1) || isAfterMaxDate(i + 1)}
            />
          ))
          : // IF THE MONTH IS ጳጉሜ(13TH MONTH)
          // IF IT'S ETHIOPIAN LEAP YEAR, THE MONTH WILL 6 DAYS
          // ELSE IT WILL HAVE % DAYS
          iterator(ethiopicCalendar.isLeap(year) ? 6 : 5).map((_item, i) => (
            <Day
              key={i}
              dayNumber={i + 1}
              today={today(i + 1)}
              selected={selected(i + 1)}
              onPress={() => handleDayPress(i + 1)}
              theme={theme}
              disabled={isBeforeMinDate(i + 1) || isAfterMaxDate(i + 1)}
            />
          ))}
        {/* EXTRA DAYS IN THE CALENDAR */}
        {iterator(nextDays).map((_item, i) => (
          <Day key={i} dayNumber={i + 1} extraDays theme={theme} />
        ))}
      </View>
    </View>
  );
};
