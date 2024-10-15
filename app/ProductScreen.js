// ProductScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';
import { db } from '../constants/firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

const ProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null); // Trạng thái để biết sản phẩm nào đang được sửa

  // Lấy danh sách sản phẩm từ Firestore
  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setProducts(productsArray);
  };

  // Thêm sản phẩm mới
  const addProduct = async () => {
    if (!name || !type || !price || !imageUri) {
      alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
      return;
    }

    await addDoc(collection(db, 'products'), { name, type, price, imageUri });
    resetForm();
    fetchProducts();
  };

  // Sửa sản phẩm
  const updateProduct = async () => {
    const productDoc = doc(db, 'products', editingProductId);
    await updateDoc(productDoc, { name, type, price, imageUri });
    resetForm();
    fetchProducts();
  };

  // Xóa sản phẩm
  const deleteProduct = async (id) => {
    const productDoc = doc(db, 'products', id);
    await deleteDoc(productDoc);
    fetchProducts();
  };

  // Hiển thị dữ liệu sản phẩm lên form khi nhấn nút "Sửa"
  const editProduct = (product) => {
    setName(product.name);
    setType(product.type);
    setPrice(product.price);
    setImageUri(product.imageUri);
    setEditingProductId(product.id);
  };

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh!");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log("Result object: ", result); // Kiểm tra tất cả thông tin của result
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log("Image URI: ", result.assets[0].uri); // Lấy URI từ assets
      setImageUri(result.assets[0].uri);
    } else {
      console.log("Image picking was cancelled or no image selected");
    }
  };

  // Reset form sau khi thêm hoặc sửa
  const resetForm = () => {
    setName('');
    setType('');
    setPrice('');
    setImageUri(null);
    setEditingProductId(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Quản lý sản phẩm</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Tên sản phẩm"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="Loại sản phẩm"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Giá sản phẩm"
        keyboardType="numeric"
        placeholderTextColor="#999"
      />
<View style={styles.buttonContainer}>
      <Button title="Chọn ảnh" onPress={pickImage} color="#4CAF50" />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
      </View>
      <View style={styles.buttonContainer}>
      <Button
        title={editingProductId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        onPress={editingProductId ? updateProduct : addProduct}
        color="#2196F3"
      />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productContainer}>
            <Image source={{ uri: item.imageUri }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productType}>{item.type}</Text>
              <Text style={styles.productPrice}>{item.price} VNĐ</Text>
            </View>
            <View style={styles.productActions}>
            <View style={styles.buttonContainer}>
                <Button title="Sửa" onPress={() => editProduct(item)} color="#FFC107" />
              </View>
              <View style={styles.buttonContainer}>
                <Button title="Xóa" onPress={() => deleteProduct(item.id)} color="#F44336" />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flex: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginVertical: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productDetails: {
    flex: 1,
    marginLeft: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productType: {
    fontSize: 14,
    color: '#777',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#28a745',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginHorizontal: 5, // Khoảng cách giữa các nút
    marginVertical: 10,  // Khoảng cách giữa nút và các thành phần khác
  },
});

export default ProductScreen;