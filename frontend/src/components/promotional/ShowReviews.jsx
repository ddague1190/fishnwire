/* This example requires Tailwind CSS v2.0+ */
import { StarIcon } from '@heroicons/react/solid'
import Rating from "../utilities/rating/rating.component"



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ShowReviews({ reviews, largeScreenVersion }) {
  return (
    <div className={`bg-white w-full mt-10 rounded-md ${classNames(largeScreenVersion ? 'lg:block hidden' : '')}`}>
      <div className="max-w-2xl mx-auto py-2 sm:py-10 sm:px-6 lg:max-w-7xl">
        <h2 className="text-md font-medium text-gray-900">Reviews</h2>
        <div className="mt-6 pb-10 border-t border-b border-gray-200 divide-y divide-gray-200 space-y-10">
          {reviews.map((review) => (
            <div key={review._id} className="pt-10 lg:grid lg:grid-cols-12 lg:gap-x-8">


              <div className="lg:col-start-1 lg:col-span-8  items-end">
                <div className="flex items-center xl:col-span-1">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          review.rating > rating ? 'text-yellow-400' : 'text-gray-200',
                          'h-5 w-5 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="ml-3 text-sm text-gray-700">
                    {review.rating}
                    <span className="sr-only"> out of 5 stars</span>
                  </p>
                </div>


                <div className="mt-4 lg:mt-6 xl:mt-0 xl:col-span-2">
                  <h3 className="text-sm font-medium text-gray-900">{review.title}</h3>

                  <p
                    className="mt-3 space-y-6 text-sm text-gray-500 font-semibold"
                  >
                    {review.comment}
                  </p>
                </div>
              </div>


              <div className="flex flex-col items-center text-sm lg:mt-0 lg:col-start-9 lg:col-span-4 ">
                <div className="mb-5 aspect-square rounded-full  bg-gray-100 overflow-hidden max-h-20">
                  <img src={review.image} alt={`User submitted image for ${review.product}`} className="object-cover h-full w-full object-center" />
                </div>
      
                <p className="font-medium text-gray-900">{review.user}</p>
                <time
                  dateTime={review.createdAt}
                  className="ml-4 border-l border-gray-200 pl-4 text-black lg:ml-0 lg:mt-2 lg:border-0 lg:pl-0"
                >
                  {review.createdAt.slice(0, 10)}
                </time>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
