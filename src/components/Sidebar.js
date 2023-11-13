import React, { useEffect, useState } from "react";
import { AiOutlineHome, AiFillMessage, AiOutlineSetting } from "react-icons/ai";
import { BsBell } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import { MdCloudUpload } from "react-icons/md";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import  { userLoginInfo } from "../slices/userSlice";
import { RotatingLines } from "react-loader-spinner";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDatabase, update, ref as stref } from "firebase/database";
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import SideButton from "./SideButton";

const Sidebar = () => {
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let data = useSelector((state) => state.userLoginInfo.userInfo);
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');

  const [image, setImage] = useState();
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState();
  const [loader, setLoader] = useState(false);
  const [imageuploadmodal, setImageUploadmodal] = useState(false);

  let handleImageupload = () => {
    setImageUploadmodal(true);
  };
  let handleImageUploadCancel = () => {
    setImageUploadmodal(false);
    setImage("");
    setCropData("");
    setCropper("");
  };

  const handleProfileUpload = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    setLoader(true);
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());

      const storageRef = ref(storage, auth.currentUser.uid);
      const message4 = cropper.getCroppedCanvas().toDataURL();
      uploadString(storageRef, message4, "data_url").then((snapshot) => {
        getDownloadURL(storageRef).then((downloadURL) => {
          updateProfile(auth.currentUser, {
            photoURL: downloadURL,
          }).then(() => {
            const users = stref(db, "users/" + data.uid);
            update(users, { profilePhoto:downloadURL});
            dispatch(userLoginInfo(auth.currentUser));
            localStorage.setItem("userInfo", JSON.stringify(auth.currentUser));
            setLoader(false);
            setImageUploadmodal(false);
            setImage("");
            setCropData("");
            setCropper("");
          });
        });
      });
    }
  };

  let handleLogOut = () => {
    signOut(auth)
      .then(() => {
        setTimeout(() => {
          dispatch(userLoginInfo(null));
          localStorage.removeItem("userInfo");
          navigate("/login");
        }, 500);
      })
      .catch((error) => {});
  };

  return (
    <div className="bg-primary h-screen rounded-3xl p-9">
      <div className="group relative w-28 h-28 rounded-full">
        <img
          className="w-full mx-auto h-full rounded-full"
          src={data && data.user?.photoURL}
          alt=""
        />
        <div className="mx-auto">
          <h3 className="font-nunito font-bold text-center text-xl text-white">
            {data && data.user?.displayName}
          </h3>
        </div>
        <div
          onClick={handleImageupload}
          className="bg-[rgba(0,0,0,.4)] w-full opacity-0 group-hover:opacity-100 h-full rounded-full absolute top-0 left-0 flex justify-center items-center"
        >
          <MdCloudUpload className="text-2xl text-white" />
        </div>
      </div>
      <SideButton active={path} target=''>
        <Link to={'/'}>
          <AiOutlineHome className="text-5xl m-auto " />
        </Link>
      </SideButton>
      <SideButton active={path} target='chat'>
        <Link to={'/chat'}>
          <AiFillMessage className="text-5xl m-auto" />
        </Link>
      </SideButton>
      <div className="relative after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-18px] after:left-0 z-[1] after:z-[-1] mt-24 after:rounded-tl-2xl after:rounded-bl-2xl before:w-[8px] before:h-[89px] before:bg-none before:absolute before:top-[-18px] before:right-[-36px] before:content-[''] before:rounded-tl-3xl before:rounded-bl-3xl">
        <BsBell className="text-5xl m-auto text-[#BAD1FF]" />
      </div>
      <div className="relative after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-18px] after:left-0 z-[1] after:z-[-1] mt-24 after:rounded-tl-2xl after:rounded-bl-2xl before:w-[8px] before:h-[89px] before:bg-none before:absolute before:top-[-18px] before:right-[-36px] before:content-[''] before:rounded-tl-3xl before:rounded-bl-3xl">
        <AiOutlineSetting className="text-5xl m-auto text-[#BAD1FF]" />
      </div>
      <div
        onClick={handleLogOut}
        className="relative after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-21px] after:left-0 z-[1] after:z-[-1] mt-24 after:rounded-tl-2xl after:rounded-bl-2xl before:w-[8px] before:h-[89px] before:bg-none before:absolute before:top-[-18px] before:right-[-36px] before:content-[''] before:rounded-tl-3xl before:rounded-bl-3xl"
      >
        <ImExit className="text-5xl m-auto text-[#BAD1FF]" />
      </div>
      {imageuploadmodal && (
        <div className="w-full h-screen bg-slate-600 absolute top-0 left-0 z-10 flex justify-center items-center">
          <div className="w-2/4 bg-white rounded-xl p-8">
            <h2 className="font-nunito font-bold text-5xl text-heading mb-3">
              Upload your profile
            </h2>
            {image ? (
              <div className="w-28 h-28 mx-auto overflow-hidden rounded-full">
                <div className="img-preview w-full h-full rounded-full" />
              </div>
            ) : (
              <img className="w-28 h-28 mx-auto rounded-full" src={data} alt="" />
            )}
            <input
              onChange={handleProfileUpload}
              className="mt-8"
              type="file"
            />
            {image ? (
              <Cropper
                className="mt-8"
                style={{ height: 400, width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
                guides={true}
              />
            ) : (
              ''
            )}
            <br />
            <div className="relative">
              {loader ? (
                <div className="ml-5">
                  <RotatingLines
                    strokeColor="green"
                    strokeWidth="4"
                    animationDuration="1"
                    width="72"
                    visible={true}
                  />
                </div>
              ) : (
                <>
                  <button
                    onClick={getCropData}
                    className="bg-green-600 font-nunito font-semibold text-xl text-white py-5 px-8 rounded mt-9"
                  >
                    Upload
                  </button>
                  <button
                    onClick={handleImageUploadCancel}
                    className="bg-red-600 font-nunito font-semibold text-xl text-white py-5 px-8 ml-4 rounded"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
