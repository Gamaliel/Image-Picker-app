import react, { useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import uploadToAnonymousFilesAsync from "anonymous-files";

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission is needed...");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled === true) {
      return;
    }
    if(Platform.OS === 'web'){
     const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
     console.log(remoteUri);
    } else{ setSelectedImage({ localUri: pickerResult.uri }); }

    
  };

  const openShareDialogAsync = async () => {
      if(!(await Sharing.isAvailableAsync())){
        alert("Sharing is not available :-/ ");
        return;
      }
      await Sharing.shareAsync(selectedImage.localUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Picker App... </Text>
      <TouchableOpacity onPress={openImagePickerAsync}>
      <Image
        style={styles.image}
        source={{
          uri:
            selectedImage !== null
              ? selectedImage.localUri
              : "https://picsum.photos/300/300",
        }}
      />
      </TouchableOpacity>
    {
      selectedImage ? (<TouchableOpacity onPress={openShareDialogAsync} style={styles.button} >
        <Text style={styles.buttonText}>Share Here!!!</Text>
      </TouchableOpacity>)
      : <View />
    }
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 40,
    color: "#000",
  },

  image: {
    width: 180,
    height: 180,
    marginTop: 10,
    borderRadius: 90,
  },
  button: {
    backgroundColor: "#000",
    padding: 6,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
  },
});

export default App;
