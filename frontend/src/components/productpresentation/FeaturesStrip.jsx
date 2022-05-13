import React from 'react'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import useViewport from "../../utils/useViewport"


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


const FeaturesStrip = ({ details }) => {

    useViewport()
    const [hasImages, setHasImages] = useState(false)
    const [breakpoint, setBreakpoint] = useState(Infinity)
    const { width } = useSelector(state => state.dimensions)

    useEffect(() => {
        if (details) {
            details.map((detail) => {
                if (!!detail.image) {
                    setHasImages(true)
                }
            })
        }
        
    }, [details])


    useEffect(() => {
        if(hasImages) setBreakpoint(560)
    }, [hasImages])


    return (
        <>
            {details &&

                <section className="mt-8 py-12 px-4 sm:py-16 sm:px-6 lg:px-8  border-t text-lg  border-gray-200 bg-[#FF5656]">
                    <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200 divide-opacity-40">
                        <h1 className="p-2 text-white text-2xl font-extrabold ">Features...</h1>
                        <div className="p-6  p text-lg rose prose-sm text-white">
                            <ul className={classNames((width > breakpoint) ? 'flex justify-evenly flex-row' : '')} >
                                {details.map(({ detail, image }, index) => {

                                    if (width > breakpoint) {
                                        return (
                                            <li className="list-none gap-x-4 flex flex-col w-20 rounded-md  relative" key={index}>
                                                <img alt={`Icon depicted the product detail ${detail}`}className=" object-cover opacity-80 w-20 h-20 rounded-lg" src={image} />
                                                <span className="py-2 text-xs text-center font-bold tracking-tighter -bottom-1/2">{detail}</span>
                                            </li>
                                        )
                
                                    } else {

                                        return (

                                            <li className="list-disc" key={index}>
                                                {detail}
                                            </li>
                                        )
                                    }
                                })}
                            </ul>

                        </div>

                    </div>
                </section>
            }
        </>
    )
}

export default FeaturesStrip