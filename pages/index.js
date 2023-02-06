import React from 'react';
import Head from "next/head";
import Link from "next/link";
import AppContext from "../context/AppContext";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

export default function Index() {
  const appContext = React.useContext(AppContext);
  const router = useRouter();

  React.useEffect(() => {
    const token = Cookie.get("token") || localStorage.getItem("token");

    if (!token && appContext.user) {
      appContext.setUser(null);
      appContext.setChats([]);
      appContext.setUnread([]);
      appContext.setLastMessage([]);
      appContext.isAuthenticated = false;
    }
    if (appContext.isAuthenticated) {
      router.push("/chat");
    }
  }, [appContext]);


  return(
    <>
      <Head>
        <title>
          Messenger
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="wrapper">
        <img className="chat-logo" src='/images/logo.png' alt="text" />
        <div className="controls">
        <Link href="/login">
          <button className="btn link">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="btn link">
            Sign Up
          </button>
        </Link>
        </div>
      </div>
    </>
  );
}