
import React, { useContext } from 'react'
import InputField from './InputField'
import { ActionContext } from "./QASectionActionContext.jsx"

const Input = ({placeholder, parentId, currentUser}) => {
  const actions = useContext(ActionContext)
  return (
    <InputField authorImg={actions.userImg} main placeholder={placeholder} parentId={parentId} />
  )
}

export default Input