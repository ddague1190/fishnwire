import { Tooltip } from "../utilities/Tooltip";
import { useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function SizeChart({ chart, largeScreenVersion, open, setOpen }) {
  useEffect(() => {
    if (open) {
      window.addEventListener('resize', setOpen.bind(null, false))
    }
    return (() => {
      if (open) {
        window.removeEventListener('resize', setOpen.bind(null, false))
      }
    })
  }, [])

  return (
    <article className={` ring-1 ring-gray-400 ${classNames(largeScreenVersion ? 'hidden lg:block mt-5' : open ? 'block mt-10' : 'hidden')}`}>
      
      {/* <h2 className="pt-4 text-md ml-6 mb-6 text-gray-900 font-bold">Size chart</h2> */}
        
      
      <button
          onClick={() => setOpen(!open)}
          type="button"
          className="inline-flex items-center px-2.5 py-1.5 mb-5 border border-gray-300 shadow-sm text-xs font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Close size chart
        </button>

      <div className="flex flex-col">
        <div className="px-4 md:px-0 -my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-opacity-5 ">
              <table className="min-w-full divide-y divide-blue-800">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-light text-gray-900 sm:pl-6">
                      <span>Hook Size</span>
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-light text-gray-900 ">
                      <span>Hook Gap</span>
                      <Tooltip text='Hook gap refers to the distance between the point and the shank of the hook.' image={{ src: 'https://amateuranglers.files.wordpress.com/2015/09/parts-of-a-hook.jpg', alt: 'Image showing the different parts of a hook' }} />
                    </th>
                    <th
                      scope="col"
                      className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-light text-gray-900">
                      <span>Length</span>
                      <Tooltip text='The total length of hook' image={{ src: 'https://amateuranglers.files.wordpress.com/2015/09/parts-of-a-hook.jpg', alt: 'Image showing the different parts of a hook' }} />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {chart.map((hook, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                        {hook.size}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                        {hook.gap ? hook.gap : 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-2 py-2 text-sm font-medium text-gray-900">
                        {hook.length_inch} in / {hook.length_metric} mm
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
