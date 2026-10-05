import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CarveScreen } from '../screens/CarveScreen';
import { ColorScreen } from '../screens/ColorScreen';
import { DoneScreen } from '../screens/DoneScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MotifScreen } from '../screens/MotifScreen';
import { PaperScreen } from '../screens/PaperScreen';
import { PoemScreen } from '../screens/PoemScreen';
import {
  LazyGalleryAlbumScreen,
  LazyGalleryScreen,
  LazyGalleryWorkScreen,
} from './lazyGallery';
import type { RootStackParamList } from './types';
import { Colors } from '../theme/tokens';

const Stack = createNativeStackNavigator<
  RootStackParamList & { _Preview: undefined; _MotifPreview: undefined }
>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.surfacePaper },
          fullScreenGestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="_MotifPreview"
          getComponent={() => require('../screens/_MotifPreview').MotifPreviewScreen}
        />
        <Stack.Screen
          name="_Preview"
          getComponent={() => require('../screens/_ComponentPreview').ComponentPreview}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Gallery" component={LazyGalleryScreen} />
        <Stack.Screen name="GalleryAlbum" component={LazyGalleryAlbumScreen} />
        <Stack.Screen name="GalleryWork" component={LazyGalleryWorkScreen} />
        <Stack.Screen name="Motif" component={MotifScreen} />
        <Stack.Screen name="Carve" component={CarveScreen} />
        <Stack.Screen name="Paper" component={PaperScreen} />
        <Stack.Screen name="Color" component={ColorScreen} />
        <Stack.Screen
          name="Poem"
          component={PoemScreen}
          options={{ gestureEnabled: false, fullScreenGestureEnabled: false }}
        />
        <Stack.Screen name="Done" component={DoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
