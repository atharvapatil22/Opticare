import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { gradient_end, gradient_start, grey1, grey3 } from "../../constants";
import { SelectList } from "react-native-dropdown-select-list";

const SpecsStepper = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = {
    1: "Primary Details",
    2: "Product Images",
    3: "Technical Information",
    4: "Link Lenses",
    5: "Sales & Taxes",
  };

  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [gender, setGender] = useState("Unisex");

  useEffect(() => {
    navigation.setOptions({
      title: true ? "Add New Spectacles" : "Edit Spectacles",
    });
  }, []);

  const StepperGraphic = () => {
    return (
      <View style={{ backgroundColor: "aqua", width: "100%", height: 80 }}>
        <Text>Current Step{currentStep}</Text>
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
        <StepperGraphic />
        <View style={{ paddingHorizontal: "3%", paddingVertical: 14 }}>
          <Text style={styles.form_title}>{steps[currentStep]}</Text>
          {currentStep === 1 ? (
            // STEP 1
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
          ) : (
            // STEP 2
            <View></View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default SpecsStepper;

const styles = StyleSheet.create({
  gradient_container: {
    backgroundColor: "red",
    height: "100%",
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
});
