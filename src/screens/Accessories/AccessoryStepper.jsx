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
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  grey1,
  productCategories,
} from "../../constants";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import axios from "axios";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createProductAPI, editProductAPI } from "../../apiCalls/productAPIs";
import { uploadImagesToCloudinary } from "../../apiCalls/imageAPIs";

const AccessoryStepper = ({ route, navigation }) => {
  const { editing, accessoryData } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Primary Details",
    "Product Images",
    "Additional Information",
    "Stock & Pricing",
  ];

  // Step 1
  const [idLabel, setIdLabel] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("Vision Care");
  // Step 2
  const [productImages, setProductImages] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [deleteCloudinaryImages, setDeleteCloudinaryImages] = useState([]);
  // Step 3
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Step 5
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");
  const [stock, setStock] = useState("0");

  useEffect(() => {
    navigation.setOptions({
      title: !!editing ? "Edit Accessory" : "Adsd New Accessory",
    });
    if (!!editing) initalizeValues();
  }, []);

  const initalizeValues = () => {
    setIdLabel(accessoryData.id_label);
    setProductName(accessoryData.name);
    setBrand(accessoryData.brand);

    setProductImages(accessoryData.accessories.images);
    setFeaturedImage(
      accessoryData.accessories.images.indexOf(accessoryData.featured_image)
    );

    setAdditionalInfo(accessoryData.accessories.additional_info);

    setStock(accessoryData.accessories.stock.toString());
    setPrice(accessoryData.price.toString());
    setDiscount(accessoryData.discount.toString());
  };

  const handleImageSelection = async () => {
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
    if (index === featuredImage) {
      setFeaturedImage(null);
    }
    temp = [].concat(productImages);
    temp.splice(index, 1);
    setProductImages(temp);
  };

  const saveToDatabase = async () => {
    let imageUrls = [];

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
        imageUrls = await uploadImagesToCloudinary(imageFiles, "accessories");
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
    const productFields = {
      category: productCategories.ACCESSORIES,
      is_visible: true,
      name: productName,
      id_label: idLabel,
      brand: brand,
      price: parseInt(price),
      discount: parseInt(discount),
      featured_image: prodImagesFinal[featuredImage],
    };

    const accessoryFields = {
      stock: parseInt(stock),
      images: prodImagesFinal,
      additional_info: additionalInfo,
    };

    // If editing exisitng product
    if (!!editing)
      editProductAPI(
        productFields,
        accessoryFields,
        accessoryData.id,
        accessoryData.accessories.id,
        () => navigation.goBack()
      );
    // If creating new product
    else
      createProductAPI(productFields, accessoryFields, () =>
        navigation.goBack()
      );
  };

  const handleClearForm = () => {
    switch (currentStep) {
      case 0:
        setIdLabel("");
        setBrand("Vision Care");
        setProductName("");
        break;
      case 1:
        productImages.forEach((image) => {
          if (typeof image === "string")
            setDeleteCloudinaryImages(deleteCloudinaryImages.concat([image]));
        });
        setProductImages([]);
        setFeaturedImage(null);
        break;
      case 2:
        setAdditionalInfo("");
        break;
      case 3:
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
          id_label: idLabel,
          product_name: productName,
          brand: brand,
        });
        setCurrentStep(currentStep + 1);
        break;
      case 1:
        console.log("Saved Step 2: ", { images: productImages });
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        console.log("Saved Step 3: ", {
          additional_info: additionalInfo,
        });
        setCurrentStep(currentStep + 1);
        break;
      case 3:
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
        variant={"gradient_start"}
        onPress={handleImageSelection}
        style={{}}
        icon={
          <MaterialCommunityIcons
            name="upload"
            size={26}
            color={customer_primary}
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
          variant="gradient_start"
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
            // progressBarColor={customer_primary}
            completedStepIconColor={customer_primary}
            activeStepIconBorderColor={customer_primary}
            completedProgressBarColor={customer_primary}
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
                          onChangeText={setIdLabel}
                          value={idLabel}
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
                              color: grey1,
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
                                color: grey1,
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
                                        featuredImage === index
                                          ? customer_primary
                                          : grey1,
                                      borderWidth:
                                        featuredImage === index ? 3 : 1,
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
                                      onPress={() => setFeaturedImage(index)}
                                    >
                                      <Ionicons
                                        name={
                                          featuredImage === index
                                            ? "star"
                                            : "star-outline"
                                        }
                                        size={32}
                                        color={customer_primary}
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={styles.image_button}
                                      onPress={() => deleteProductImage(index)}
                                    >
                                      <Feather
                                        name="trash-2"
                                        size={32}
                                        color="red"
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
                    <View style={{ width: "100%" }}>
                      <Text style={styles.form_label}>About Product</Text>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 8,
                          fontSize: 18,
                          paddingHorizontal: "2%",
                          paddingVertical: 6,
                          borderColor: grey2,
                          height: 150,
                          textAlignVertical: "top",
                          marginTop: 20,
                        }}
                        onChangeText={setAdditionalInfo}
                        value={additionalInfo}
                        multiline
                      />
                    </View>
                  ) : currentStep === 3 ? (
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

export default AccessoryStepper;

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
    borderColor: grey2,
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
    borderColor: grey1,
    padding: 4,
    borderWidth: 1,
    borderRadius: 8,
  },
});
