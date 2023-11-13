import React from 'react'

const SideButton = ({active, target, children}) => {
  return (
    <div className={`${active === target ? "relative text-primary after:bg-white after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-18px] after:left-0 z-[1] after:z-[-1] mt-24 after:rounded-tl-2xl after:rounded-bl-2xl before:w-[8px] before:h-[89px] before:bg-primary before:absolute before:top-[-18px] before:right-[-36px] before:content-[''] before:rounded-tl-3xl before:rounded-bl-3xl" : "relative text-[#BAD1FF] after:bg-none after:w-[135%] after:h-[89px] after:content-[''] after:absolute after:top-[-18px] after:left-0 z-[1] after:z-[-1] mt-24 after:rounded-tl-2xl after:rounded-bl-2xl before:w-[8px] before:h-[89px] before:bg-none before:absolute before:top-[-18px] before:right-[-36px] before:content-[''] before:rounded-tl-3xl before:rounded-bl-3xl" }`}>
        {children}
    </div>
  )
}

export default SideButton