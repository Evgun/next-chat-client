import axios from "axios";

export default function getMessages(token, picture) {
  if (typeof window === "undefined") {
    return;
  }
  var formData = new FormData();
  formData.append("picture", picture);

  return new Promise((resolve, reject) => {
    axios
    .post(`${process.env.API_URL}/uploadPhoto`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}