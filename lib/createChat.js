import axios from "axios";

export default function createChat(token, friend_id) {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.API_URL}/createChat`, { friend_id }, {
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