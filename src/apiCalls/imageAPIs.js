import axios from "axios";
import crypto from "crypto";

import { CLOUDINARY_API_KEY, CLOUDINARY_CLOUDNAME } from "../constants";

export const uploadImagesToCloudinary = (filesArray, folder) => {
  // Push all the axios request promise into a single array
  const uploaders = filesArray.map((file) => {
    let base64Img = `data:image/jpg;base64,${file.base64}`;

    let data = {
      file: base64Img,
      upload_preset: "uz1grhbn",
      folder: folder,
    };

    return axios
      .post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDNAME}/upload`,
        JSON.stringify(data),
        {
          headers: {
            "content-type": "application/json",
          },
        }
      )
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

// const generateSHA1 = async (data) => {
//   const hash = crypto.createHash("sha1");
//   hash.update(data);
//   return hash.digest("hex");
// };

// export const deleteImagesFromCloudinary = () => {
//   const pub_id = "qrwccthprzeywsnnacz2";
//   const currentTime = new Date().getTime();
//   console.log("\ncurrent Time", currentTime);

//   let data = {
//     public_id: pub_id,
//     signature: generateSHA1(`public_id=${pub_id}&timestamp=${currentTime}`),
//     api_key: CLOUDINARY_API_KEY,
//     timestamp: currentTime,
//   };

//   axios
//     .post(
//       `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUDNAME}/image/destroy`,
//       data
//     )
//     .then((res) => console.log("res", res))
//     .catch((err) => console.log("err", err.response));
// };
