import { Link } from "react-router-dom"
export default function FeaturedProduct() {
    return (
      <div className="relative bg-white overflow-hidden">
        <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40  lg:pb-48">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
            <div className="sm:max-w-lg">
              <h1 className="text-4xl font font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                Clickity, clack
              </h1>
              <p className="mt-4 text-xl text-gray-500">
                Introducing our Big Game 10" swim bait lures
              </p>
            </div>
            <div>
              <div className="mt-10">
                {/* Decorative image grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full"
                >
                  <div className="absolute transform sm:left-1/2 sm:top-0 sm:-translate-x-28 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 md:-translate-x-20 lg:-translate-x-20">
                    <div className="flex items-center space-x-6 lg:space-x-8">
                      <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="w-44 h-64 rounded-lg overflow-hidden sm:opacity-0 lg:opacity-100">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_7.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                        
                        <div className="w-44 h-64 rounded-lg overflow-hidden">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_8.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="w-44 h-64 rounded-lg overflow-hidden">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_4.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                        <div className="w-44 h-64 rounded-lg overflow-hidden">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_6.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                        <div className="w-44 h-64 rounded-lg overflow-hidden">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_2.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                      </div>
                      <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                        <div className="w-44 h-64 rounded-lg overflow-hidden">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_3.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                        <div className="w-44 h-64 rounded-lg overflow-hidden">
                          <img
                            src="https://fishnwirepictures.s3.amazonaws.com/Asset_4.png"
                            alt=""
                            className="w-full h-full object-center object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <Link
                  to='/product/10inchbiggamelure'
                  className="inline-block text-center bg-blue-800 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-blue-700"
                >
                  Explore Collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }