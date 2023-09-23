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
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import { createProductAPI, editProductAPI } from "../../apiCalls/productAPIs";
import { uploadImagesToCloudinary } from "../../apiCalls/imageAPIs";
import SelectDropdown from "react-native-select-dropdown";
import { Portal, Snackbar } from "react-native-paper";

const SpecsStepper = ({ route, navigation }) => {
  const { editing, specsData } = route.params;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Primary Details",
    "Product Images",
    "Technical Information",
    "Link Lenses",
    "Stock & Pricing",
  ];

  // Step 1
  const [idLabel, setIdLabel] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("Eyemate");
  const [gender, setGender] = useState("Unisex");
  // Step 2
  const [productImages, setProductImages] = useState([]);
  const [featuredImage, setFeaturedImage] = useState(null);
  const [deleteCloudinaryImages, setDeleteCloudinaryImages] = useState([]);
  // Step 3
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [size, setSize] = useState("Medium");
  const [warranty, setWarranty] = useState("1 Year");
  // Step 4
  const [linkedSingle, setLinkedSingle] = useState(false);
  const [linkedBifocal, setLinkedBifocal] = useState(false);
  const [linkedZero, setLinkedZero] = useState(false);

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
    setIdLabel(specsData.id_label);
    setProductName(specsData.name);
    setBrand(specsData.brand);
    setGender(specsData.spectacles.gender);

    setProductImages(specsData.spectacles.images);
    setFeaturedImage(
      specsData.spectacles.images.indexOf(specsData.featured_image)
    );

    setColor(specsData.spectacles.color);
    setMaterial(specsData.spectacles.material);
    setWeight(specsData.spectacles.weight.toString());
    setWidth(specsData.spectacles.width.toString());
    setDimensions(specsData.spectacles.dimensions);
    setSize(specsData.spectacles.size);
    setWarranty(specsData.spectacles.warranty);

    setLinkedSingle(specsData.spectacles.linked_single);
    setLinkedBifocal(specsData.spectacles.linked_bifocal);
    setLinkedZero(specsData.spectacles.linked_zero);

    setStock(specsData.spectacles.stock.toString());
    setPrice(specsData.price.toString());
    setDiscount(specsData.discount.toString());
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

    temp = [].concat(productImages);
    temp.splice(index, 1);
    setProductImages(temp);
    if (index === featuredImage) {
      setFeaturedImage(null);
    } else if (featuredImage > index) setFeaturedImage(featuredImage - 1);
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
        imageUrls = await uploadImagesToCloudinary(imageFiles, "spectacles");
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
      category: productCategories.SPECTACLES,
      is_visible: true,
      name: productName,
      id_label: idLabel,
      brand: brand,
      price: parseInt(price),
      discount: parseInt(discount),
      featured_image: prodImagesFinal[featuredImage],
    };

    const specsFields = {
      material: material,
      color: color,
      gender: gender,
      warranty: warranty,
      size: size,
      dimensions: dimensions,
      weight: parseInt(weight),
      width: parseInt(width),
      stock: parseInt(stock),
      images: prodImagesFinal,
      linked_single: linkedSingle,
      linked_bifocal: linkedBifocal,
      linked_zero: linkedZero,
    };

    // If editing exisitng product
    if (!!editing)
      editProductAPI(
        productFields,
        specsFields,
        specsData.id,
        specsData.spectacles.id,
        () => navigation.goBack(),
        (snackMsg) => {
          setSnackMessage(snackMsg);
          setShowSnackbar(true);
        }
      );
    // If creating new product
    else
      createProductAPI(
        productFields,
        specsFields,
        () => navigation.goBack(),
        (snackMsg) => {
          setSnackMessage(snackMsg);
          setShowSnackbar(true);
        }
      );
  };

  const handleClearForm = () => {
    switch (currentStep) {
      case 0:
        setIdLabel("");
        setBrand("Eyemate");
        setProductName("");
        setGender("Unisex");
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
        setColor("");
        setMaterial("");
        setWeight(null);
        setWidth(null);
        setDimensions("");
        setSize("Medium");
        setWarranty("1 Year");
        break;
      case 3:
        setLinkedSingle(false);
        setLinkedBifocal(false);
        setLinkedZero(false);
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
        if (productImages.length === 0)
          errorMessage = "You must upload at least 1 image!";
        else if (featuredImage == null)
          errorMessage = "Featured image not selected!";
        break;
      case 2:
        if (color.trim().length === 0) errorMessage = "Color cannot be blank!";
        else if (material.trim().length === 0)
          errorMessage = "Material cannot be blank!";
        else if (!!weight && !/^\d+$/.test(weight))
          errorMessage = "Weight must be valid number";
        else if (!!width && !/^\d+$/.test(width))
          errorMessage = "Width must be valid number";
        break;
      case 4:
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
        console.log("Saved Step 4: ", {
          linked_single: linkedSingle,
          linked_bifocal: linkedBifocal,
          linked_zero: linkedZero,
        });
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
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Gender</Text>
                        <SelectDropdown
                          renderDropdownIcon={() => (
                            <Entypo
                              name="chevron-down"
                              size={24}
                              color="black"
                            />
                          )}
                          defaultValue={gender}
                          data={["Unisex", "Male", "Female"]}
                          onSelect={(selectedItem, index) => {
                            setGender(selectedItem);
                          }}
                          buttonStyle={styles.dropdown}
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

                        <SelectDropdown
                          renderDropdownIcon={() => (
                            <Entypo
                              name="chevron-down"
                              size={24}
                              color="black"
                            />
                          )}
                          defaultValue={size}
                          data={[
                            "Extra Narrow",
                            "Narrow",
                            "Medium",
                            "Wide",
                            "Extra Wide",
                          ]}
                          onSelect={(selectedItem, index) => {
                            setSize(selectedItem);
                          }}
                          buttonStyle={styles.dropdown}
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

                        <SelectDropdown
                          renderDropdownIcon={() => (
                            <Entypo
                              name="chevron-down"
                              size={24}
                              color="black"
                            />
                          )}
                          defaultValue={warranty}
                          data={["1 Year", "2 Years", "3 Years"]}
                          onSelect={(selectedItem, index) => {
                            setWarranty(selectedItem);
                          }}
                          buttonStyle={styles.dropdown}
                        />
                      </View>
                    </View>
                  ) : currentStep === 3 ? (
                    <View>
                      <Text
                        style={{
                          textDecorationLine: "underline",
                          fontSize: 18,
                          color: grey2,
                        }}
                      >
                        Available Lenses:
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginBottom: 100,
                          marginTop: 25,
                        }}
                      >
                        <View style={styles.lens_item}>
                          <Checkbox
                            style={{ width: 22, height: 22 }}
                            value={linkedSingle}
                            onValueChange={(val) => {
                              setLinkedSingle(val);
                            }}
                          />
                          <Text style={{ fontSize: 20, marginLeft: 8 }}>
                            Single Vision
                          </Text>
                        </View>
                        <View style={styles.lens_item}>
                          <Checkbox
                            style={{ width: 22, height: 22 }}
                            value={linkedBifocal}
                            onValueChange={(val) => {
                              setLinkedBifocal(val);
                            }}
                          />
                          <Text style={{ fontSize: 20, marginLeft: 8 }}>
                            Bifocal / Progressive
                          </Text>
                        </View>
                        <View style={styles.lens_item}>
                          <Checkbox
                            style={{ width: 22, height: 22 }}
                            value={linkedZero}
                            onValueChange={(val) => {
                              setLinkedZero(val);
                            }}
                          />
                          <Text style={{ fontSize: 20, marginLeft: 8 }}>
                            Zero Power
                          </Text>
                        </View>
                      </View>
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
  lens_item: {
    width: "33%",
    flexDirection: "row",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    width: "100%",
    borderColor: grey2,
    borderRadius: 8,
    backgroundColor: "white",
  },
});
