import React, { useContext } from 'react'
import styles from './Style.scss'
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router"

const SignField = ({ placeholder }) => {
  const navigate = useNavigate()
  const productId = useParams();

  const loginAndComeBack = () => {
    navigate(`/login?redirect=/product/${productId.id}`);
  };
  const registerAndComeBack = () => {
    navigate(`/login?redirect=/product/${productId.id}`);
  };

  return (
    <div className="align-middle mx-auto rounded-lg w-max">
      <div className="mt-1 text-gray-500 text-md">

        <button className="px-2 font-extrabold outline-none border-transparent" onClick={loginAndComeBack}>
          Log in
        </button>
        {placeholder}

      </div>

    </div>
  )
}

export default SignField