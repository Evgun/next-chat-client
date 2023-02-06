import React, { Children } from 'react';
import AppContext from "../context/AppContext";
import { useRouter } from "next/router";
import SendIcon from "../public/images/send.svg";
import AddFriend from "../components/AddFriend";
import Menu from "../components/Menu";
import io from 'socket.io-client'
import Head from "next/head";
import classNames from 'classnames';
import getMessages from '../lib/getMessages';
import getMsg from '../lib/getMsg';
import deleteChat from '../lib/deleteChat';
import deleteMessage from '../lib/deleteMessage';
import moment from 'moment';
import Modal from '../components/Modal';
import Cookie from "js-cookie";
import DoubleCheckSVG from '../public/images/double_check.svg';
import CheckSVG from '../public/images/check.svg';

function useSocket(url) {
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const socketIo = io(url)

    setSocket(socketIo)

    function cleanup() {
      socketIo.disconnect()
    }
    return cleanup
  }, [])

  return socket
}

export default function Chat() {
  const appContext = React.useContext(AppContext);
  const router = useRouter();
  const socket = useSocket(process.env.API_URL);
  const [messages, setMessages] = React.useState([]);
  const [messageText, setMessageText] = React.useState('');
  const [activeChat, setActiveChat] = React.useState(null);
  const [deleteChatModal, setDeleteChatModal] = React.useState(false);
  const [deleteMessageModal, setDeleteMessageModal] = React.useState(false);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    if (!appContext.isAuthenticated) {
      return router.push("/");
    }
  }, [appContext]);
  
  React.useEffect(() => {
    if (socket) {
      socket.emit('connected', Cookie.get("token"));
    }
  }, [socket])

  React.useEffect(() => {
    if(appContext.isAuthenticated) {
      getMsg(appContext.user.token, activeChat).then((res) => {
      })
    }
  }, [activeChat])


  React.useEffect(() => {
    function handleNewMessages(chatId) {
      getMessages(appContext.user.token, chatId)
      .then((res) => {
          if(chatId === activeChat) {
            setMessages(res.data.messages);
            let objDiv = document.getElementById("msg");
            objDiv.scrollTop = objDiv.scrollHeight;
          }
          res.data.chat.count.map((item) => {
            if(item.chat_id === activeChat) {
              getMsg(appContext.user.token, activeChat).then((res) => {
              })
            }
          })
          appContext.setChats(res.data.chat.result);
          appContext.setLastMessage(res.data.chat.lastMessage);
          appContext.setUnread(res.data.chat.count);
        })
        .catch((error) => {
          setMessages([]);
        });
    }
    
    if (socket) {
      socket.on('sendMessages', handleNewMessages);
    }
    return () => socket && socket.off('sendMessages', handleNewMessages);
  }, [socket, activeChat, appContext])
  
  
  function getMessage(chat_id) {
    setActiveChat(chat_id);
  };


  function handleMessageChange(e) {
    setMessageText(e.target.value);
  };

  function handleSendMessage() {
    if (messageText.trim() !== '' && activeChat !== null){
      socket.emit('message', messageText, activeChat);
      setMessageText('');
    }
  } 

  function hadleDeleteChat(e, id) {
    e.preventDefault();
    getMessage(id);
    setDeleteChatModal(id);
  }

  function delChat(id) {
    deleteChat(appContext.user.token, id)
      .then((res) => {
        setDeleteChatModal(false);
        setMessages([]);
      })
  }

  function hadleDeleteMessage(e, id) {
    e.preventDefault();
    setDeleteMessageModal(id);
  }

  function delMessage(id) {
    deleteMessage(appContext.user.token, id).then((res) => {
    })
    setDeleteMessageModal(false);
  }

  function handleKeyPress(e) {
    if(e.key === 'Enter'){
      handleSendMessage();
    }
  }

  function handleSearchInChat(e) {
    setSearch(e.target.value);
  }
  
  return(
    <>
      <Head>
        <title>
          Chats
        </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="container">
        <Modal isOpened={deleteMessageModal} setOpened={() => setDeleteMessageModal(false)}>
          <div className="delete-message">
            <h1 className="delete-message__title">Delete</h1>
            <div className="delete-message__actions">
              <button className="delete-message__action" onClick={() => delMessage(deleteMessageModal)}>
                Ok
              </button>
              <button className="delete-message__action" onClick={() => setDeleteMessageModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <Modal isOpened={deleteChatModal} setOpened={() => setDeleteChatModal(false)}>
          <div className="delete-message">
            <h1 className="delete-message__title">Delete</h1>
            <div className="delete-message__actions">
              <button className="delete-message__action" onClick={() => delChat(deleteChatModal)}>
                Ok
              </button>
              <button className="delete-message__action" onClick={() => setDeleteChatModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
        <div className="friend-list">
          <div className="friend-list__actions">
            <Menu />
            <input placeholder="Search..." className="friend-list__find-in-chats" value={search} onChange={(e) => handleSearchInChat(e)}/>
            <AddFriend />
          </div>
          <div className="friend-list__chats">
            {appContext.chats.length > 0 && appContext.user  ? 
              appContext.chats.map((chat, id) => {
                let flag = null, lastMessage = '';
                appContext.unread.map((item) => {
                  if (item.chat_id === chat.chat_id) {
                    flag = item.count;
                  }
                })
                appContext.lastMessage.map((item) => {
                  if (item.chat_id === chat.chat_id) {
                    lastMessage = item.contect;
                  }
                })
                if(chat.name == null && !(!chat.username.includes(search) && search.length > 3))
                {
                  return (
                    <button 
                      className={
                        classNames("friend-list__choose-chat-action",
                          {
                            "friend-list__choose-chat-action--active": chat.chat_id === activeChat,
                          }
                        )
                      }
                      key={id}
                      onClick={() => getMessage(chat.chat_id)}
                      onContextMenu={(e) => hadleDeleteChat(e, chat.chat_id)}
                    >
                    {chat.avatar ?
                      <img src={process.env.API_URL+'/' + chat.avatar} alt="image" className="friend-list__chat-image" /> :
                      <img src="/images/sign_up.svg" alt="image" className="friend-list__chat-image" />
                    }
                      <div className="friend-list__chat-info">
                        <h3 className="friend-list__chat-name">{chat.username}</h3>
                        <p className="friend-list__last-message">{lastMessage || 'No messages yet'}</p>
                      </div>
                      {flag &&
                        <div className="friend-list__count">
                          {flag}
                        </div>
                      }
                    </button>
                  );
                } else if(chat.name != null && !(!chat.name.includes(search) && search.length > 3)) {
                  return (
                    <button
                      className={
                        classNames("friend-list__choose-chat-action",
                          {
                            "friend-list__choose-chat-action--active": chat.chat_id === activeChat
                          }
                        )
                      }
                      key={id}
                      onClick={() => getMessage(chat.chat_id)}
                      onContextMenu={(e) => hadleDeleteChat(e, chat.chat_id)}
                    >
                      <img src="/images/sign_up.svg" alt="image" className="friend-list__chat-image" />
                      <div className="friend-list__chat-info">
                        <h3 className="friend-list__chat-name">{chat.name}</h3>
                        <p className="friend-list__last-message">{lastMessage || 'No messages yet'}</p>
                      </div>
                      {flag &&
                        <div className="friend-list__count">
                          {flag}
                        </div>
                      }
                    </button>
                  );
                }
              }) : (
                <p className="friend-list__no-chats">No chats exsists</p>
              )
            }
          </div>
        </div>
        <div className="chat">
          <div id="msg" className="chat__test-container">
            <div className="chat__container">
              {messages.length > 0 ? 
                messages.map((item, id) => {
                  return(
                    <span className={classNames("chat__message", 
                        {
                          "chat__message--friend": item.id !== appContext.user.id,
                          "chat__message--your": item.id === appContext.user.id
                        }
                      )}
                      key = {id}
                      onContextMenu={(e) => hadleDeleteMessage(e, item.message_id)}
                    >
                      <p className="chat__username">
                        {item.username}
                      </p>
                      {item.contect}
                      <p className="chat__date-created">
                        {
                          moment(item.date_create).format('HH:mm DD-MM-YYYY') + ' '
                        }
                        
                        {item.id === appContext.user.id && (item.is_read === 0 ? 
                          <span className="chat__is-read"><CheckSVG /></span> :
                          <span className="chat__is-read"><DoubleCheckSVG /></span> )
                        }
                      </p>
                    </span>
                  )
                }) : (
                  <p className="chat__no-messages">
                    No messages exist
                  </p>
                )
              }
            </div>
          </div>
          <div className="chat__input">
            <input
              placeholder="Your message..."
              className="chat__message-input"
              value={messageText}
              onChange={handleMessageChange}
              onKeyPress={handleKeyPress}
            />
            <button
              type="button"
              className="chat__action-btn"
              onClick={handleSendMessage}
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
