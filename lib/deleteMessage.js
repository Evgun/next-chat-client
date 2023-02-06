import axios from "axios";

export default function deleteMessage(token, message_id) {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
    .post(`${process.env.API_URL}/deleteMessage`, { message_id }, {
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