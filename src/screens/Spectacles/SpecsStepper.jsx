import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
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

const SpecsStepper = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Primary Details",
    "Product Images",
    "Technical Information",
    "Link Lenses",
    "Sales & Taxes",
  ];

  // Step 1
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("Unisex");
  // Step 2
  const [productImages, setProductImages] = useState([]);
  // Step 3
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [weight, setWeight] = useState(null);
  const [width, setWidth] = useState(null);
  const [dimensions, setDimensions] = useState("");
  const [size, setSize] = useState("Medium");
  const [warranty, setWarranty] = useState(1);
  const [stock, setStock] = useState("0");
  // Step 5
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("0");

  const [newSpecs, setNewSpecs] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: true ? "Add New Spectacles" : "Edit Spectacles",
    });
  }, []);

  const handleUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      allowsMultipleSelection: true,
    });

    // console.log(result);

    if (!result.canceled) {
      setProductImages(productImages.concat(result.assets));
    }
  };

  const createNewSpecs = async () => {
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
    };
    const { data, error } = await supabase
      .from("spectacles")
      .insert([finalObj])
      .select();

    if (error) {
      // api_error
      console.log("api_error", error);
    } else {
      // api_success
      console.log("success", data);
    }
  };

  const handleClearForm = () => {
    console.log("clear form");
    switch (currentStep) {
      case 0:
        break;
      case 1:
        setProductImages([]);
        break;
      default:
        break;
    }
  };

  const handleProceed = () => {
    // __handle validations for each step
    switch (currentStep) {
      case 0:
        let temp = {
          product_id: productId,
          product_name: productName,
          brand: brand,
          gender: gender,
        };
        setNewSpecs(temp);
        console.log("Saved Step 1: ", temp);
        setCurrentStep(currentStep + 1);
        break;
      case 1:
        temp = newSpecs;
        temp["product_images"] = productImages;
        setNewSpecs(temp);
        console.log("Saved Step 2: ", temp);
        setCurrentStep(currentStep + 1);
        break;
      case 2:
        temp = {
          color: color,
          material: material,
          weight: weight,
          width: width,
          dimensions: dimensions,
          warranty: warranty,
          stock: stock,
          size: size,
        };
        setNewSpecs({ ...newSpecs, ...temp });
        console.log("Saved Step 3: ", { ...newSpecs, ...temp });
        setCurrentStep(currentStep + 1);
        break;
      case 3:
        console.log("Saved Step 4: ");
        setCurrentStep(currentStep + 1);
        break;
      case 4:
        temp = {
          price: price,
          discount: discount,
        };
        setNewSpecs({ ...newSpecs, ...temp });
        createNewSpecs();
        break;
      default:
        break;
    }
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
                        <View style={{ alignItems: "center" }}>
                          <Button
                            text={"UPLOAD IMAGES"}
                            variant={"light_cyan"}
                            onPress={handleUploadImage}
                            style={{ width: "50%", marginTop: 80 }}
                          />
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
                            <Button
                              text={"UPLOAD IMAGES"}
                              variant={"light_cyan"}
                              onPress={handleUploadImage}
                              style={{}}
                            />
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
                                <Image
                                  key={index}
                                  source={{ uri: img.uri }}
                                  style={styles.form_image}
                                />
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
                      <View style={styles.form_field}>
                        <Text style={styles.form_label}>Product Stock</Text>
                        <TextInput
                          style={styles.text_field}
                          onChangeText={setStock}
                          value={stock}
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
    width: "48%",
    height: "25.3%",
    aspectRatio: "16/9",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: grey3,
  },
  step_container: {
    paddingHorizontal: "3%",
    paddingVertical: 14,
    paddingBottom: 350,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: grey1,
  },
});
