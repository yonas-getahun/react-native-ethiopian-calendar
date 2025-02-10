import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, Modal } from 'react-native';
import type { LanguageCode, Mode } from '../../../utils/locals/types';
import { getDaysNameOfTheWeek, getMonthsName } from '../../../utils/locals';
import { makeStyle } from './style';
import type { Theme } from '../../../types';
import { LocalsDropDown, SwitchMode } from '../../../commons/components';

type DayProps = {
  currentDay: number;
  today: () => void;
  prev: () => void;
  next: () => void;
  month: number;
  setMonths: any;
  year: number;
  setYears: any;
  locals: LanguageCode;
  mode: Mode;
  theme?: Theme;
  onModeChange?: (mode: Mode) => void;
  onLanguageChange?: (language: LanguageCode) => void;
  hideHeaderButtons?: boolean;
};

export const Header: React.FC<DayProps> = React.memo((props) => {
  const {
    currentDay,
    today,
    prev,
    next,
    month,
    setMonths,
    year,
    setYears,
    locals = 'AMH',
    mode,
    theme,
    onModeChange,
    onLanguageChange,
    hideHeaderButtons,
  } = props;
  const styles = makeStyle(theme);

  // Generate years based on the current start year
  const getYears = (yearStart: any) => {
    let start = yearStart <= 1000 ? 1000 : yearStart;
    const years = [];
    for (let i = 0; i < 20; i++) {
      const value = start + i;
      years.push(value);
    }

    return years;
  };

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const YearPicker = ({ initialYear, onYearSelect }: any) => {
    const [currentStartYear, setCurrentStartYear] = useState(initialYear);
    const years = getYears(currentStartYear);

    const prev = () => {
      setCurrentStartYear((prevYear: any) => prevYear - 20);
    };

    const next = () => {
      setCurrentStartYear((prevYear: any) => prevYear + 20);
    };

    return (
      <View>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={() => setShowYearPicker(false)}>
            <Image
              source={require('../../images/close-circle.png')}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.pickerContainer}>
          <TouchableOpacity onPress={prev} style={styles.arrow}>
            <Image
              source={require('../../images/left_icon.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
          <Text style={[styles.titleText, { marginTop: 5 }]}>
            {currentStartYear} - {currentStartYear + 19}
          </Text>
          <TouchableOpacity onPress={next} style={styles.arrow}>
            <Image
              source={require('../../images/right_icon.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.pickerItemContainer}>
          {years.map((year: any) => (
            <View key={year} style={styles.pickedItem}>
              <TouchableOpacity
                style={styles.pickedItemContainer}
                onPress={() => onYearSelect(year)}
                accessibilityLabel={`Select year ${year}`}
              >
                <Text style={styles.titleText}>{year}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const MonthPicker = ({ initialYear, onMonthSelect }: any) => {
    const [currentStartYear, setCurrentStartYear] = useState(initialYear);

    const prev = () => {
      setCurrentStartYear((prevYear: any) => prevYear - 1);
    };

    const next = () => {
      setCurrentStartYear((prevYear: any) => prevYear + 1);
    };
    return (
      <View>
        <View style={styles.closeContainer}>
          <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
            <Image
              source={require('../../images/close-circle.png')}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.monthPicker}>
          <TouchableOpacity onPress={prev} style={styles.arrow}>
            <Image
              source={require('../../images/left_icon.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dropDown}
            onPress={() => setShowYearPicker(true)}
          >
            <Text style={styles.titleText}>{currentStartYear}</Text>
            <View style={{ marginRight: 5 }}>
              <Image
                source={require('../../images/dropdown_down.png')}
                style={styles.dropdownIconStyle}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={next} style={styles.arrow}>
            <Image
              source={require('../../images/right_icon.png')}
              style={styles.arrowImage}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.pickerItemContainer}>
          {getMonthsName({ locals, mode }).map((month: any, index) => (
            <View key={index} style={styles.pickedItem}>
              <TouchableOpacity
                style={styles.pickedItemContainer}
                onPress={() => onMonthSelect(month, index)}
                accessibilityLabel={`Select year ${month}`}
              >
                <Text style={styles.titleText}>{month}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* EXTRA HEADER */}
      {!hideHeaderButtons && (
        <View style={styles.headerButtonsWrapper}>
          <SwitchMode theme={theme} mode={mode} onModeChange={onModeChange} />
          <View style={styles.todayButton}>
            <TouchableOpacity onPress={today} activeOpacity={0.9}>
              <Text style={styles.todayText}>{currentDay}</Text>
            </TouchableOpacity>
          </View>
          {mode === 'EC' && (
            <LocalsDropDown
              theme={theme}
              locals={locals}
              onLanguageChange={onLanguageChange}
            />
          )}
        </View>
      )}

      <View style={styles.mainHeader}>
        {/* BACKWARD THE MONTH */}
        <TouchableOpacity onPress={prev} style={styles.arrow}>
          <Image
            source={require('../../images/left_icon.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <View style={styles.dropDown}>
            <TouchableOpacity
              onPress={() => setShowMonthPicker(true)}
              style={{ flexDirection: 'row' }}
            >
              <Text style={styles.titleText}>
                {getMonthsName({ locals, mode })[month - 1]}
              </Text>
              <View style={{ marginTop: 10, marginRight: 5 }}>
                <Image
                  source={require('../../images/dropdown_down.png')}
                  style={styles.dropdownIconStyle}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.space} />
          <View style={styles.dropDown}>
            <TouchableOpacity
              onPress={() => setShowYearPicker(true)}
              style={{ flexDirection: 'row' }}
            >
              <Text style={styles.titleText}>{year}</Text>
              <View style={{ marginTop: 10, marginRight: 5 }}>
                <Image
                  source={require('../../images/dropdown_down.png')}
                  style={styles.dropdownIconStyle}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* FORWARD THE MONTH */}
        <TouchableOpacity onPress={next} style={styles.arrow}>
          <Image
            source={require('../../images/right_icon.png')}
            style={styles.arrowImage}
          />
        </TouchableOpacity>
      </View>

      {/* LIST OF DAYS OF THE WEEK */}
      <View style={styles.daysHeader}>
        {getDaysNameOfTheWeek(locals).map((item, i) => (
          <Text style={styles.dayText} key={i} numberOfLines={1}>
            {item}
          </Text>
        ))}
      </View>
      <Modal
        visible={showMonthPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalItemContainer}>
            <MonthPicker
              initialYear={year}
              onMonthSelect={(month: any, index: number) => {
                console.log(month, index + 1);
                setMonths(index + 1);
                setShowMonthPicker(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        visible={showYearPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalItemContainer}>
            <YearPicker
              initialYear={year}
              onYearSelect={(year: any) => {
                setYears(year);
                setShowYearPicker(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});
