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

const SpecsStepper = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Primary Details",
    "Product Images",
    "Technical Information",
    "Link Lenses",
    "Sales & Taxes",
  ];

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gender, setGender] = useState("Unisex");

  const [productImages, setProductImages] = useState([]);

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
          brand_name: brandName,
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
      default:
        break;
    }
  };

  const StepperGraphic = () => {
    return (
      <View style={{ backgroundColor: "aqua", width: "100%", height: 80 }}>
        <Text>Current Step{currentStep}</Text>
      </View>
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
        <Button text="SAVE & PROCEED" variant="aqua" onPress={handleProceed} />
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
            {steps.map((step) => (
              <ProgressStep label={step} removeBtnRow>
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
                          onChangeText={setBrandName}
                          value={brandName}
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
                    <View></View>
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
