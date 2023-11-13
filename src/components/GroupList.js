import React, { useEffect, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useSelector } from "react-redux";

const GroupList = () => {
  const db = getDatabase();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  let [show, setShow] = useState(false);
  let [groupName, setGroupName] = useState("");
  let [groupTag, setGroupTag] = useState("");
  let [groups, setGroups] = useState([]);
  let [groupPending, setGroupPending] = useState([]);

  let handleGroupCreateButton = () => {
    setShow(!show);
  };

  let handleCreateGroup = () => {
    if (groupName && groupTag) {
      set(push(ref(db, "group")), {
        groupName: groupName,
        groupTag: groupTag,
        adminId: data.user.uid,
        adminName: data.user.displayName,
        adminPhoto: data.user.photoURL,
      }).then((res) => {
        // chnages = `${groupName}-${groupTag}`;
        setShow(false);
      });
    }
  };

  let handleGroupRequest = (item) => {
    set(push(ref(db, "groupRequest")), {
      adminId: item.adminId,
      adminName: item.adminName,
      groupId: item.key,
      groupName: item.groupName,
      groupTag: item.groupTag,
      userId: data.user.uid,
      userName: data.user.displayName,
      userPhoto: data.user.photoURL,
    });
  };

  useEffect(() => {
    const groupRef = ref(db, "group");
    let arr = [];
    onValue(groupRef, (snapshot) => {
      snapshot.forEach((item) => {
        if (data.user.uid !== item.val().adminId) {
          arr.push({ ...item.val(), key: item.key });
        }
      });
    });
    const groupListRef = ref(db, "groupMember");
    onValue(groupListRef, (snapshot) => {
      snapshot.forEach((item) => {
        const checkArr = arr.findIndex((arrItem) => item.val().groupId === arrItem.key && item.val().memberId === data.user.uid);
        if (checkArr > -1) {
          arr.splice(checkArr, 1);
        }
      });
    });
    setGroups(arr);

    const groupRequestRef = ref(db, "groupRequest");
    onValue(groupRequestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().groupId + item.val().userId);
      });
      setGroupPending(arr);
    });

  }, [data.user.uid, db]);

  return (
    <div className="bg-white rounded-3xl border border-solid border-black border-opacity-5 shadow-xl w-full py-3 mt-11 px-6 pb-5 h-[360px] overflow-y-scroll">
      <div className="flex justify-between mb-5">
        <h3 className="font-poppins text-xl font-semibold">Group List</h3>
        <button
          onClick={handleGroupCreateButton}
          className="font-poppins font-semibold text-base text-white px-3 py-1 rounded-md bg-primary"
        >
          {show ? "Back" : "Create Group"}
        </button>
      </div>
      {show ? (
        <div>
          <input
            className="border-2 w-full outline-none rounded-lg py-3 px-2 placeholder:font-poppins font-poppins font-semibold mb-5"
            placeholder="Group Name"
            maxLength={15}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <input
            className="border-2 w-full outline-none rounded-lg py-3 px-2 placeholder:font-poppins font-poppins font-semibold mb-5"
            placeholder="Group Tag"
            maxLength={15}
            onChange={(e) => setGroupTag(e.target.value)}
          />
          <button
            onClick={handleCreateGroup}
            className="w-full rounded-lg bg-green-500 text-white font-poppins font-semibold text-base hover:text-lg hover:mt-[-1px] hover:drop-shadow-lg duration-300 py-3"
          >
            Create Group
          </button>
        </div>
      ) : (
        <>
          {groups.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <h1 className="font-nunito font-bold text-xl text-black">
                No groups available
              </h1>
            </div>
          ) : (
            groups.map((item, index) => (
              <div key={index} className="flex justify-between mt-4 pt-5 w-full relative after:w-[400px] after:h-px after:bottom-[-13px] after:left-1 after:content-['']  after:absolute after:bg-[#BFBFBF]">
                <div className="flex">
                  <img
                    className="w-[70px] h-[70px]"
                    src="images/groupimg.png"
                    alt=""
                  />
                  <div className="ml-6 mt-2">
                    <h5 className="font-poppins font-regular text-[#797979] text-base">
                      Admin:{item.adminName}
                    </h5>
                    <h3 className="font-poppins tracking-wider font-bold text-lg">
                      {item.groupName}
                    </h3>
                    <h5 className="font-poppins font-medium text-[#797979] text-sm">
                      {item.groupTag}
                    </h5>
                  </div>
                </div>
                <div className="mr-1 mt-4">
                  {groupPending.includes(item.key + data.user.uid) ||
                    groupPending.includes(data.user.uid + item.key) ? (
                    <button
                      className="font-poppins font-semibold text-xl text-white px-3 py-1 rounded-md bg-red-600"
                    >
                      Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleGroupRequest(item)}
                      className="font-poppins font-semibold text-xl text-white px-6 py-1 rounded-md bg-green-600"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default GroupList;
