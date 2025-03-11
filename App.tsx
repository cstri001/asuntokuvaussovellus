import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Appbar, IconButton } from 'react-native-paper';
import { CameraView, CameraType, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import {useRef, useState} from 'react';


const App : React.FC = () : React.ReactElement => {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null)
  const [pictureMode, setPictureMode] = useState<boolean | undefined>(false)
  const [photoUri, setPhotoUri] = useState<string | undefined>()

  // if (!permission?.granted) {
  //   return (
  //     <View>
  //       <Text>
  //         Anna lupa kameran käyttöön
  //       </Text>

  //     </View>
  //   )
  // }

  const startCamera = async () => {
    await requestPermission()
    setPictureMode(permission?.granted)
  }
  
  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync()
    setPhotoUri(photo?.uri)
    setPictureMode(false)
  }

  const cancelPictureMode = () => {
    setPictureMode(false)
  }

  const showPhoto = () => {
    return (
      <View>
        <Image
          source={{uri: photoUri}}
          style={styles.photo}
        />
      </View>
    )
  }


  const cameraView = () => {
    return (
      <CameraView ref={ref} style={styles.cameraView}>
        <View style={styles.buttonWrap}>
          <View style={styles.buttonContainer}>
            <IconButton
              icon='camera'
              onPress={takePicture}
              size={styles.cameraControls.height}
              iconColor={styles.cameraControls.color}
            />
            <IconButton 
              icon='close-thick'
              onPress={cancelPictureMode}
              size={styles.cameraControls.height}
              iconColor={styles.cameraControls.color}
            />
          </View>
        </View>
      </CameraView>
    )
  }

  const startView = () => {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title='Lisää kuva' />
          <IconButton 
            icon='camera'
            onPress={startCamera}
            size={20}
          />
        </Appbar.Header>
        {
          (Boolean(photoUri)
            ? showPhoto()
            : null
          )
        }
      </>
    )
  }

  return (
    <SafeAreaProvider>
      {!pictureMode ? startView() : cameraView()}
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  cameraControls: {
    color: '#fff',
    height: 40
  },
  cameraView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photo: {
    width: '100%',
    height: '100%',
    
  }
});

export default App;
