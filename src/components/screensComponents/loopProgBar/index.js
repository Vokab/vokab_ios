import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS_THEME} from '../../../constants';
import {useDispatch, useSelector} from 'react-redux';

const mapState = ({loopRedux}) => ({
  loopStep: loopRedux.loopStep,
  loopRoad: loopRedux.loopRoad,
});

const LoopProgBar = props => {
  const {darkMode} = props;
  const {loopStep, loopRoad} = useSelector(mapState);
  const backgroundColor = {
    backgroundColor: darkMode ? COLORS_THEME.bgWhite : COLORS_THEME.bgDark,
  };

  return (
    <View style={styles.footer}>
      <View style={[styles.progressBarParent, backgroundColor]}>
        <View
          style={[
            styles.progressBarChild,
            {width: `${(loopStep / loopRoad.length) * 100}%`},
          ]}></View>
      </View>
    </View>
  );
};

export default LoopProgBar;

const styles = StyleSheet.create({
  progressBarChild: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 8,
    backgroundColor: '#FF4C00',
    borderRadius: 6,
  },
  progressBarParent: {
    position: 'relative',
    width: 80,
    height: 8,
    // backgroundColor: '#FFFFFF',   // Changed To DarkLight Code
    borderRadius: 6,
  },
  footer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    //***************
    width: '100%',
    // backgroundColor: 'yellow',
    //***************
  },
});
