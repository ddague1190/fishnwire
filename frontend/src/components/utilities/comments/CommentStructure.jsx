import React, { useContext } from 'react'
import Popup from 'reactjs-popup'
import {
  modal,
  modalClose,
  modalHeader,
  modalContent,
  modalActions,
  modalActionBtn,
  modalDelBtn
} from './ModalStyles'
import { ActionContext } from './ActionContext'

const CommentStructure = ({ i, reply, parentId, index }) => {

  const actions = useContext(ActionContext)
  const edit = true
  const colors= [
    'red',
    'gray',
    'green',
    'purple',
    'yellow',
    'pink',
  ]  
  const color = colors[index%5]
  console.log(i)

  return (
    <div className="flex w-full justify-between">
      <div
        className="flex flex-col mt-4"
        style={reply && { marginLeft: 15, marginTop: '6px' }}
      >
        <div className=''>{i.text}</div>
        <div className="flex items-center gap-2 mt-2 ">
          <div>
            {i.avatarUrl ? 
            <img
              src={i.avatarUrl}
              style={{ width: 24, height: 24, borderRadius: 24 / 2 }}
              alt='userIcon'
            /> :
            <i style={{backgroundColor: color}}
             className="fa-solid fa-user text-white rounded-full w-6 flex items-center justify-center h-6"></i>
            }
          </div>
          <div className="flex ml-2">{i.fullName} </div>
          <div>
            <button
              className=" flex gap-1 bg-red-500 items-center rounded-md border-none text-gray-500 outline-none font-semibold text-sm mx-0 my-1 w-16 p-1 border-r-4 hover:outline-none hover:bg-gray-200 focus:outline-0"
              onClick={() => actions.handleAction(i.comId)}
              disabled={!actions.user}
            >
              {' '}
              <i className="fa-solid fa-reply"> {' '}</i>Reply
            </button>
          </div>
        </div>
      </div>
      <div className="bg-red-500">
        {actions.userId == i.fullName && actions.user && (
          <Popup
            role='tooltip' 
            trigger={
              <button className="font-light text-xs bg-transparent border-none px-2 py-3 rounded-full cursor-pointer hover:outline-none hover:bg-white focus:outline-0">
              Edit
              </button>
            }
            position='left center'
            nested
          >
            <div className="w-0">
              <div>
                <button
                  className="bg-transparent outline-none border-none cursor-pointer"
                  onClick={() => actions.handleAction(i.comId, edit)}
                >
                  {' '}
                  Edit
                </button>
              </div>
              <div>
                <Popup
                  trigger={
                    <button className="bg-transparent outline-none border-none cursor-pointer"> Delete</button>
                  }
                  modal
                  nested
                >
                  {(close) => (
                    <div className="text-sm">
                      <button
                        className="cursor-pointer absolute block px-.5 py-1 leading-[20px] -right-[2.5] -top-2.5 font-lg bg-white border-r-8 border-2 border-[#cfcece] outline-none"
                        onClick={close}
                      >
                        &times;
                      </button>
                      <div className='header' style={modalHeader}>
                        {' '}
                        Delete Comment{' '}
                      </div>
                      <div className='content' style={modalContent}>
                        {' '}
                        Delete your comment permanently?
                      </div>
                      <div className='actions' style={modalActions}>
                        <button
                          className='button'
                          style={modalActionBtn}
                          onClick={() => {
                            actions.onDelete(i.comId, parentId)
                            close()
                          }}
                        >
                          Delete
                        </button>
                        <button
                          className='button'
                          style={modalDelBtn}
                          onClick={() => {
                            close()
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </Popup>
              </div>
            </div>
          </Popup>
        )}
      </div>
    </div>
  )
}

export default CommentStructure