import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Appbar, IconButton, Portal, Dialog, Button, Text, TextInput, PaperProvider } from 'react-native-paper';
import { CameraView, CameraType, CameraPictureOptions, useCameraPermissions, CameraCapturedPicture } from 'expo-camera';
import {useCallback, useRef, useState} from 'react';

type PhotoInfo = {
  photo?: CameraCapturedPicture
  title?: string
}

const App : React.FC = () : React.ReactElement => {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null)
  const [pictureMode, setPictureMode] = useState<boolean | undefined>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [photoInfo, setPhotoInfo] = useState<PhotoInfo>({
                                                          title: 'Nimetön kuva'
                                                        })
                                                      

  // if (!permission?.granted) {
  //   return (
  //     <View>
  //       <Text>
  //         Anna lupa kameran käyttöön
  //       </Text>

  //     </View>
  //   )
  // }

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  /* 
    inside dialog, defaultValue is used with TextInput component instead of "value" prop to prevent 
    annoying flickering/problems with typing in the text. With "value" and 
    "onChangeText={setTitle}" it jitters weirdly and makes typing hard.
  */  
  const dialog = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Nimeä kuva</Dialog.Title>
          <Dialog.Content>
            <TextInput
              autoFocus={true} 
              label='Kuvan nimi'
              defaultValue={title}
              onChangeText={title => setTitle(title)}
              maxLength={30}
              />
            <Dialog.Actions>
              <Button onPress={cancelPictureMode}>Peruuta</Button>
              <Button onPress={saveTitle}>Tallenna</Button>
            </Dialog.Actions>
          </Dialog.Content>
        </Dialog>
      </Portal>
    )
  }
  

  const saveTitle = () => {
    setPhotoInfo({
      ...photoInfo,
      title: title
    })
    setTitle('')
    hideDialog()
  }

  const startCamera = async () => {
    await requestPermission()
    setPictureMode(permission?.granted)
  }
  
  const takePicture = async () : Promise<void> => {

    const options: CameraPictureOptions = {
      shutterSound: false
    }

    const photo = await ref.current?.takePictureAsync(options)

    setPhotoInfo({...photoInfo, photo: photo, title: title})
    showDialog();
    setPictureMode(false)
  }

  const cancelPictureMode = () => {
    setPictureMode(false)
    setTitle('')
    setPhotoInfo({})
    hideDialog()
  }

  const showPhoto = () => {
    return (
      <View style={styles.photoWrapper}>
        <View style={styles.photoContainer}>  
          <Image
            source={{uri: photoInfo.photo!.uri}}
            style={styles.photo}
            resizeMode='contain'
            />      
          <Text variant='titleLarge'>
            {photoInfo.title}
          </Text>
        </View>
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
      <PaperProvider>
        <Appbar.Header>
          <Appbar.Content title='Lisää kuva' />
          <IconButton 
            icon='camera'
            onPress={startCamera}
            size={35}
          />
        </Appbar.Header>
        {
          (Boolean(photoInfo.photo?.uri)
            ? showPhoto()
            : null
          )
        }
        {
          (Boolean(visible)
            ? dialog()
            : null
          )
        }
      </PaperProvider>
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
    aspectRatio: 1,

  },
  photoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  photoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default App;
