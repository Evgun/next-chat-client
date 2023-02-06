import React from "react";
import App from "next/app";
import Cookie from "js-cookie";
import AppContext from "../context/AppContext";
import '../styles/index.scss';

class MyApp extends App {
  state = {
    user: null,
    chats: [],
    unread: [],
    lastMessage: [],
  };

  componentDidMount() {
    const token = Cookie.get("token") || localStorage.getItem("token");

    if (token) {
      fetch(process.env.API_URL + `/authed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(async (res) => {
        if (!res.ok) {
          Cookie.remove("token");
          this.setState({ 
            user: null,
            chats: [],
            unread: [],
            lastMessage: [],
          });
          
          return null;
        }
        const {user, chat} = await res.json();
        this.setUser(user);
        this.setChats(chat.result);
        this.setUnread(chat.count);
        this.setLastMessage(chat.lastMessage);
      });
    }
  }


  setLastMessage = (lastMessage) => {
    this.setState({ lastMessage });
  };

  setUnread = (unread) => {
    this.setState({ unread });
  };

  setChats = (chats) => {
    this.setState({ chats });
  };

  setUser = (user) => {
    this.setState({ user });
  };

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppContext.Provider
        value={{
          user: this.state.user,
          isAuthenticated: !!this.state.user,
          setUser: this.setUser,
          chats: this.state.chats,
          setChats: this.setChats,
          unread: this.state.unread,
          setUnread: this.setUnread,
          lastMessage: this.state.lastMessage,
          setLastMessage: this.setLastMessage,
        }}
      >
        <Component {...pageProps} />
      </AppContext.Provider>
    );
  }
}

export default MyApp;