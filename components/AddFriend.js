import React from 'react';
import AddFriendIcon from "../public/images/add_friend.svg";
import SendIcon from "../public/images/send.svg";
import Modal from "./Modal";
import useToggle from "../hooks/useToggle";
import findUser from "../lib/findUser";
import createChat from "../lib/createChat";
import AppContext from "../context/AppContext";
import {debounce} from "debounce";
import AlertSvg from "../public/images/alert_error.svg";

export default function AddFriend() {
  const { isActive: isOpened, toggle } = useToggle();
  const [ users, setUsers ] = React.useState([]);
  const [ err, setErr ] = React.useState('');
  const appContext = React.useContext(AppContext);

  const setError = (errText) => {
    setErr(errText);

    setTimeout(() => {
      setErr('')
    }, 4000);
  };

  const setOpened = () => {
    toggle();
    setUsers([]);
  };

  const findUsers = debounce((e) => {
    if(e.target.value.length > 2) {
      findUser(e.target.value, appContext.user.id)
        .then((res) => {
          setUsers(res.data);
        })
        .catch((error) => {
          setUsers([error.response.data]);
        });
    } else {
      setUsers([]);
    }
  }, 1000);

  const createChats = (args) => {
    createChat(appContext.user.token, args[0])
      .then((res) => {
        setOpened();
      })
      .catch((error) => {
        if(error.response.data === "Chat exists") {
          setError(error.response.data)
        }
      })
  };


  return (
    <>
      {err && 
        <div className="error-box">
          <div className="error-box__alert">
            <AlertSvg />
          </div>
          <p className="error-box__text">{err || 'Something went wrong'}</p>
        </div>
      }
      <button type="button" className="friend-list__add-friend-action" onClick={setOpened}>
        <AddFriendIcon />
      </button>
      <Modal isOpened={isOpened} setOpened={setOpened}>
        <div className="search">
          <input placeholder="Your friend name..." className="search__input" onChange={findUsers}/>
        </div>
        <div className="results">
          {users &&
            users.map((user, key) => {
              if('username' in user) {
                return (
                  <div className="results__variant" key={key}>
                    {user.avatar ?
                      <img src={process.env.API_URL + '/' + user.avatar} alt="image" className="results__user-image" /> :
                      <img src="/images/sign_up.svg" alt="image" className="results__user-image" />
                    }
                    <p className="results__username">{user.username}</p>
                    <button className="results__add-action" onClick={createChats.bind(this, [user.id]) }>
                      <SendIcon />
                    </button>
                  </div>
                )
              } else {
                return (user.error)
              }
            })
          }
        </div>
      </Modal>
    </>
  );
}