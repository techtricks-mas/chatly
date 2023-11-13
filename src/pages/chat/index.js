import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Friends from "../../components/Friends";
import MyGroups from "../../components/MyGroups";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import ChatBox from '../../components/UserChat';
import UserChat from "../../components/UserChat";
import GroupChat from "../../components/GroupChat";

const Chat = () => {
  let navigate = useNavigate();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  const [chatType, setChatType] = useState('single');
  const [chatUser, setChatUser] = useState('');
  const chatHandler = (e) => {
    const userdata = {};
    userdata.connectId = `${e.recieverid}_${e.senderid}`;
    userdata.recieverid = data.user.uid === e.senderid ? e.recieverid : e.senderid;
    userdata.recievername = data.user.uid === e.senderid ? e.recievername : e.sendername;
    userdata.senderid = data.user.uid;
    userdata.photo = data.user.uid === e.senderid ? e.recieverPhoto : e.senderPhoto;
    setChatType('single')
    setChatUser(userdata);
  }
  const groupChatHandler = (e) => {
    const userdata = {};
    userdata.connectId = `${e.key}`;
    userdata.recieverid = 'all';
    userdata.recievername = e.groupName;
    userdata.senderid = data.user.uid;
    userdata.photo = e.photo ? e.photo : 'images/groupimg.png';
    setChatType('group')
    setChatUser(userdata);
  }

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, [data]);
  return (data && (
    <div className="flex justify-evenly">
      <div className="w-[200px]">
        <Sidebar />
      </div>
      <div className="w-1/4">
        <Search />
        <MyGroups title={'Groups'} openChat={groupChatHandler} />
        <Friends openChat={chatHandler} />
      </div>
      <div className="w-2/4">
        {chatType === 'single' ? <UserChat connect={chatUser} user={data.user} /> : <GroupChat connect={chatUser} user={data.user} />}
      </div>
    </div>
  ))
}

export default Chat