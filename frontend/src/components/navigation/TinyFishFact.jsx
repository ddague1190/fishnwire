import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { getFishSpecies } from "../../redux/actions/promoActions"
import { motion } from "framer-motion"

const TinyFishFact = ({ fish: [id, setId] }) => {
    const { fish: { Biology, images } } = useSelector((state) => state.fishFact);
    const ref = useRef()
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getFishSpecies(id % 100))

        return setId(id + 1)
    }, []);


    const onLoadHandler = () => {
        if (!show) {
            setShow(true)
        }
    }
    return (
        <>
            <motion.article initial={{ x: -50, y: -600 }} animate={{ y: -30 }} className='relative flex items-center justify-center'>
                {images &&
                    <div className={show ? 'absolute top-0 w-full text-center flex flex-col' : 'hidden'}>
                        <img ref={ref} onLoad={onLoadHandler} src={images} alt='fishfact' className="absolute p-2 z-50 w-96 object-contain overflow-visible rounded-full border-2 border-blue-400 bg-blue-500 aspect-square " />
                        <span className="absolute text-center w-full z-50 bg-blue-500 text-white font-semibold text-xl tracking-tighter">{Biology}</span>
                    </div>
                }
            </motion.article>

        </>
    )
}

export default TinyFishFact