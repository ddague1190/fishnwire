import React, { useContext } from 'react'
import { ActionContext } from "./QASectionActionContext.jsx"
import POPUP from "reactjs-popup"
import { useDispatch } from "react-redux"
import { deleteComment } from "../../../redux/actions/commentsActions.js"

const Popup = ({ answerId, questionId, setEdit }) => {
    const dispatch = useDispatch()
    const actions = useContext(ActionContext)
    const onDeleteClick = () => {
        if (answerId) {
            actions.dispatch({ type: 'DELETE_ANSWER', id: answerId, parentId: questionId })
            dispatch(deleteComment(answerId))
        }
        else if (!answerId && questionId) {
            actions.dispatch({ type: 'DELETE_QUESTION', id: questionId })
            dispatch(deleteComment(questionId))
        }
    }

    return (
        <POPUP
            role='tooltip'
            trigger={
                <button className="font-light text-xs bg-transparent border-none px-2 py-3 rounded-full cursor-pointer hover:outline-none hover:bg-gray-50 focus:outline-0">
                    Edit
                </button>
            }
            position='left center'
            nested
        >
            <div className="bg-white p-2 w-20 rounded-md">
                <div>
                    <button
                        className="bg-transparent outline-none border-none cursor-pointer"
                        onClick={() => setEdit(true)}
                    >
                        {' '}
                        Edit
                    </button>
                </div>
                <div className='bg-white'>
                    <POPUP
                        trigger={
                            <button className=""> Delete</button>
                        }
                        modal
                        nested
                    >
                        {(close) => (
                            <div className="text-sm h-max w-max p-4 bg-blue-500 rounded-md">
                                <button
                                    className="font-extrabold text-xl text-white outline-none"
                                    onClick={close}
                                >
                                    &times;
                                </button>
        
                                <div className='text-gray-100'>
                                    {' '}
                                    Delete your comment permanently?
                                </div>
                                <div className='flex gap-2 mx-auto w-full justify-center'>
                                    <button
                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => {
                                            onDeleteClick()
                                            close()
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={() => {
                                            close()
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </POPUP>
                </div>
            </div>
        </POPUP>



    )
}

export default Popup