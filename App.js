import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Image,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  CameraRoll,
  Share,
  Platform
} from 'react-native';

import { FileSystem } from 'expo';
import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
const { height, width } = Dimensions.get('window');
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      images: [],
      isImageFocused: false,
      editedimage:null
    };
  }


  loadWallpapers = () => {
    axios
      .get(
        'https://api.unsplash.com/photos/random?count=30&client_id=896979fdb70f80865638d7a4648bf9ce309675335318933eab2bf990af42e295'
      )
      .then((response =>{
          console.log(response.data);
          this.setState({ images: response.data, isLoading: false });
        }).bind(this)
      )
      .catch((err => {
        console.log(err);
      })) 
  };

  componentDidMount() {
    this.loadWallpapers();

    (async () => {

      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
        // setReady(true);
      }
    })();
  }

 pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // here I sjould have get images from a sever and add to it the results
    if (!result.cancelled) {
       this.setState({editedimage: [result]});
    }
  };

componentDidUpdate(){
  
}
 rotate = async () => {
   // not totaly done also should tried the server to update the vews or render in a sepsrate component and send props
  let arr= this.state.images.map(async (image)=>{

    return await ImageManipulator.manipulateAsync(
      image.localUri || image.editedimage.uri,
     [ { rotate: 90 } ],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
  })
    this.setState({  images: arr});
  };
  shareWallpaper = async image => {
    try {
      await Share.share({
        message: 'Checkout this wallpaper ' + image.urls.full
      });
    } catch (err) {
      console.log(err);
    }
  };

  renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
       
          <Animated.View style={[{ height, width }]}>
            <Animated.Image
              style={{
                flex: 1,
                height: null,
                width: null,
               
              }}
              source={!this.state.editedimage?{ uri: item.urls.regular }:{ uri: this.state.editedimage.uri }}
            />
          </Animated.View>
       
        <Animated.View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 80,
            backgroundColor: 'black',
            flexDirection: 'row',
            justifyContent: 'space-around'
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.loadWallpapers()}
            >
              <Ionicons name="ios-refresh" color="white" size={40} />
            </TouchableOpacity>
          </View>
           <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.loadWallpapers()}
            >
              <MaterialIcons name="3d-rotation" size={40} color="white" />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.shareWallpaper(item)}
            >
              <Ionicons name="ios-share" color="white" size={40} />
            </TouchableOpacity>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.pickImage()}
            >
              <AntDesign name="plus" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  };
  render() {
    return this.state.isLoading ? (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <ActivityIndicator size="large" color="grey" />
      </View>
    ) : (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <FlatList
          scrollEnabled={!this.state.isImageFocused}
          horizontal
          pagingEnabled
          data={!this.state.editedimage?this.state.images:this.state.editedimage}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // }
});