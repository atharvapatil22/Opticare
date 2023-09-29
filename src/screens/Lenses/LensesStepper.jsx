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
  CLOUDINARY_CLOUDNAME,
  customer_primary,
  gradient_end,
  gradient_start,
  grey2,
  grey1,
  productCategories,
} from "../../constants";
import Button from "../../components/Button";
import { ProgressSteps, ProgressStep } from "react-native-progress-steps";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { createProductAPI, editProductAPI } from "../../apiCalls/productAPIs";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Portal, Snackbar } from "react-native-paper";
import {
  InterMedium,
  InterRegular,
} from "../../components/StyledText/StyledText";
import PageLoader from "../../components/PageLoader";

const LensesStepper = ({ route, navigation }) => {
  const { editing, lensesData } = route.params;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [showPageLoader, setShowPageLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Primary Details", "Technical Information", "Pricing"];

  // Step 1
  const [idLabel, setIdLabel] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("Vision Care");
  const [material, setMaterial] = useState("Glass");
  const [type, setType] = useState("Single Vision");
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
    setIdLabel(lensesData.id_label);
    setProductName(lensesData.name);
    setBrand(lensesData.brand);
    setMaterial(lensesData.lenses.material);
    setType(lensesData.lenses.type);

    setFeatures(lensesData.lenses.features);
    setPreviewImage(lensesData.lenses.previewImage);

    setPrice(lensesData.price.toString());
    // setDiscount(lensesData.discount.toString());
  };

  const handleImageSelection = async () => {
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
      folder: "bifocal preview_image",
    };

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDNAME}/upload`,
      JSON.stringify(data),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );

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
    setShowPageLoader(true);
    let imageUrl = null;

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
    const productFields = {
      category: productCategories.LENSES,
      is_visible: true,
      name: productName,
      id_label: idLabel,
      brand: brand,
      price: parseInt(price),
      // discount: parseInt(discount),
    };
    const lensFields = {
      material: material,
      type: type,
      features: features,
      preview_image: imageUrl,
    };

    // If editing exisitng product
    if (!!editing)
      editProductAPI(
        productFields,
        lensFields,
        lensesData.id,
        lensesData.lenses.id,
        navigation,
        (snackMsg) => {
          setSnackMessage(snackMsg);
          setShowSnackbar(true);
        },
        () => setShowPageLoader(false)
      );
    // If creating new product
    else
      createProductAPI(
        productFields,
        lensFields,
        navigation,
        (snackMsg) => {
          setSnackMessage(snackMsg);
          setShowSnackbar(true);
        },
        () => setShowPageLoader(false)
      );
  };

  const handleClearForm = () => {
    switch (currentStep) {
      case 0:
        setIdLabel("");
        setBrand("Vision Lens");
        setProductName("");
        setMaterial("Glass");
        setType("Single Vision");
        break;
      case 1:
        setFeatures("");
        setPreviewImage(null);
        break;
      case 2:
        setPrice("");
        // setDiscount("0");
        break;
      default:
        break;
    }
  };

  const areFieldsValid = () => {
    errorMessage = "";

    switch (currentStep) {
      case 0:
        if (idLabel.trim().length === 0)
          errorMessage = "Product ID cannot be blank!";
        else if (productName.trim().length === 0)
          errorMessage = "Product Name cannot be blank!";
        else if (brand.trim().length === 0)
          errorMessage = "Product Brand cannot be blank!";
        break;
      case 1:
        if (features.trim().length === 0)
          errorMessage = "Features cannot be blank!";
        if (type === "Bifocal / Progressive" && !previewImage)
          errorMessage = "Preview Image must be uploaded for Bifocal Lenses";
        break;
      case 2:
        if (price.trim().length === 0) errorMessage = "Price cannot be blank.";
        else if (!/^\d+$/.test(price) || parseInt(price) < 1)
          errorMessage = "Price must be valid non-zero number";
        else if (parseInt(discount) < 0 || parseInt(discount) > 100)
          errorMessage = "Discount must be between 0-100";
        break;
      default:
        break;
    }

    if (!!errorMessage) {
      Alert.alert(errorMessage);
      return false;
    } else return true;
  };

  const handleProceed = () => {
    // __handle validations for each step
    switch (currentStep) {
      case 0:
        console.log("Saved Step 1: ", {
          id_label: idLabel,
          product_name: productName,
          brand: brand,
          material: material,
          type: type,
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
        onPress={handleImageSelection}
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
          onPress={() => {
            if (areFieldsValid()) handleProceed();
          }}
        />
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[gradient_start, gradient_end]}
      style={styles.gradient_container}
    >
      {!!showPageLoader && (
        <PageLoader
          text={!!editing ? "Updating lenses details" : "Creating lenses"}
        />
      )}
      <Portal>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={4000}
          style={{
            marginBottom: 30,
            marginHorizontal: "20%",
          }}
          action={{
            label: "OK",
            onPress: () => setShowSnackbar(false),
          }}
        >
          {snackMessage}
        </Snackbar>
      </Portal>
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
                  <InterMedium style={styles.form_title}>
                    {steps[currentStep]}
                  </InterMedium>
                  {currentStep === 0 ? (
                    <View style={styles.form_container}>
                      <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>
                          Product ID
                        </InterRegular>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setIdLabel}
                          value={idLabel}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>
                          Product Name
                        </InterRegular>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setProductName}
                          value={productName}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>
                          Brand Name
                        </InterRegular>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setBrand}
                          value={brand}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>
                          Type
                        </InterRegular>
                        <SelectDropdown
                          renderDropdownIcon={() => (
                            <Entypo
                              name="chevron-down"
                              size={24}
                              color="black"
                            />
                          )}
                          defaultValue={type}
                          data={["Single Vision", "Bifocal / Progressive"]}
                          onSelect={(selectedItem, index) => {
                            setType(selectedItem);
                          }}
                          buttonStyle={styles.dropdown}
                        />
                      </View>
                      <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>
                          Material
                        </InterRegular>
                        <SelectDropdown
                          renderDropdownIcon={() => (
                            <Entypo
                              name="chevron-down"
                              size={24}
                              color="black"
                            />
                          )}
                          defaultValue={material}
                          data={["Glass", "MR7", "MR8"]}
                          onSelect={(selectedItem, index) => {
                            setMaterial(selectedItem);
                          }}
                          buttonStyle={styles.dropdown}
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
                      {type === "Bifocal / Progressive" && (
                        <View style={{ width: "48%" }}>
                          <InterRegular style={styles.form_label}>
                            Preview Image
                          </InterRegular>
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
                        <InterRegular style={styles.form_label}>
                          Features
                        </InterRegular>
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
                        <InterRegular style={styles.form_label}>
                          Avg. Price For Single Lens
                        </InterRegular>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setPrice}
                          value={price}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>
                          Avg. Price For Pair
                        </InterRegular>
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
                      {/* <View style={styles.form_field}>
                        <InterRegular style={styles.form_label}>Discount (in %)</InterRegular>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setDiscount}
                          value={discount}
                          keyboardType="numeric"
                        />
                      </View> */}
                    </View>
                  ) : (
                    <>
                      <InterRegular>Invalid Step</InterRegular>
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
  dropdown: {
    borderWidth: 1,
    width: "100%",
    borderColor: grey2,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
