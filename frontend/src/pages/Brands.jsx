import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const brands = [
  {
    image:
      "https://fishnwirepictures.s3.amazonaws.com/logos/tournamentproducts.jpeg",
    slug: "tournamentproducts",
    title: "Tournament Products",
  },
  {
    image: "https://fishnwirepictures.s3.amazonaws.com/logos/sampo.jpeg",
    slug: "sampo",
    title: "Sampo",
  },
  {
    image:
      "http://roscotackle.com/wp-content/uploads/2019/05/ROSCO-Logo.png",
    slug: "rosco",
    title: "Rosco",
  },
  {
    image: "https://fishnwirepictures.s3.amazonaws.com/logos/Aftco_2048x.webp",
    slug: "aftco",
    title: "AFTCO",
  },

];
export default function Brands() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (

            <article aria-labelledby="products-heading" className="bg-white py-16 sm:py-24 relative lg:px-0relative mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-0">
            <h2 className="text-3xl text-gray-900 font-extrabold tracking-tight sm:text-4xl">
              Brands we carry
            </h2>

                  <div className="rounded-md grid grid-cols-3 xs:grid-cols-4 p-5 gap-y-2 gap-x-4 bg-red-500 md:grid-cols-8 xl:gap-x-4 items-center">
                    {brands.map((brand, index) => (
                      <Link
                        key={index}
                        to={`/brands/${brand.slug}/`}
                        className="group cursor-pointer">
                        <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                          <img
                            src={brand.image}
                            alt={`logo for ${brand.title}`}
                            className="w-full h-full object-center aspect-square object-contain bg-white group-hover:opacity-75"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
   
                </article>

  );
}
