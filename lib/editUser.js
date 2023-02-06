import axios from "axios";
import Cookie from "js-cookie";

export default function editUser (token, user_name = '', user_email = '', user_pass = '') {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.API_URL}/dataEditing`, { user_name, user_email, user_pass }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        Cookie.set("token", res.data.user.token);
        resolve(res);
        Router.push("/");
      })
      .catch((error) => {
        reject(error);
      });
  });
};