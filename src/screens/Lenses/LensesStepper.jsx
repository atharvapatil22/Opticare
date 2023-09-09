import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  CLOUDINARY_URL,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  grey1,
} from "../../constants";
import Button from "../../components/Button";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import { supabase } from "../../supabase/client";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SelectList } from "react-native-dropdown-select-list";
import * as ImagePicker from "expo-image-picker";

const LensesStepper = ({ route, navigation }) => {
  const { editing, lensesData } = route.params;
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Primary Details", "Technical Information", "Pricing"];

  // Step 1
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("Vision Care");
  const [material, setMaterial] = useState("Glass");
  const [category, setCategory] = useState("Single Vision");
  // Step 2
  const [features, setFeatures] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  // Step 3
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");

  useEffect(() => {
    navigation.setOptions({
      title: !!editing ? "Edit Lenses" : "Add New Lenses",
    });
    if (!!editing) initalizeValues();
  }, []);

  const initalizeValues = () => {
    setProductId(lensesData.product_id);
    setProductName(lensesData.name);
    setBrand(lensesData.brand);
    setMaterial(lensesData.material);
    setCategory(lensesData.category);

    setFeatures(lensesData.features);
    setPreviewImage(lensesData.previewImage);

    setPrice(lensesData.price.toString());
    setDiscount(lensesData.discount.toString());
  };

  const handleUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      base64: true,
    });

    // console.log("imagepicker", result.assets);

    if (!result.canceled) {
      setPreviewImage(result.assets[0]);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    let base64Img = `data:image/jpg;base64,${file.base64}`;

    let data = {
      file: base64Img,
      upload_preset: "uz1grhbn",
    };

    const response = await axios.post(CLOUDINARY_URL, JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.status === 200) {
      const data = response.data;
      const fileURL = data.secure_url;
      console.log("Uploaded image to cloudinary:", fileURL);
      return fileURL;
    } else {
      console.log("Cloudinary error", response);
    }
  };

  const saveToDatabase = async () => {
    let imageUrl = null;
    let response = null;

    // If preview image was added / edited
    if (typeof previewImage === "object") {
      console.log(`Uploading new preview image to cloudinary`);
      try {
        imageUrl = await uploadImageToCloudinary(previewImage);
        console.log("Successfully uploaded all images ✔️");
      } catch (err) {
        console.log("Cloudinary error! Failed to upload all images", err);
      }
    }

    // 3] Create/Update spectacles object to database
    const finalObj = {
      name: productName,
      product_id: productId,
      brand: brand,
      material: material,
      category: category,
      features: features,
      preview_image: imageUrl,
      price: parseInt(price),
      discount: parseInt(discount),
    };

    // If editing exisitng product
    if (!!editing) {
      response = await supabase
        .from("lenses")
        .update(finalObj)
        .eq("id", lensesData.id)
        .select();
    }
    // If creating new product
    else {
      response = await supabase.from("lenses").insert([finalObj]).select();
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
          ? "Lenses Details successfully updated."
          : "New Lenses successfully created: " + response.data[0].name,
        [{ text: "OK", onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  };

  const handleClearForm = () => {
    switch (currentStep) {
      case 0:
        setProductId("");
        setBrand("Vision Lens");
        setProductName("");
        setMaterial("Glass");
        setCategory("Single Vision");
        break;
      case 1:
        setFeatures("");
        setPreviewImage(null);
        break;
      case 2:
        setPrice("");
        setDiscount("0");
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
          material: material,
          category: category,
        });
        setCurrentStep(currentStep + 1);
        break;
      case 1:
        // console.log("Saved Step 2: ", { images: productImages });
        console.log("Saved Step 2: ", {
          features: features,
          preview_image: previewImage,
        });
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        saveToDatabase();
        break;
      default:
        break;
    }
  };

  const UploadImageButton = () => {
    return (
      <Button
        text={!!previewImage ? "EDIT IMAGE" : "UPLOAD IMAGE"}
        variant={"gradient_start"}
        onPress={handleUploadImage}
        style={{ marginTop: 20, width: "100%" }}
        icon={
          <MaterialCommunityIcons
            name={!!previewImage ? "image-edit" : "upload"}
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
                        <Text style={styles.form_label}>Category</Text>
                        <SelectList
                          search={false}
                          setSelected={(val) => setCategory(val)}
                          data={[
                            { key: "1", value: "Single Vision" },
                            { key: "2", value: "Bifocal / Progressive" },
                          ]}
                          defaultOption={{ key: "1", value: "Single Vision" }}
                          save="value"
                          boxStyles={{ borderColor: grey2 }}
                          dropdownStyles={{ borderColor: grey2 }}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Material</Text>
                        <SelectList
                          search={false}
                          setSelected={(val) => setMaterial(val)}
                          data={[
                            { key: "1", value: "Glass" },
                            { key: "2", value: "MR7" },
                            { key: "3", value: "MR8" },
                          ]}
                          defaultOption={{ key: "1", value: "Glass" }}
                          save="value"
                          boxStyles={{ borderColor: grey2 }}
                          dropdownStyles={{ borderColor: grey2 }}
                        />
                      </View>
                    </View>
                  ) : currentStep === 1 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      {category === "Bifocal / Progressive" && (
                        <View style={{ width: "48%" }}>
                          <Text style={styles.form_label}>Preview Image</Text>
                          <View style={{ alignItems: "center" }}>
                            {!!previewImage && (
                              <Image
                                source={{
                                  uri:
                                    typeof img === "string"
                                      ? previewImage
                                      : previewImage.uri,
                                }}
                                style={{
                                  ...styles.form_image,
                                  borderColor: grey1,
                                  borderWidth: 1,
                                  marginTop: 20,
                                }}
                              />
                            )}
                            <UploadImageButton />
                          </View>
                        </View>
                      )}

                      <View style={{ width: "48%" }}>
                        <Text style={styles.form_label}>Features</Text>
                        <TextInput
                          style={{
                            borderWidth: 1,
                            borderRadius: 8,
                            fontSize: 18,
                            paddingHorizontal: "2%",
                            paddingVertical: 6,
                            borderColor: grey2,
                            height: 200,
                            textAlignVertical: "top",
                            marginTop: 20,
                          }}
                          onChangeText={setFeatures}
                          value={features}
                          multiline
                        />
                      </View>
                    </View>
                  ) : currentStep === 2 ? (
                    <View style={styles.form_container}>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>
                          Avg. Price For Single Lens
                        </Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setPrice}
                          value={price}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>
                          Avg. Price For Pair
                        </Text>
                        <TextInput
                          style={styles.text_field}
                          editable={false}
                          value={
                            price === ""
                              ? "0"
                              : (parseInt(price) * 2).toString()
                          }
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

export default LensesStepper;

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
    width: "85%",
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
