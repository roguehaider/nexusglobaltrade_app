import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../constants/theme';
import { OrderDetailScreen } from '../screens/orders/OrderDetailScreen';
import { OrderHistoryScreen } from '../screens/orders/OrderHistoryScreen';
import type { OrdersStackParamList } from './types';

const Stack = createNativeStackNavigator<OrdersStackParamList>();

export function OrdersStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="OrderHistory"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </Stack.Navigator>
  );
}
