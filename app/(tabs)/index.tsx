import React, { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';

export default function HomeScreen() {
  // State để lưu trữ thông tin đăng nhập và OTP
  const [input, setInput] = useState(''); // Email hoặc số điện thoại
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isUsingOtp, setIsUsingOtp] = useState(false);
  const [countryCode, setCountryCode] = useState('+84'); // Mã quốc gia mặc định

  // Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    redirectUri: 'YOUR_REDIRECT_URI',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // Xử lý thông tin xác thực từ Google (authentication.accessToken)
      alert('Đăng nhập Google thành công!');
    }
  }, [response]);

  // Hàm xử lý đăng nhập bằng email hoặc số điện thoại và mật khẩu
  const handleLogin = () => {
    if (!input || (!isUsingOtp && !password)) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (isUsingOtp) {
      alert(`Đăng nhập bằng OTP cho: ${input}`);
    } else {
      alert(`Đăng nhập với: ${input}`);
    }
  };

  // Hàm gửi mã OTP
  const sendOtp = () => {
    if (!input) {
      alert('Vui lòng nhập email hoặc số điện thoại!');
      return;
    }

    if (input.match(/^[0-9]+$/)) {
      alert(`Mã OTP sẽ được gửi đến số: ${countryCode}${input}`);
    } else {
      alert(`Mã OTP sẽ được gửi đến email: ${input}`);
    }

    // Gửi mã OTP qua API
    setIsOtpSent(true);
  };

  // Hàm xác minh OTP
  const verifyOtp = () => {
    if (!otp) {
      alert('Vui lòng nhập mã OTP!');
      return;
    }
    // Thêm logic xác minh OTP (API call) ở đây
    alert(`Xác minh OTP thành công cho: ${input}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      {isUsingOtp && (
        <View style={styles.inputContainer}>
          <Text>Chọn mã quốc gia</Text>
          <Picker
            selectedValue={countryCode}
            style={styles.picker}
            onValueChange={(itemValue) => setCountryCode(itemValue)}
          >
            <Picker.Item label="Việt Nam (+84)" value="+84" />
            <Picker.Item label="Hoa Kỳ (+1)" value="+1" />
            <Picker.Item label="Ấn Độ (+91)" value="+91" />
            <Picker.Item label="Nhật Bản (+81)" value="+81" />
            <Picker.Item label="Hàn Quốc (+82)" value="+82" />
          </Picker>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email hoặc Số điện thoại"
          keyboardType="email-address"
          value={input}
          onChangeText={setInput}
        />

        {!isUsingOtp && (
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        )}

        {isUsingOtp && isOtpSent && (
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
          />
        )}
      </View>

      {!isUsingOtp ? (
        <Button title="Đăng nhập bằng mật khẩu" onPress={handleLogin} />
      ) : isOtpSent ? (
        <Button title="Xác minh OTP" onPress={verifyOtp} />
      ) : (
        <Button title="Gửi mã OTP" onPress={sendOtp} />
      )}

      <View style={styles.divider} />

      <Button
        title="Đăng nhập với Google"
        onPress={() => {
          promptAsync();
        }}
        disabled={!request}
      />

      <View style={styles.divider} />

      <Button
        title={`Chuyển sang đăng nhập bằng ${isUsingOtp ? 'mật khẩu' : 'OTP'}`}
        onPress={() => {
          setIsUsingOtp(!isUsingOtp);
          setIsOtpSent(false);
          setOtp('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
  },
  divider: {
    height: 16,
  },
});
