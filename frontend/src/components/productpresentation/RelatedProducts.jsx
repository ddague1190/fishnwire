import React from 'react'
import { useNavigate } from "react-router-dom";


const RelatedProducts = ({ products }) => {
    const navigate = useNavigate();
    return (
        <section  className="relative pt-8 ml-3 grid overflow-x-auto">
            <h1 className="p-2 top-7 text-lg font-extrabold tracking-tight absolute">Other products you might like...</h1>
            {products.map((product, index) => (
                <div
                    key={index}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    className="mt-10 group col-span-1 row-start-1  min-w-[200px] relative p-4 border-r border-b border-gray-200 sm:p-6 cursor-pointer">
                    <div className="min-w-full rounded-lg overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 group-hover:opacity-75">
                        <img
                            src={product.image.image}
                            alt={product.name}
                            className="w-full h-full object-center object-cover"
                        />
                    </div>
                    <div className="pt-10 pb-4 text-center">
                        <h3 className="text-sm font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.name}
                        </h3>
                        <p className="mt-4 text-xs text-blue-800 tracking-widest">
                            {product.variantFacts.numVariants} options from ${product.variantFacts.bottomPrice}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default RelatedProducts