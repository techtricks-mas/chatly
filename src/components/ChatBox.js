import React, { useEffect, useRef, useState } from 'react'
import { BiDotsVerticalRounded, BiSmile, BiImage } from "react-icons/bi";
import { IoIosSend } from "react-icons/io";
import FormatDate from './FormatDate';
import EmojiPicker from 'emoji-picker-react';
import ImageUpload from './ImageUpload';

const ChatBox = ({ chats, connect, user, message, onChange, onClick, emojiClickHandler }) => {
    const imojiRef = useRef();
    const [show, setShow] = useState(false);
    useEffect(() => {
        document.body.addEventListener("click", (e) => {
            if (imojiRef.current && !imojiRef.current.contains(e.target)) {
                setShow(false);
            }
        });
    }, []);
    return (
        <div className='pt-10 max-h-screen'>
            <div className='flex justify-between items-center pb-5 border-b'>
                <div className='flex justify-around items-center gap-5'>
                    {/* <div className="group relative w-24 h-24 rounded-full after:absolute after:contents[''] after:h-3 after:w-3 after:border-2 after:bg-teal-400 after:rounded-full after:bottom-0 after:right-5"> */}
                    <div className="group relative w-24 h-24 rounded-full">
                        <img
                            className="w-full mx-auto h-full rounded-full"
                            src={connect?.photo}
                            alt=""
                        />
                    </div>
                    <div>
                        <h3 className="font-nunito font-bold text-center text-xl text-black">
                            {connect?.recievername}
                        </h3>
                    </div>
                </div>
                <div className='text-4xl cursor-pointer'>
                    <BiDotsVerticalRounded />
                </div>
            </div>
            <div className='max-h-[70vh] h-[100vh] overflow-y-auto py-5'>
                {chats &&
                    chats.map((chat, index) => (chat.senderid === connect?.recieverid || chat.senderid !== user?.uid ?
                        <div key={index} className='mx-4 mt-5 flex items-start group'>
                            <div>
                                <div className='py-2 px-5 relative bg-slate-300 text-black inline-block rounded-md'>
                                    <div className='border-b-slate-300 w-0 h-0 border-[15px] border-solid border-transparent absolute rounded-lg -left-[15px] bottom-[0.5px]'></div>
                                    {chat?.message}
                                </div>
                                <p className='mt-2 font-nunito text-sm text-slate-400'>{FormatDate(chat?.time)}</p>
                            </div>
                            <div className='text-4xl cursor-pointer opacity-0 duration-300 group-hover:opacity-100'>
                                <BiDotsVerticalRounded />
                            </div>
                        </div>
                        :
                        <div key={index} className='mx-4 mt-5 flex items-start group justify-end'>
                            <div className='text-4xl cursor-pointer opacity-0 duration-300 group-hover:opacity-100'>
                                <BiDotsVerticalRounded />
                            </div>
                            <div>
                                <div className='py-2 px-5 relative bg-primary text-white inline-block rounded-md'>
                                    <div className='border-b-primary w-0 h-0 border-[15px] border-solid border-transparent absolute rounded-lg -right-[15px] bottom-0'></div>
                                    {chat?.message}
                                </div>
                                <p className='mt-2 font-nunito text-sm text-slate-400 text-right'>{FormatDate(chat?.time)}</p>
                            </div>
                        </div>)
                    )
                }

            </div>
            <div className='py-5 border-t flex justify-between items-center gap-5'>
                <div className='bg-slate-300 relative rounded-md w-full h-11'>
                    <textarea rows={1} className='h-full pl-5 pr-32 w-full text-lg bg-transparent focus:outline-none resize-none' value={message} onChange={(e) => onChange(e.target.value)}></textarea>
                    <div ref={imojiRef} className='text-black text-3xl absolute right-16 top-1/2 -translate-y-1/2 cursor-pointer'>
                        <BiSmile onClick={(e) => setShow(!show)} />
                        {show &&
                            <div className='absolute right-10 bottom-0 font-nunito text-base'>
                                <EmojiPicker
                                    onEmojiClick={(e) => emojiClickHandler(e)}
                                    previewConfig={{
                                        showPreview: false
                                    }}
                                />
                            </div>
                        }
                    </div>
                    <div className='text-black text-3xl absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer'>
                        <ImageUpload />
                    </div>
                </div>
                <div className='p-3 bg-primary text-xl text-white rounded' onClick={() => onClick()}>
                    <IoIosSend />
                </div>
            </div>
        </div>
    )
}

export default ChatBox