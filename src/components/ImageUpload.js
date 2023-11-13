import React, { useState } from 'react'
import { BiImage } from 'react-icons/bi'
import { IoCloseOutline } from 'react-icons/io5'

const ImageUpload = () => {
    const [show, setShow] = useState(false);

    const imageHandler = (e) => {
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            console.log(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };
    return (
        <div>
            <BiImage onClick={() => setShow(true)} />
            {show &&
                <div className='w-60 absolute bottom-0 right-0'>
                    <div className='relative p-5'>
                        <IoCloseOutline className='absolute top-0 right-0 text-xl z-30' onClick={() => setShow(false)} />
                        <div className='relative'>
                            <p className='text-base p-3 bg-slate-200 capitalize cursor-pointer'>upload from files</p>
                            <input type='file' accept="image/*" className='opacity-0 w-full h-full absolute top-0 right-0 z-10 cursor-pointer'
                                onChange={(e) => imageHandler(e)}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default ImageUpload