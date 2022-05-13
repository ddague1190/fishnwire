import React from 'react'
import Loader from "../components/utilities/loader/loader.component";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { listProductDetails } from "../redux/actions/productActions";
import useViewport from "../utils/useViewport";
import { Range, getTrackBackground } from 'react-range';

const MIN = 70
const MAX = 130

export const SpecViewer = () => {
  const [TO_id, setTO_id] = useState()

  useViewport()
  const ref = useRef()
  const { id } = useParams()
  const [shouldTry, setShouldTry] = useState(true)
  const dispatch = useDispatch()
  const { product: { specWidth: width, specImage: image, slug } } = useSelector(state => state.productDetails)
  const [values, setValues] = useState([100])
  const [debouncedWidth, setDebouncedWidth] = useState(width)
  const { height } = useSelector(state => state.dimensions)
  const navigate = useNavigate()

  useEffect(() => {

    window.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) { document.getElementById('spec').requestFullscreen() }
      else document.exitFullscreen()
    })
    const ratio = (window.innerWidth / window.outerWidth)
    if (width == 'no_spec') {
      setShouldTry(false)
    }
    if (image) {
      ref.current.style.zoom = ratio;
    }
    if (!image && shouldTry) {
      dispatch(listProductDetails(id));
    }

    window.scrollTo(0, 0)
    setDebouncedWidth(values[0] / 100 * width)
  }, [dispatch, id, image, height, values, width])


  return (
    <>
      {image ?
        <div id='spec' className='overflow-scroll w-full'>
          <div className='flex items-center  bg-gray-50 h-max p-4'>
            <div className='ml-auto flex flex-row-reverse justify-center items-center py-2 gap-2'>
              <span className="relative z-0 inline-flex shadow-sm rounded-md">
                <button
                  onClick={() => setValues([100])}
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Save setting
                </button>
              </span>

              <Range

                step={0.01}
                min={MIN}
                max={MAX}
                values={values}
                onChange={setValues}
                renderTrack={({ props, children }) => (
                  <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                      ...props.style,
                      height: '50px',
                      padding: '10px',
                      display: 'flex',
                      width: '100%'
                    }}
                  >
                    <div
                      ref={props.ref}
                      style={{
                        height: '4px',
                        width: '200px',
                        borderRadius: '4px',
                        background: getTrackBackground({
                          values,
                          colors: ['#548BF4', '#ccc'],
                          min: MIN,
                          max: MAX,
                        }),
                        alignSelf: 'center'
                      }}
                    >
                      {children}
                    </div>
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '20px',
                      width: '20px',
                      borderRadius: '4px',
                      backgroundColor: '#FFF',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0px 2px 6px #AAA'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '-28px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                        padding: '4px',
                        borderRadius: '4px',
                        backgroundColor: '#548BF4'
                      }}
                    >
                      {values[0].toFixed(1)}
                    </div>
                    <div
                      style={{
                        height: '16px',
                        width: '5px',
                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                      }}
                    />
                  </div>
                )}
              ></Range>
            </div>
          </div>



          <button className='text-gray-500 font-semibold p-4 cursor-pointer' onClick={() => navigate(`/product/${slug}`)}>Go back</button>
          <img alt={`Product with id ${slug}`} className={`mx-auto min-w-fit`} src={image} width={debouncedWidth || width} ref={ref} />
        </div>
        : shouldTry ?
          <Loader />
          :
          <>
            <button className='text-gray-500 font-semibold p-4 cursor-pointer' onClick={() => navigate(`/product/${slug}`)}>Go back</button>

            <h1 className="text-center py-6">No specification for this spec</h1>
          </>

      }
    </>
  )
}
