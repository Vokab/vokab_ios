import {StyleSheet, Text, View, Dimensions, Image} from 'react-native';
import React from 'react';
import Plan2 from '../../../../assets/plan2.png';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const HomeShape = () => {
  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          width: 40,
          height: 25,
          borderRadius: 20,
        }}></View>
      <Image source={Plan2} style={styles.imagePlaning} resizeMode={'repeat'} />
    </View>
  );
};

export default HomeShape;

const styles = StyleSheet.create({
  imagePlaning: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'absolute',
    left: windowWidth / 2 - 20,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: -1,
    elevation: -1,
    height: '100%',
    width: 15,
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
  },
});
