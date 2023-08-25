import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  CLOUDINARY_URL,
  aqua1,
  gradient_end,
  gradient_start,
  grey1,
  grey3,
} from "../../constants";
import { SelectList } from "react-native-dropdown-select-list";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { supabase } from "../../supabase/client";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const SpecsStepper = ({ route, navigation }) => {
  const { editing, specsData } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Primary Details",
    "Product Images",
    "Technical Information",
    "Link Lenses",
    "Stock & Pricing",
  ];

  // Step 1
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("Eyemate");
  const [gender, setGender] = useState("Unisex");
  // Step 2
  const [productImages, setProductImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteCloudinaryImages, setDeleteCloudinaryImages] = useState([]);
  // Step 3
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [size, setSize] = useState("Medium");
  const [warranty, setWarranty] = useState(1);

  // Step 5
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("0");

  useEffect(() => {
    navigation.setOptions({
      title: !!editing ? "Edit Spectacles" : "Add New Spectacles",
    });
    if (!!editing) initalizeValues();
  }, []);

  const initalizeValues = () => {
    setProductId(specsData.product_id);
    setProductName(specsData.name);
    setBrand(specsData.brand);
    setGender(specsData.gender);

    setProductImages(specsData.images);
    setPreviewImage(specsData.preview_image);

    setColor(specsData.color);
    setMaterial(specsData.material);
    setWeight(specsData.weight.toString());
    setWidth(specsData.width.toString());
    setDimensions(specsData.dimensions);
    setSize(specsData.size);
    setWarranty(specsData.warranty.toString());

    setStock(specsData.stock.toString());
    setPrice(specsData.price.toString());
    setDiscount(specsData.discount.toString());
  };

  const handleUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      allowsMultipleSelection: true,
      base64: true,
    });

    // console.log("imagepicker", result.assets);

    if (!result.canceled) {
      setProductImages(productImages.concat(result.assets));
    }
  };

  const deleteProductImage = (index) => {
    if (editing && typeof productImages[index] === "string") {
      setDeleteCloudinaryImages(
        deleteCloudinaryImages.concat([productImages[index]])
      );
    }
    if (index === previewImage) {
      setPreviewImage(null);
    }
    temp = [].concat(productImages);
    temp.splice(index, 1);
    setProductImages(temp);
  };

  const uploadImagesToCloudinary = (filesArray) => {
    // Push all the axios request promise into a single array
    const uploaders = filesArray.map((file) => {
      let base64Img = `data:image/jpg;base64,${file.base64}`;

      let data = {
        file: base64Img,
        upload_preset: "uz1grhbn",
      };

      return axios
        .post(CLOUDINARY_URL, JSON.stringify(data), {
          headers: {
            "content-type": "application/json",
          },
        })
        .then(async (response) => {
          const data = response.data;
          const fileURL = data.secure_url;
          console.log("Uploaded image to cloudinary:", fileURL);
          return fileURL;
        })
        .catch((err) => console.log("Cloudinary error", err));
    });

    return axios.all(uploaders);
  };

  const saveToDatabase = async () => {
    let imageUrls = [];
    let response = null;

    // 1] Handle case if any images need to be deleted from Cloudinary
    if (deleteCloudinaryImages.length != 0) {
      // __add logic to delete
    }

    // 2] Handle uploading new images to cloudinary

    const imageFiles = productImages.filter(
      (image) => typeof image === "object"
    );
    console.log(
      `Out of total ${productImages.length} productImages, ${imageFiles.length} are new.`
    );

    // If there are any new product images then upload them to cloudinary
    if (imageFiles.length != 0) {
      console.log(`Uploading ${imageFiles.length} new images to cloudinary`);
      try {
        imageUrls = await uploadImagesToCloudinary(imageFiles);
        console.log("Successfully uploaded all images ✔️");
      } catch (err) {
        console.log("Cloudinary error! Failed to upload all images", err);
      }
    }

    // Merge existing and new image urls
    const prodImagesFinal = productImages.map((image) => {
      if (typeof image === "string") return image;
      else {
        return imageUrls.shift();
      }
    });

    // 3] Create/Update spectacles object to database
    const finalObj = {
      name: productName,
      product_id: productId,
      brand: brand,
      price: parseInt(price),
      discount: parseInt(discount),
      material: material,
      color: color,
      gender: gender,
      warranty: parseInt(warranty),
      size: size,
      dimensions: dimensions,
      weight: parseInt(weight),
      width: parseInt(width),
      stock: parseInt(stock),
      images: prodImagesFinal,
      preview_image: prodImagesFinal[previewImage],
    };

    // If editing exisitng product
    if (!!editing) {
      response = await supabase
        .from("spectacles")
        .update(finalObj)
        .eq("id", specsData.id)
        .select();
    }
    // If creating new product
    else {
      response = await supabase.from("spectacles").insert([finalObj]).select();
    }

    if (response.error) {
      // __api_error
      console.log("api_error", response.error);
    } else {
      // __api_success
      console.log("success", response.data);
      Alert.alert(
        "Success!",
        !!editing
          ? "Specs Details successfully updated."
          : "New specs were successfully created: " + response.data[0].name,
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  };

  const handleClearForm = () => {
    switch (currentStep) {
      case 0:
        setProductId("");
        setBrand("");
        setProductName("");
        setGender("Unisex");
        break;
      case 1:
        productImages.forEach((image) => {
          if (typeof image === "string")
            setDeleteCloudinaryImages(deleteCloudinaryImages.concat([image]));
        });
        setProductImages([]);
        setPreviewImage(null);
        break;
      case 2:
        setColor("");
        setMaterial("");
        setWeight(null);
        setWidth(null);
        setDimensions("");
        setSize("Medium");
        setWarranty(1);

        break;
      case 3:
        break;
      case 4:
        setPrice("");
        setDiscount("0");
        setStock("0");
        break;
      default:
        break;
    }
  };

  const handleProceed = () => {
    // __handle validations for each step
    switch (currentStep) {
      case 0:
        console.log("Saved Step 1: ", {
          product_id: productId,
          product_name: productName,
          brand: brand,
          gender: gender,
        });
        setCurrentStep(currentStep + 1);
        break;
      case 1:
        console.log("Saved Step 2: ", { images: productImages });
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        console.log("Saved Step 3: ", {
          color: color,
          material: material,
          weight: weight,
          width: width,
          dimensions: dimensions,
          warranty: warranty,
          size: size,
        });
        setCurrentStep(currentStep + 1);
        break;
      case 3:
        console.log("Saved Step 4: ");
        setCurrentStep(currentStep + 1);
        break;
      case 4:
        saveToDatabase();
        break;
      default:
        break;
    }
  };

  const UploadImageButton = () => {
    return (
      <Button
        text={"UPLOAD IMAGES"}
        variant={"light_cyan"}
        onPress={handleUploadImage}
        style={{}}
        icon={
          <MaterialCommunityIcons
            name="upload"
            size={26}
            color={aqua1}
            style={{ marginRight: 4 }}
          />
        }
      />
    );
  };

  const FormButtons = () => {
    return (
      <View style={styles.form_buttons}>
        <Button
          text="BACK"
          variant="white"
          onPress={() => {
            setCurrentStep(currentStep - 1);
          }}
          disabled={currentStep === 0}
        />
        <Button
          text="CLEAR ALL"
          variant="light_cyan"
          onPress={handleClearForm}
        />
        <Button
          text={currentStep === steps.length - 1 ? "SUBMIT" : "SAVE & PROCEED"}
          variant="aqua"
          onPress={handleProceed}
        />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[gradient_start, gradient_end]}
      style={styles.gradient_container}
    >
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "100%",
          elevation: 2,
        }}
      >
        <View style={{ flex: 1 }}>
          <ProgressSteps
            // progressBarColor={aqua1}
            completedStepIconColor={aqua1}
            activeStepIconBorderColor={aqua1}
            completedProgressBarColor={aqua1}
            activeLabelColor={"black"}
            activeLabelFontSize={18}
            labelFontSize={18}
            activeStep={currentStep}
          >
            {steps.map((step, index) => (
              <ProgressStep label={step} removeBtnRow key={index}>
                <View style={styles.step_container}>
                  <Text style={styles.form_title}>{steps[currentStep]}</Text>
                  {currentStep === 0 ? (
                    <View style={styles.form_container}>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Product ID</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setProductId}
                          value={productId}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Product Name</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setProductName}
                          value={productName}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Brand Name</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setBrand}
                          value={brand}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Gender</Text>
                        <SelectList
                          search={false}
                          setSelected={(val) => setGender(val)}
                          data={[
                            { key: "1", value: "Unisex" },
                            { key: "2", value: "Male" },
                            { key: "3", value: "Female" },
                          ]}
                          defaultOption={{ key: "1", value: "Unisex" }}
                          save="value"
                          boxStyles={{ borderColor: grey1 }}
                          dropdownStyles={{ borderColor: grey1 }}
                        />
                      </View>
                    </View>
                  ) : currentStep === 1 ? (
                    <>
                      {productImages.length === 0 ? (
                        <View style={{ alignItems: "center", paddingTop: 65 }}>
                          <UploadImageButton />
                          <Text style={{ fontSize: 18, marginTop: 50 }}>
                            Please upload 1 or more images for the product
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              color: grey3,
                              marginTop: 25,
                              marginBottom: 80,
                            }}
                          >
                            Note: Images must be uploaded in 16:9 aspect ratio.
                          </Text>
                        </View>
                      ) : (
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ width: "20%" }}>
                            <UploadImageButton />
                            <Text
                              style={{
                                fontSize: 16,
                                color: "black",
                                marginTop: 25,
                                paddingRight: 4,
                              }}
                            >
                              Note: Images must be uploaded in 16:9 aspect
                              ratio.
                            </Text>
                            <Text
                              style={{
                                fontSize: 16,
                                color: grey3,
                                marginTop: 25,
                                paddingRight: 4,
                              }}
                            >
                              Star mark an Image to set it as the featured image
                              for this product.
                            </Text>
                          </View>

                          <View
                            style={{
                              flexWrap: "wrap",
                              flex: 1,
                              flexDirection: "row",
                              justifyContent: "space-between",
                              width: "100%",
                              paddingHorizontal: "3%",
                            }}
                          >
                            {productImages.length !== 0 &&
                              productImages.map((img, index) => (
                                <View
                                  key={index}
                                  style={{ width: "48%", marginBottom: 20 }}
                                >
                                  <Image
                                    source={{
                                      uri:
                                        typeof img === "string" ? img : img.uri,
                                    }}
                                    style={{
                                      ...styles.form_image,
                                      borderColor:
                                        previewImage === index ? aqua1 : grey3,
                                      borderWidth:
                                        previewImage === index ? 3 : 1,
                                    }}
                                  />
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      justifyContent: "space-between",
                                      paddingHorizontal: "32%",
                                      marginTop: 6,
                                    }}
                                  >
                                    <TouchableOpacity
                                      style={styles.image_button}
                                      onPress={() => setPreviewImage(index)}
                                    >
                                      <Ionicons
                                        name={
                                          previewImage === index
                                            ? "star"
                                            : "star-outline"
                                        }
                                        size={32}
                                        color={aqua1}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.image_button}
                                      onPress={() => deleteProductImage(index)}
                                    >
                                      <Ionicons
                                        name="trash"
                                        size={32}
                                        color={"red"}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ))}
                          </View>
                        </View>
                      )}
                    </>
                  ) : currentStep === 2 ? (
                    <View style={styles.form_container}>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Frame Color</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setColor}
                          value={color}
                        />
                      </View>

                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Material</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setMaterial}
                          value={material}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Size</Text>
                        <SelectList
                          search={false}
                          setSelected={(val) => setSize(val)}
                          data={[
                            { key: "1", value: "Extra Narrow" },
                            { key: "2", value: "Narrow" },
                            { key: "3", value: "Medium" },
                            { key: "4", value: "Wide" },
                            { key: "5", value: "Extra Wide" },
                          ]}
                          defaultOption={{ key: "3", value: "Medium" }}
                          save="value"
                          boxStyles={{ borderColor: grey1 }}
                          dropdownStyles={{ borderColor: grey1 }}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Weight (in grams)</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setWeight}
                          value={weight}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Width (in cms)</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setWidth}
                          value={width}
                          keyboardType="number-pad"
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Dimensions</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setDimensions}
                          value={dimensions}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Product Warranty</Text>
                        <SelectList
                          search={false}
                          setSelected={(val) => setWarranty(val)}
                          data={[
                            { key: "1", value: "1 Year" },
                            { key: "2", value: "2 Years" },
                            { key: "3", value: "3 Years" },
                          ]}
                          defaultOption={{ key: "1", value: "1 Year" }}
                          save="key"
                          boxStyles={{ borderColor: grey1 }}
                          dropdownStyles={{ borderColor: grey1 }}
                        />
                      </View>
                    </View>
                  ) : currentStep === 3 ? (
                    <View style={{}}>
                      <Text style={styles.form_label}>Available Lenses</Text>
                      <SelectList
                        search={false}
                        setSelected={(val) => setWarranty(val)}
                        data={[]}
                        // defaultOption={{ key: "1", value: "1 Year" }}
                        placeholder="No lenses Available"
                        save="key"
                        boxStyles={{ borderColor: grey1 }}
                        dropdownStyles={{ borderColor: grey1 }}
                      />
                    </View>
                  ) : currentStep === 4 ? (
                    <View style={styles.form_container}>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Price</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setPrice}
                          value={price}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Discount (in %)</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setDiscount}
                          value={discount}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Product Stock</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setStock}
                          value={stock}
                        />
                      </View>
                    </View>
                  ) : (
                    <>
                      <Text>Invalid Step</Text>
                    </>
                  )}
                  <FormButtons />
                </View>
              </ProgressStep>
            ))}
          </ProgressSteps>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SpecsStepper;

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  gradient_container: {
    height: windowHeight * 0.8,
    width: "100%",
    paddingHorizontal: "10%",
    paddingVertical: "2%",
  },
  form_container: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  form_field: {
    flexBasis: "47%",
    marginBottom: 18,
  },
  form_title: { fontSize: 20, fontWeight: "500", marginBottom: 20 },
  text_field: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 18,
    paddingHorizontal: "2%",
    paddingVertical: 6,
    borderColor: grey1,
  },
  form_label: { color: "black", fontSize: 18, marginBottom: 5 },
  form_buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    width: "50%",
  },
  form_image: {
    // width: "100%",
    // height: "25.3%",
    aspectRatio: "16/9",
    borderWidth: 1,
  },
  step_container: {
    paddingHorizontal: "3%",
    paddingVertical: 14,
    paddingBottom: 450,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: grey1,
  },
  image_button: {
    borderColor: grey3,
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
  },
});
