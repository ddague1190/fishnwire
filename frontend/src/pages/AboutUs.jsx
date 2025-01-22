import { useEffect } from "react";
import AddressBox from "../components/utilities/addressbox/addressbox.component";

const stats = [
  { label: "Founded", value: "1999" },
  { label: "Employees", value: "10+" },
];

export default function AboutUsScreen() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="relative bg-white py-16 sm:py-24">
      <div className="lg:mx-auto lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-24 lg:items-start">
        <div className="relative sm:py-16 lg:py-0">
          <div
            aria-hidden="true"
            className="hidden sm:block lg:absolute lg:inset-y-0 lg:right-0 lg:w-screen">
            <div className="absolute inset-y-0 right-1/2 w-full bg-gray-50 rounded-r-3xl lg:right-72" />
            <svg
              className="absolute top-8 left-1/2 -ml-3 lg:-right-8 lg:left-auto lg:top-12"
              width={404}
              height={392}
              fill="none"
              viewBox="0 0 404 392">
              <defs>
                <pattern
                  id="02f20b47-fd69-4224-a62a-4c9de5c763f7"
                  x={0}
                  y={0}
                  width={20}
                  height={20}
                  patternUnits="userSpaceOnUse">
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={4}
                    className="text-gray-200"
                    fill="currentColor"
                  />
                </pattern>
              </defs>
              <rect
                width={404}
                height={392}
                fill="url(#02f20b47-fd69-4224-a62a-4c9de5c763f7)"
              />
            </svg>
          </div>
          <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0 lg:max-w-none lg:py-20">
            {/* Testimonial card*/}
            <div className="relative pt-64 pb-10 rounded-2xl shadow-xl overflow-hidden">
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt=""
              />
              <div className="absolute inset-0 bg-blue-900 mix-blend-screen" />
              <div className="relative px-8">
                <blockquote className="mt-8">
                  <div className="relative text-lg font-medium text-yellow md:flex-grow">
                    <svg
                      className="absolute top-0 -left-5 transform -translate-x-3 -translate-y-2 h-8 w-8 text-black"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="font-bold tracking-tighter text-3xl relative">
                      We are family-owned business dedicated to our customers,
                      to our Christian values and to our passion for fishing.
                    </p>
                    <div className="absolute top-0 left-0 w-full h-full bg-green mix-blend-exclusion"></div>
                  </div>

                  <footer className="mt-4">
                    <p className="text-base font-semibold text-white">
                      The Smith Family, Owners of Fish n Wire
                    </p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
          {/* Content area */}
          <div className="pt-12 sm:pt-16 lg:pt-20">
            <h2 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
              Terminal Tackle - To order
            </h2>
            <div className="mt-6 text-gray-500 space-y-6">
              <p className="text-lg">
                Custom tackle made in one of the fishing capitals of the world.
                We keep our prices down by stocking the items you need most. And
                because we are small, we can give each order special treatment -
                with full customization services on made-to-order items.
              </p>
              <dl className="mt-8 flex flex-col" id="contact">
                <dt className="text-2xl py-6 tracking-tighter leading-6 font-semibold text-black">
                  Contact us via phone or message:
                </dt>
                <div className="flex flex-col justify-between py-8 px-3 bg-blue-500 text-white font-semibold rounded-md">
                  <dd>(123) 456-7890</dd>
                  <dd>42@nullpointer.com</dd>
                  <dd className="mt-8 font-normal">
                    (or via the messenger on your profile screen)
                  </dd>
                </div>

                <dt className="text-2xl py-6 tracking-tighter leading-6 font-semibold text-black">
                  Arrange a visit to our warehouse and manufacturing center:
                </dt>

                <dd>
                  <AddressBox
                    input={{
                      company: "Fish N Wire",
                      streetAddress: "1999 Portsmouth Circle",
                      apartment: "Suite 2112",
                      city: "Sacremento",
                      state: "FL",
                    }}
                  />
                </dd>
              </dl>
            </div>
          </div>

          {/* Stats section */}
          <div className="mt-10">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-8">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-t-2 border-gray-100 pt-6">
                  <dt className="text-base font-medium text-gray-500">
                    {stat.label}
                  </dt>
                  <dd className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
