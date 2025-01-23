import { Fragment, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import Snap from "../promotional/Snap";
import {
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/actions/userActions";
import { useEffect } from "react";
import { getCategories } from "../../redux/actions/productActions";
import TinyFishFact from "./TinyFishFact";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const navigation = {
  pages: [
    {
      name: "Contact",
      to: "about",
    },
  ],
  brands: [
    {
      image:
        "https://fishnwirepictures.s3.amazonaws.com/logos/Aftco_2048x.webp",
      alt: "Aftco logo",
      to: "brands/aftco",
    },
    {
      image:
        "https://fishnwirepictures.s3.amazonaws.com/logos/Rosco-White-Large.png",
      alt: "Rosco logo",
      to: "brands/rosco",
    },
    {
      image: "https://fishnwirepictures.s3.amazonaws.com/logos/sampo.jpeg",
      alt: "Sampo logo",
      to: "brands/sampo",
    },
    {
      image:
        "https://fishnwirepictures.s3.amazonaws.com/logos/tournamentproducts.jpeg",
      alt: "Tournament Products logo",
      to: "brands/tournamentproducts",
    },
  ],
};

export default function Navigation() {
  const fish = useState(1)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { loading, categories } = useSelector((state) => state.categories);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartItems } = useSelector((state) => state.cart);




  const onLogoutClick = () => {
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, [])

  useEffect(() => {

    if (!categories) {
      dispatch(getCategories());
    }

  }, [categories, dispatch]);

  return (
    <div className="">
      {/* Mobile menu */}
      {!loading && (
        <>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 flex z-40 lg:hidden"
              onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full">
                <div className="relative max-w-md w-full bg-white shadow-xl pb-12 flex flex-col  overflow-y-auto">
                  <div className="px-4 pt-5 pb-2 flex">
                    <button
                      type="button"
                      className="-m-2 p-2 rounded-md inline-flex items-center justify-center text-gray-400"
                      onClick={() => setOpen(false)}>
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Links */}
                  <Tab.Group as="div" className="mb-auto mt-2">
                    <div className="border-b border-gray-200">
                      <Tab.List className="-mb-px flex flex-wrap px-4">
                        {categories && categories.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? "text-indigo-600 border-indigo-600"
                                  : "text-gray-900 border-transparent",
                                "flex-1 whitespace-nowrap py-2 px-1 border-b-2 text-base font-medium hover:font-bold"
                              )
                            }>
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                    </div>
                    <Tab.Panels as={Fragment}>
                      {categories && categories.map((category, categoryIdx) => (
                        <Tab.Panel
                          key={category.name}
                          className="px-4 pt-10 pb-6 space-y-12">
                          <div className="grid grid-cols-1 items-start gap-y-10 gap-x-6">

                            <div>
                              <p
                                id="mobile-categories-heading"
                                className="font-medium text-gray-900">
                                Categories
                              </p>
                              <ul
                                aria-labelledby="mobile-categories-heading"
                                className="mt-6 ml-5 space-y-2">
                                {console.log(category.children)}
                                {category.children && category.children.map((item) => {
                                  if (item.type === "product") {
                                    return (
                                      <li key={item.name} className="flex">
                                        <Link
                                          onClick={() => setOpen(false)}
                                          to={`/products/${category.slug}/${item.slug}`}
                                          className="hover:text-gray-800 hover:font-bold">
                                          {item.name}
                                        </Link>
                                      </li>
                                    );
                                  }
                                  else return null
                                })}
                              </ul>
                            </div>
                          </div>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>

                  <div className="border-t border-gray-200 py-2 px-4 space-y-6">
                    {navigation.pages.map((page) => (
                      <div key={page.name} className="flow-root">
                        <Link
                          to={`/${page.to}`}
                          onClick={() => setOpen(false)}
                          className="-m-2 p-2 block font-medium text-gray-900">
                          {page.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                  {!userInfo ? (
                    <div className="border-t border-gray-200 py-2 px-4 space-y-6">
                      <div className="flow-root">
                        <Link
                          to="/register"
                          onClick={() => setOpen(false)}
                          className=" block font-medium text-gray-900">
                          Create an account
                        </Link>
                      </div>
                      <div className="flow-root">
                        <Link
                          to="/login"
                          onClick={() => setOpen(false)}
                          className="-m-2 p-2 block font-medium text-gray-900">
                          Sign in
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-gray-200 py-2 px-4 space-y-6">
                      <div className="flow-root">
                        <div
                          onClick={onLogoutClick}
                          className="block font-medium text-gray-900 cursor-pointer">
                          Sign out
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Transition.Child>
            </Dialog>
          </Transition.Root>

          <header className="relative">
            <nav aria-label="Top">
              {/* Top navigation */}
              <div className="bg-blue-800">
                <div className="max-w-7xl mx-auto h-10 px-4 flex items-center justify-between sm:px-6 lg:px-8">
                  <p className="hidden xs:block flex-1 text-center text-sm font-medium text-white lg:flex-none">
                    Get free delivery on orders over $100
                  </p>
                  {!userInfo ? (
                    <div className="lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      <Link
                        to="/register"
                        className="hidden lg:block text-sm font-medium text-white hover:text-gray-100">
                        Create an account
                      </Link>
                      <span
                        className="h-6 w-px bg-gray-600"
                        aria-hidden="true"
                      />
                      <Link
                        to="/login"
                        className="text-sm font-medium text-white hover:text-gray-100">
                        Sign in
                      </Link>
                    </div>
                  ) : (
                    <div className=" lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                      <div
                        onClick={onLogoutClick}
                        className="text-sm text-white hover:text-gray-100 cursor-pointer">
                        Sign out
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Secondary navigation */}
              <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="border-b border-gray-200">
                    <div className="h-16 flex items-center justify-between">
                      {/* Logo (lg+) */}
                      <div className="hidden lg:flex p-5 ml-0 mt-4  items-center text-lg text-blue-800">
                        <Link to="/">
                          <span className="text-2xl tracking-tighter font-bold">
                            Fish n Wire
                          </span>
                          <Snap />
                        </Link>
                      </div>

                      <div className="hidden h-full lg:flex">
                        {/* Mega menus */}
                        <Popover.Group className="ml-8">
                          <div className="h-full flex justify-center space-x-8">
                            {categories.map((category, categoryIdx) => (
                              <Popover key={category.name} className="flex">
                                {({ open }) => (
                                  <>
                                    <div className="relative flex h-full">
                                      <Popover.Button
                                        className={classNames(
                                          open
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-gray-700 hover:text-gray-800",
                                          "relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px hover:font-bold"
                                        )}>
                                        {category.name}
                                      </Popover.Button>
                                    </div>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      enter="transition ease-out duration-200"
                                      enterFrom="opacity-0"
                                      enterTo="opacity-100"
                                      leave="transition ease-in duration-150"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0">
                                      <Popover.Panel className="absolute z-50 w-full top-full inset-x-0 text-gray-500 sm:text-sm">
                                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                        <div
                                          className="inset-0 h-full top-1/2 shadow"
                                          aria-hidden="true"
                                        />

                                        <div className="relative bg-blue-500">
                                          <div className=" max-w-7xl mx-auto px-8">
                                            <div className="grid grid-cols-2  items-start gap-y-10 gap-x-8 pt-10 pb-12">
                                              <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                                <div>
                                                  <p
                                                    id={`desktop-featured-heading-${categoryIdx}`}
                                                    className="font-medium text-gray-900">
                                                    Featured
                                                  </p>
                                                  <ul
                                                    
                                                    aria-labelledby={`desktop-featured-heading-${categoryIdx}`}
                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                                    {category.children && category.children.map(
                                                      (item) => {
                                                        if (
                                                          item.type ===
                                                          "featured"
                                                        ) {
                                                          return (
                                                            <li
                                                              key={item.name}
                                                              className="flex">
                                                              <Popover.Button
                                                                as={Link}
                                                                to={`/featured/${category.slug}/${item.slug}`}
                                                                className="hover:text-gray-800 text-white font-semibold">
                                                                {item.name}
                                                              </Popover.Button>
                                                            </li>
                                                          );
                                                        }
                                                        else return null
                                                      }
                                                    )}
                                                  </ul>
                                                </div>
                                                <div>
                                                  <p
                                                    id="desktop-categories-heading"
                                                    className="font-medium text-gray-900">
                                                    Categories
                                                  </p>
                                                  <ul
                                                    
                                                    aria-labelledby="desktop-categories-heading"
                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                                    {category.children && category.children.map(
                                                      (item) => {
                                                        if (
                                                          item.type ===
                                                          "product"
                                                        ) {
                                                          return (
                                                            <li
                                                              key={item.name}
                                                              className="flex">
                                                              <Popover.Button
                                                                as={Link}
                                                                to={`/products/${category.slug}/${item.slug}`}
                                                                className="hover:text-gray-800 text-white font-semibold">
                                                                {item.name}
                                                              </Popover.Button>
                                                            </li>
                                                          );
                                                        }
                                                        else return null
                                                      }
                                                    )}
                                                  </ul>
                                                </div>
                                              </div>
                                              <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                                <div>
                                                  <p
                                                    id="desktop-collection-heading"
                                                    className="font-medium text-gray-900">
                                                    Collection
                                                  </p>
                                                  <ul
                                                    
                                                    aria-labelledby="desktop-collection-heading"
                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4">
                                                    {category.children && category.children.map(
                                                      (item) => {
                                                        if (
                                                          item.type ===
                                                          "collection"
                                                        ) {
                                                          return (
                                                            <li
                                                              key={item.name}
                                                              className="flex">
                                                              <Popover.Button
                                                                as={Link}
                                                                to={`/products/${category.slug}/${item.slug}`}
                                                                className="hover:text-gray-800 text-white font-semibold">
                                                                {item.name}
                                                              </Popover.Button>
                                                            </li>
                                                          );
                                                        }
                                                        else return null
                                                      }
                                                    )}
                                                  </ul>

                                                </div>
                                                <TinyFishFact fish={fish} />

                                                {/* <div>
                                                  <p
                                                    id="desktop-brand-heading"
                                                    className="font-medium text-gray-900">
                                                    Brands
                                                  </p>
                                                  <ul
                                                    
                                                    aria-labelledby="desktop-brand-heading"
                                                    className="mt-6 space-y-6 sm:mt-4 sm:space-y-4 grid grid-cols-2 items-center bg-white">
                                                    {navigation.brands.map(
                                                      (item, index) => {
                                                        return (
                                                          <Link
                                                            key={index}
                                                            to={item.to}>
                                                            <img
                                                              src={item.image}
                                                              
                                                              className="flex h-20 object-contain"></img>
                                                          </Link>
                                                        );
                                                      }
                                                    )}
                                                  </ul>
                                                </div> */}
                                              </div>

                                            </div>

                                          </div>


                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            ))}

                            {navigation.pages.map((page) => (
                              <Link
                                key={page.name}
                                to={`/${page.to}`}
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                                {page.name}
                              </Link>
                            ))}
                          </div>
                        </Popover.Group>
                      </div>

                      {/* Mobile menu and search (lg-) */}
                      <div className="flex-1 flex items-center lg:hidden">
                        <button
                          type="button"
                          className="-ml-2 bg-white p-2 rounded-md text-gray-400"
                          onClick={() => setOpen(true)}>
                          <span className="sr-only">Open menu</span>
                          <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </button>

                        {/* Search */}
                        {/* <a
                          href="#"
                          className="ml-2 p-2 text-gray-400 hover:text-gray-500">
                          <span className="sr-only">Search</span>
                          <SearchIcon className="w-6 h-6" aria-hidden="true" />
                        </a> */}
                      </div>

                      {/* Logo (lg-) */}
                      <div className="lg:hidden flex mt-4  items-center text-lg text-blue-800">
                        <Link to="/">
                          <span className="text-2xl tracking-tighter font-bold text-blue-800">
                            Fish n Wire
                          </span>
                          <Snap />
                        </Link>
                      </div>
                      <div className="flex-1 flex items-center justify-end">
                        <div className="flex items-center lg:ml-8">
                          <div className="flex space-x-8">
                            {/* <div className="hidden lg:flex">
                              <a
                                href="#"
                                className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Search</span>
                                <SearchIcon
                                  className="w-6 h-6"
                                  aria-hidden="true"
                                />
                              </a>
                            </div> */}
                            {userInfo && (
                              <div className="flex">
                                <Link
                                  to="/profile"
                                  className="-m-2 p-2 text-gray-400 hover:text-gray-500">
                                  <span className="sr-only">Account</span>
                                  {userInfo.avatarUrl ?

                                    <img src={userInfo.avatarUrl} alt='Profile' className='w-8 h-8 object-cover rounded-full border-2' />
                                    :
                                    <UserIcon
                                      className="w-6 h-6"
                                      aria-hidden="true"
                                    />
                                  }
                                </Link>
                              </div>
                            )}
                          </div>

                          <span
                            className="mx-4 h-6 w-px bg-gray-200 lg:mx-6"
                            aria-hidden="true"
                          />

                          <div className="flow-root">
                            <Link
                              to="/cart"
                              className="group -m-2 p-2 flex items-center">
                              <ShoppingCartIcon
                                className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                {cartItems.length}
                              </span>
                              <span className="sr-only">
                                items in cart, view bag
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </header>
        </>
      )}
    </div>
  );
}
