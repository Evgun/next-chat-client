import axios from "axios";

export default function findUser(user_name, id) {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.API_URL}/selectUser`, { user_name, id })
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
}