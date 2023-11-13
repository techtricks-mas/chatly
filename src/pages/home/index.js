import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BlockedUser from "../../components/BlockedUser";
import Friends from "../../components/Friends";
import FrirendRequest from "../../components/FrirendRequest";
import GroupList from "../../components/GroupList";
import MyGroups from "../../components/MyGroups";
import Search from "../../components/Search";
import Sidebar from "../../components/Sidebar";
import UserList from "../../components/UserList";

const Home = () => {
  let navigate = useNavigate();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  const [changes, setChanges] = useState({
    grouplist: '',
    friend: '',
    groups: '',
    users: '',
    blocks: '',
  });
  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, [data]);

  const friendHandler = (e) => {
    const oldData = {...changes}
    oldData.friend = e;
    setChanges(oldData)
  }

  return (data && (
        <div className="flex justify-evenly">
          <div className="w-[200px]">
            <Sidebar />
          </div>
          <div className="w-1/4">
            <Search />
            <GroupList/>
            <FrirendRequest onClick={friendHandler}/>
          </div>
          <div className="w-1/4">
            <Friends onClick={friendHandler}/>
            <MyGroups title={'My Groups'}/>
          </div>
          <div className="w-1/4">
            <UserList reload={changes.friend}/>
            <BlockedUser />
          </div>
        </div>
      ))

};

export default Home;
