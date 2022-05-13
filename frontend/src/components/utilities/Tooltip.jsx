import React, { useState, useEffect } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip';

export const Tooltip = ({ text, video, image }) => {
    const [isVisible, setIsVisible] = useState(false)
    const {
        getArrowProps,
        getTooltipProps,
        setTooltipRef,
        setTriggerRef,
        visible,
    } = usePopperTooltip({
        trigger: 'click',
        placement: 'bottom',
        closeOnOutsideClick: true,
        visible: isVisible,
        onVisibleChange: setIsVisible
    })


    return (
        <div className='hidden md:inline'>
            <i className="relative ml-2 fa-solid text-sm fa-circle-info" ref={setTriggerRef}></i>
            {visible && (
                <div
                    ref={setTooltipRef}
                    {...getTooltipProps({ className: "absolute z-10 flex flex-col justify-center items-center text-center tooltip-container p-4 w-max rounded-md" })}
                >
                    <h1 className='text-blue-800 w-max  text-lg font-semibold bg-white'>{text}</h1>
                    {image && <img className=' w-3/4 mx-auto' src={image.src} alt={image.alt} />}

                </div>
            )}
        </div>

    )
}
