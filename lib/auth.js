import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

export const registerUser = (user_name, user_email, user_pass) => {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.API_URL}/register`, { user_name, user_email, user_pass })
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

export const login = (user_email, user_pass, remember) => {
  if (typeof window === "undefined") {
    return;
  }

  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.API_URL}/`, { user_email, user_pass })
      .then((res) => {
        if (remember) {
          localStorage.setItem("token", res.data.user.token);
        }
        Cookie.set("token", res.data.user.token);

        resolve(res);
        Router.push("/chat");
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = () => {
  localStorage.clear();
  Cookie.remove("token");
};
