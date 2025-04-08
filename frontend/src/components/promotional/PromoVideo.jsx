import { Link } from "react-router-dom"
export default function PromoVideo() {
    return (
        <div className="relative bg-gray-800 py-32 px-6 sm:py-40 sm:px-12 lg:px-16 mt-10">
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src="https://fishnwirepictures.s3.us-east-2.amazonaws.com/austin-neill-Be7DMcK7k3o-unsplash.jpg"
                    alt=""
                    className="w-full h-full object-center object-cover"
                />
            </div>
            <div className="relative text-center">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Demo Video</h2></div>

            <div className="relative flex justify-center">
                <video class="h-full w-full max-w-3xl rounded-lg" controls>
                    <source
                        src="https://fishnwirepictures.s3.us-east-2.amazonaws.com/fishnstik+demo+720.mp4"
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    )
}
