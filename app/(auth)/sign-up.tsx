import { router } from 'expo-router'
import { Button, Text, View } from 'react-native'

const SignUp = () => {
  return (
    <View>
      <Text>Sign Up</Text>
      <Button title='Sign Up' onPress={() => router.push("/sign-in")}/>
    </View>
  )
}

export default SignUp