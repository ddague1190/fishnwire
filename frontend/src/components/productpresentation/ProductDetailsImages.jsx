import React, { useEffect, useState } from "react";
import { Fragment } from "react";

export const ProductDetailsImages = ({
  mainImages,
  variants,
  whichImage,
  setTypeOverride,
}) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();

  const onImageClick = (index) => {
    setSelectedImage(images[index])
  }
  const onImageLeftClick = () => {
    let { index } = selectedImage;

    if (index > 0) {
      setSelectedImage(images[index - 1]);
      return;
    } else {
      setSelectedImage(images[images.length - 1]);
      return;
    }
  };

  const onImageRightClick = () => {
    let { index } = selectedImage;

    if (index < images.length - 1) {
      setSelectedImage(images[index + 1]);
      return;
    } else {
      setSelectedImage(images[0]);
      return;
    }
  };

  useEffect(() => {
    if (selectedImage) {
      if (!selectedImage.mainImage && selectedImage.type) {
        setTypeOverride(selectedImage.type);
      }
    }
  }, [selectedImage]);

  useEffect(() => {
    if (whichImage && whichImage.image) {
      const image = {
        image: whichImage.image,
        description: whichImage.title,
        index: images.findIndex((el) => el.image === whichImage.image),
      };
      setSelectedImage(image);
    }
  }, [whichImage, images]);

  useEffect(() => {
    const images = [];
    let startIndex = 0;
    mainImages.forEach((image, index) => {
      images.push({
        image: image,
        description: `Main picture ${index + 1}`,
        index: startIndex,
        mainImage: true,
      });
      startIndex++;
    });
    variants.forEach((variant, index) => {
      if (
        variant.image &&
        !images.find(({ image }) => variant.image === image)
      ) {
        images.push({
          image: variant.image,
          description: variant.title,
          index: startIndex,
          mainImage: false,
          type: variant._type,
          material: variant._material,
        });
        startIndex++;
      }
    });
    setImages(images);
    setSelectedImage(images[0]);
  }, [mainImages, variants]);

  return (
    <>
      <h2 className="sr-only">Images</h2>
      <div className="grid grid-cols-3 relative gap-1 ">
        <img
          src={selectedImage?.image}
          alt={selectedImage?.description}
          className="lg:mb-10 col-span-3 row-span-3 self-center rounded-lg mx-auto md:w-full h-48 md:h-72 lg:h-96 object-contain"
        />
        {images.map((image, index) => {
          return (
            <Fragment key={index} >
              <span className="sr-only">{image.description}</span>
              <span onClick={onImageClick.bind(null, index)}
                className="cursor-pointer hidden lg:block inset-0 bg-gray-200 h-12 lg:h-20 rounded-md overflow-hidden hover:scale-[1.05] transition-all">
                <img
                  key={index}
                  value={index}
                  src={image.image}
                  alt={image.description}
                  className="w-full h-full object-center object-contain"
                />
              </span>
            </Fragment>
          );
        })}

        {images.length > 1 && (
          <>
            <div className="lg:hidden absolute top-1/2 w-full flex mt-auto items-center rounded-md py-1 justify-between px-6  text-blue-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                onClick={onImageLeftClick}
                className="h-8 w-8 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="gray"
                opacity=".5"
                strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>

              <svg
                onClick={onImageRightClick}
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="gray"
                opacity=".5"
                strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </>
        )}
      </div>
    </>
  );
};
