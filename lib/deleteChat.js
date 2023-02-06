import axios from "axios";

export default function deleteChat(token, chat_id) {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
    .post(`${process.env.API_URL}/deleteChat`, { chat_id }, {
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