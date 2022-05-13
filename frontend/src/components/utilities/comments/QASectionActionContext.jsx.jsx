import React, { createContext, useReducer } from 'react'
import { useDispatch } from "react-redux"
import QASection from "../../productpresentation/QASection"


const reducer = (state, action) => {
  let newList = state
  let answerIndex = NaN
  let questionIndex = NaN

  switch (action.type) {
    case 'DELETE_QUESTION':
      newList = newList.filter((question) => question.comId !== action.id)
      return newList
    case 'DELETE_ANSWER':
      questionIndex = newList.findIndex((question) => question.comId === action.parentId)
      const newReplies = newList[questionIndex].replies.filter((answer) => answer.comId !== action.id)
      newList[questionIndex].replies = newReplies
      return [...newList]
    case 'EDIT_QUESTION':
      answerIndex = newList.findIndex((question) => question.comId === action.id)
      newList[answerIndex].text = action.text
      return newList
    case 'EDIT_ANSWER':
      answerIndex = newList.findIndex((question) => question.comId === action.parentId)
      questionIndex = newList[answerIndex].replies.findIndex((answer) => answer.comId === action.id)
      newList[answerIndex].replies[questionIndex].text = action.text
      return newList
    case 'POST_QUESTION':
      newList.push({
        fullName: action.fullName,
        avatarUrl: action.avatarUrl,
        comId: action.comId,
        text: action.text,
        createdAt: 'Just now!          ',
        replies: [],
      })
      return [...newList]
    case 'POST_ANSWER':
      questionIndex = newList.findIndex((question) => question.comId === action.id)
      newList[questionIndex].replies.push({
        fullName: action.fullName,
        avatarUrl: action.avatarUrl,
        comId: action.comId,
        text: action.text,
        createdAt: 'Just now!           '
      })
      return [...newList]
    default:
      return state
  }
}





export const ActionContext = createContext()

export const QASectionActionProvider = ({ currentUser, _comments }) => {

  const dispatch = useDispatch()

  const [comments, dispatchQASectionActions] = useReducer(reducer, _comments)


  return (
    <ActionContext.Provider
      value={{
        userImg: currentUser && currentUser.avatarUrl,
        username: currentUser && currentUser.name,
        comments: comments,
        dispatch: dispatchQASectionActions
      }}
    >
      <QASection />
    </ActionContext.Provider>
  )
}