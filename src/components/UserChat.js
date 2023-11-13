import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import ChatBox from './ChatBox';
// import { AiOutlineSetting } from 'react-icons/ai';
const UserChat = ({ connect, user }) => {
  const db = getDatabase();
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState("");

  const emojiClickHandler = (emojiData) => {
    setMessage(
      (message) =>
        message + (emojiData.isCustom ? emojiData.unified : emojiData.emoji)
    );
    setSelectedEmoji(emojiData.unified);
  }
  let submitChat = () => {
    setMessage('');
    set(push(ref(db, `chat/${connect?.connectId}/`)), {
      senderid: connect.senderid,
      recieverid: connect.recieverid,
      message: message,
      time: new Date().getTime()
    });
  };
  useEffect(() => {
    const friendRef = ref(db, `chat/${connect?.connectId}`);
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val());
      });
      setChats(arr);
    });
  }, [db, connect?.connectId]);
  return (
    connect &&
    <ChatBox
      chats={chats}
      connect={connect}
      user={user}
      message={message}
      onClick={submitChat}
      onChange={(e) => setMessage(e)}
      emojiClickHandler={(e) => emojiClickHandler(e)}
    />
  )
}

export default UserChat