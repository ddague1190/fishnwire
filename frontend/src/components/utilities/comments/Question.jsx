import React, { useContext, useState } from 'react'
import Popup from "./Popup"
import {
    modal,
    modalClose,
    modalHeader,
    modalContent,
    modalActions,
    modalActionBtn,
    modalDelBtn
} from './ModalStyles'
import InputField from "./InputField"
import Answers from "./Answers"
import { useEffect } from "react"
import { ActionContext } from "./QASectionActionContext.jsx"

const Question = ({ question, index }) => {
    const actions = useContext(ActionContext);
    const [edit, setEdit] = useState(false)
    const colors = [
        'red',
        'gray',
        'green',
        'purple',
        'yellow',
        'pink',
    ]
    const color = colors[index % 5]


    return (
        <>

            <div className="flex w-full">
                <div
                    className=" py-4 flex flex-row justify-center items-center w-full"
                >
                    <p className="text-2xl w-20 ml-2 text-blue-500 font-extrabold">Q:</p>
                    {!edit ?
                        <>
                            <div className="w-full"
                            >
                                <div >
                                    <p className="w-full text-blue-500">{question.text}</p>
                                    <div className="flex items-center gap-2 -mt-1">
                                        <span className="text-xs">posted by</span>
                                        <div className="bg-white rounded-md w-max flex gap-2 items-center">
                                            <div className="flex ml-2 text-xs text-black ">{question.fullName} </div>

                                            <div>
                                                {question.avatarUrl ?
                                                    <img
                                                        src={question.avatarUrl}
                                                        style={{ width: 20, height: 20, borderRadius: 24 / 2 }}
                                                        alt='userIcon'
                                                    /> :
                                                    <i style={{ backgroundColor: color }}
                                                        className="fa-solid fa-user text-xs rounded-full w-6 flex items-center justify-center h-6"></i>
                                                }
                                            </div>
                                        </div>
                                        <span className="text-xs">on</span>

                                        <time className="text-black text-xs" dateTime={question.createdAt}>{question.createdAt.slice(0, 10)}</time>
                                    </div>
                                </div>
                            </div>
                            <div className="-mt-4 ml-auto">
                                {actions.username == question.fullName && (

                                    <Popup questionId={question.comId} setEdit={setEdit} />

                                )}
                            </div>
                        </>
                        :
                        <InputField
                            cancellor={question.comId}
                            parentId={question.comId}
                            value={question.text}
                            edit
                            placeholder={question.text}
                            setEdit={setEdit}
                        />

                    }

                </div>
            </div>
            <dd as="div" className="bg-white rounded-md">
                <Answers parentId={question.comId} answers={question.replies} />
            </dd>


        </>
    )
}

export default Question