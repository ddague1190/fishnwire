import React, { useContext } from 'react'
import styles from './Style.scss'
import InputField from './InputField'
import { ActionContext } from './ActionContext'
import 'reactjs-popup/dist/index.css'
import CommentStructure from './CommentStructure'

const DisplayComments = ({ comments }) => {
  const actions = useContext(ActionContext)
  if(!comments) {
    return ''
  }
  return (
    <div>
      {comments && comments.length === 0 && <p className="font-light justify-center">No posts yet</p>}
      {comments.map((i, index) => (
        <div key={i.comId}>
          {actions.editArr.filter((id) => id === i.comId).length !== 0 ? (
              <InputField cancellor={i.comId} value={i.text} edit />
            
          ) : (
            <CommentStructure i={i} index={index} handleEdit={() => actions.handleAction} />
          )}
          {actions.replies.filter((id) => id === i.comId).length !== 0 &&
            (actions.customInput ? (
              actions.customInput({
                cancellor: i.comId,
                parentId: i.comId,
                submit: actions.submit,
                handleCancel: actions.handleCancel,
                edit: false
              })
            ) : (
              <InputField cancellor={i.comId} parentId={i.comId} />
            ))}
          <div className="ml-10 border-l-2 border-l-gray-300 mt-1.5">
            {i.replies &&
              i.replies.map((a, index) => (
                <div key={a.comId}>
                  {actions.editArr.filter((id) => id === a.comId).length !==
                  0 ? (
                    actions.customInput ? (
                      actions.customInput({
                        cancellor: a.comId,
                        value: a.text,
                        handleCancel: actions.handleCancel,
                        edit: true,
                        parentId: i.comId,
                        submit: actions.submit
                      })
                    ) : (
                      <InputField
                        cancellor={a.comId}
                        value={a.text}
                        edit
                        parentId={i.comId}
                      />
                    )
                  ) : (
                    <CommentStructure
                      i={a}
                      index={index}
                      reply
                      parentId={i.comId}
                      handleEdit={() => actions.handleAction}
                    />
                  )}
                  {actions.replies.filter((id) => id === a.comId).length !==
                    0 &&
                    (actions.customInput ? (
                      actions.customInput({
                        cancellor: a.comId,
                        parentId: i.comId,
                        child: true,
                        submit: actions.submit,
                        handleCancel: actions.handleCancel,
                        edit: false
                      })
                    ) : (
                      <InputField
                        cancellor={a.comId}
                        parentId={i.comId}
                        child
                      />
                    ))}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DisplayComments