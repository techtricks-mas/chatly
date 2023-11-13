import React, { useCallback, useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiFillMessage } from "react-icons/ai";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const UserList = ({reload}) => {
  const db = getDatabase();
  let [userlist, setUserList] = useState([]);
  let [friendrequest, setFriendrequest] = useState([]);
  let [friend, setFriend] = useState([]);
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [blocklist, setBlockList] = useState([]);

  let handleFriendRequest = (item) => {
    set(push(ref(db, "friendrequest")), {
      sendername: data.user.displayName,
      senderid: data.user.uid,
      senderPhoto: data.user.photoURL,
      recievername: item.username,
      recieverid: item.userid,
      recieverPhoto: item.profilePhoto,
    });
  };

  const updateUserList = useCallback((list) => {
    const friendrequestRef = ref(db, "friendrequest");
    onValue(friendrequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().recieverid !== data.user.uid) {
          arr.push(item.val().recieverid + item.val().senderid);
        }
        else{
          const userIndex = list.findIndex((items) => items.userid === item.val().senderid)
          const newUserList = [...list];
          newUserList.splice(userIndex, 1);
          setUserList(newUserList)
        }
      });
      setFriendrequest(arr);
    });

    const friendRef = ref(db, "friend");
    onValue(friendRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().recieverid === data.user.uid || item.val().senderid === data.user.uid) {
          const userIndex = list.findIndex((items) => items.userid === item.val().senderid || item.val().recieverid === items.userid)
          const newUserList = [...list];
          newUserList.splice(userIndex, 1);
          setUserList(newUserList)
        }
      });
      setFriend(arr);
    });

    const blockRef = ref(db, "blocklist");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (item.val().blockbyid === data.user.uid || item.val().blockid === data.user.uid) {
          const userIndex = list.findIndex((items) => items.userid === item.val().blockbyid || item.val().blockid === items.userid)
          const newUserList = [...list];
          newUserList.splice(userIndex, 1);
          setUserList(newUserList)
        }
      });
      setBlockList(arr);
    });
  }, [data.user.uid, db]);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (data.user.uid !== item.key) {
          arr.push({ ...item.val(), userid: item.key });
        }
      });
      setUserList(arr);
      updateUserList(arr);
    });
  }, [data, db, updateUserList, reload]);

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-solid border-black border-opacity-5 w-full py-3 px-6 pb-5 h-[463px] mr-10 overflow-y-scroll">
      <h3 className="font-poppins text-xl font-semibold">User List</h3>
      <div className="relative">
        <BsThreeDotsVertical className="text-lg text-primary absolute top-[-16px] right-[7px]" />
      </div>
      {userlist.length === 0 ?
        <div className="flex justify-center items-center h-full">
        <h1 className="font-nunito font-bold text-xl text-black">No User available</h1>
      </div>
      :userlist.map((item, index) => (
        item.userid !== data.user.uid &&
        <div key={index} className="flex mt-4 pt-5 after:w-[400px] after:h-px after:bottom-[-18px] after:left-1 after:content-[''] relative after:absolute after:bg-[#BFBFBF]">
          <img
            className="w-[70px] h-[70px] rounded-full mt-0.5"
            src={item.profilePhoto}
            alt="Profile pic"
          />
          <div className="pl-6 w-[190px] pt-1.5">
            <h3 className="font-poppins font-bold text-lg">{item.username}</h3>
            <h5 className="font-poppins w-[210px] overflow-hidden hover:overflow-visible hover:font-bold hover:z-10 hover:rounded-xl duration-100 font-medium text-[#797979] text-sm">
              {item.email}
            </h5>
          </div>
          <div className="ml-7 mt-3">
            {friend.includes(item.userid + data.user.uid) ||
            friend.includes(data.user.uid + item.userid) ? (
              <button className="font-poppins font-semibold text-xl bg-primary duration-200 text-white px-5 py-2 hover:py-2.5 hover:px-6 hover:mt-[-2px] rounded-xl hover:bg-themes ml-6">
                <AiFillMessage />
              </button>
            ) : friendrequest.includes(item.userid + data.user.uid) ||
              friendrequest.includes(data.user.uid + item.userid) ? (
              <button className="font-poppins font-semibold text-xl bg-gray-700 duration-100 text-white px-3 py-1.5 rounded-xl">
                Pending
              </button>
            ) : blocklist.includes(item.userid + data.user.uid) ||
              blocklist.includes(data.user.uid + item.userid) ? (
              <button className="font-poppins font-semibold text-xl bg-gray-700 duration-100 text-white px-4 py-1.5 rounded-xl">
                Blocked
              </button>
            ) : (
              <button
                onClick={() => handleFriendRequest(item)}
                className="font-poppins font-semibold text-xl bg-green-600  duration-200 text-white px-6 py-1.5 hover:mt-[-2px] hover:py-2 hover:px-7 rounded-xl hover:shadow-lg ml-6"
              >
                +
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
