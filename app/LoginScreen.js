// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth } from '../constants/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Login successfully');
        router.push('/ProductScreen');
      })
      .catch((error) => {
        console.error('Login failed', error);
        Alert.alert('Login failed', error.message);
      });
  };

  const handleAddAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Account created successfully');
        return signOut(auth);
      })
      .catch((error) => {
        Alert.alert('Error creating account', error.message);
      });
  };

  return (
    <View style={styles1.container}>
      <Text style={styles1.label}>Email:</Text>
      <TextInput
        style={styles1.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
        placeholderTextColor="#888"
      />
      <Text style={styles1.label}>Password:</Text>
      <TextInput
        style={styles1.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password"
        placeholderTextColor="#888"
        secureTextEntry
      />
      <View style={styles1.buttonContainer}>
        <Button title="Login" onPress={handleLogin} color="#4CAF50" />
        <Button title="Add Account" onPress={handleAddAccount} color="#2196F3" />
      </View>
    </View>
  );
};

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 25,
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '90%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 10,
  },
});

export default LoginScreen;
