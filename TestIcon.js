import React from 'react';
import { SafeAreaView } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

export default function TestIcon() {
  return (
    <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <FeatherIcon name="user" size={50} color="green" />
    </SafeAreaView>
  );
}