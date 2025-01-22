import React, { useContext, useState } from 'react'
import InputField from "./InputField"
import Input from "./Input";
import SignField from "./SignField";
import Popup from "./Popup";
import { motion } from "framer-motion"
import { ActionContext } from "./QASectionActionContext.jsx";

const Answer = ({ answer, parentId, index }) => {
    const [edit, setEdit] = useState(false)
    const actions = useContext(ActionContext)
    const colors = [
        'red',
        'gray',
        'green',
        'purple',
        'yellow',
        'pink',
    ]

    return (
        <>
            {!edit ? <div className="flex flex-row py-2">

                <div className="">
                    <p className="w-full text-black">{answer.text}</p>
                    <div className="flex items-center gap-2 ">
                        <span className="text-xs">posted by</span>
                        <div className="bg-white rounded-md w-max flex gap-2 items-center">
                            <div className="flex ml-2 text-black text-xs ">{answer.fullName} </div>

                            <div>
                                {answer.avatarUrl ?
                                    <img
                                        src={answer.avatarUrl}
                                        style={{ width: 20, height: 20, borderRadius: 24 / 2 }}
                                        alt='userIcon'
                                    /> :
                                    <i style={{ backgroundColor: colors[index] }}
                                        className="fa-solid fa-user text-xs rounded-full w-6 flex items-center justify-center h-6"></i>
                                }
                            </div>
                        </div>
                        <span className="text-xs">on</span>

                        <time className="text-xs text-black" dateTime={answer.createdAt}>{answer.createdAt.slice(0, 10)}</time>
                    </div>

                </div>

                <div className=" ml-auto">
                    {actions.username === answer.fullName &&

                        <Popup answerId={answer.comId} questionId={parentId} setEdit={setEdit} />
                    }
                </div>
            </div>
                :
                <InputField
                    cancellor={answer.comId}
                    value={answer.text}
                    child={answer.comId}
                    parentId={parentId}
                    edit
                    setEdit={setEdit}
                    placeholder={answer.text}
                />
            }
        </>
    )

}

const Answers = ({ answers, parentId }) => {
    const [open, setOpen] = useState(false)
    const actions = useContext(ActionContext)

    const [showInput, setShowInput] = useState(false)

    return (<div className="relative">
        <div className="flex">
            <span className="ml-2 text-2xl w-20 mt-2 font-extrabold">A:</span>

            <div className="relative w-full h-full">
                {/* {(answers.length === 0) ?

                    showInput ?

                        <motion.div initial={{ x: 200 }} animate={{ x: 0 }} className=" w-full flex justify-center">
                            {!actions.username ? <SignField placeholder='to add an answer' /> : <Input parentId={parentId} placeholder='Have an answer?' />}
                        </motion.div> :
                        <span onClick={() => { setShowInput(true) }} className="cursor-pointer font-extrabold text-gray-300 text-center w-full block p-2 text-lg tracking-tighter hover:scale-[1.01]">ADD AN ANSWER</span> : ""

                } */}

                {answers.length > 0 &&
                    <div className="w-full h-full">
                        <Answer key={0} index={0} parentId={parentId} answer={answers[0]} />
                    </div>
                }
                {open ?
                    <>
                        {answers.map((answer, index) => {
                            if (index > 0) {

                                return (
                                    <Answer key={index} index={index} parentId={parentId} answer={answer} />
                                )
                            }
                        })}

                    </>
                    : answers.length > 1 ? <div className="-translate-x-10 cursor-pointer font-extrabold text-gray-300 text-center w-full block p-2 text-lg tracking-tighter hover:scale-[1.01]" onClick={() => setOpen(true)}>SEE MORE</div> 
                    : 
                    showInput ?

                        <motion.div initial={{ x: 200 }} animate={{ x: 0 }} className=" w-full flex justify-center">
                            {!actions.username ? <SignField placeholder='to add an answer' /> : <Input parentId={parentId} placeholder='Have an answer?' />}
                        </motion.div> :
                        <span onClick={() => { setShowInput(true) }} className="-translate-x-10 cursor-pointer py-2 font-extrabold text-gray-300 text-center w-full block p-2 text-lg tracking-tighter hover:scale-[1.01]">ADD AN ANSWER</span>

                    
                }
                {open &&
                    <span onClick={() => setOpen(false)} className="text-lg text-gray-300 p-2 pt-0 block w-full  text-right font-extrabold bottom-0 right-0"><i className="fa-solid fa-x"></i></span>
                }
            </div>

        </div>

    </div >
    )

}

export default Answers