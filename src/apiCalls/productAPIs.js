import { Alert } from "react-native";
import { supabase } from "../supabase/client";

export const createProductAPI = async (
  productFields,
  categoryFields,
  _callback,
  _showSnack
) => {
  const response1 = await supabase
    .from("products")
    .insert([productFields])
    .select();
  if (response1.error) {
    console.log(
      `API ERROR => Error while products object: \n`,
      response1.error
    );
    _showSnack(`Error while creating product record!`);
  } else if (response1.status === 201) {
    console.log("Product record successfully created: ", response1.data);

    const response2 = await supabase
      .from(productFields.category)
      .insert([{ ...categoryFields, product_id: response1.data[0].id }])
      .select();

    if (response2.error) {
      console.log(
        `API ERROR => Error while creating ${productFields.category}: \n`,
        response2.error
      );
      _showSnack(`Error while creating ${productFields.category}!`);
    } else {
      console.log(
        `API SUCCESS => ${productFields.category} record successfully created: `,
        response2.data
      );
      Alert.alert(
        "Success!",
        `New ${productFields.category} were successfully created: ${response1.data[0].name}`,
        [{ text: "OK", onPress: _callback() }],
        { cancelable: false }
      );
    }
  }
};

export const editProductAPI = async (
  productFields,
  categoryFields,
  productId,
  categoryId,
  _callback,
  _showSnack
) => {
  const response1 = await supabase
    .from("products")
    .update(productFields)
    .eq("id", productId)
    .select();

  if (response1.error) {
    console.log(
      `API ERROR => Error while editing products object: \n`,
      response1.error
    );
    _showSnack(`Error while editing product record!`);
  } else if (response1.status == 200) {
    console.log(
      "API SUCCESS => Product record successfully edited: ",
      response1.data
    );

    const response2 = await supabase
      .from(productFields.category)
      .update(categoryFields)
      .eq("id", categoryId)
      .select();

    if (response2.error) {
      console.log(
        `API ERROR => Error while editing ${productFields.category} record: \n`,
        response2.error
      );
      _showSnack(`Error while editing ${productFields.category} record!`);
    } else {
      console.log(
        `API SUCCESS => ${productFields.category} record successfully edited: `,
        response2.data
      );

      Alert.alert(
        "Success!",
        `${productFields.category} Details successfully updated.`,
        [{ text: "OK", onPress: _callback() }],
        { cancelable: false }
      );
    }
  }
};

export const deleteProductAPI = async (
  productId,
  category,
  name,
  _callback
) => {
  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);
  if (error) {
    // __api_error
    console.log("api_error");
  } else {
    console.log(
      `API SUCCESS => Successfully deleted product with id: `,
      productId
    );

    Alert.alert(
      "Success!",
      `Deleted ${category}: ` + name,
      [{ text: "OK", onPress: () => _callback() }],
      { cancelable: false }
    );
  }
};
