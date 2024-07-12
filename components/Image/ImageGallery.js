import { useState, useEffect } from 'react';
import Image from 'next/image';

const ImageGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0]?.url);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image.url);
    };

    const handleMainImageClick = () => {
        setFullscreenImage(selectedImage);
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div className="mx-auto bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[80vh]">
                <div className="relative h-full">
                    {selectedImage && (
                        <Image
                            src={selectedImage}
                            alt="Main preview"
                            layout="fill"
                            objectFit="contain"
                            className="rounded-lg shadow-md cursor-pointer"
                            onClick={handleMainImageClick}
                        />
                    )}
                </div>
                <div className="h-full overflow-y-auto scrollbar-hide">
                    {images.map((image, index) => (
                        <div key={index} className="relative mb-2 group">
                            <Image
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                width={400}
                                height={300}
                                objectFit="contain"
                                className="w-full rounded-lg shadow-md p-2 cursor-pointer"
                                onClick={() => handleImageClick(image)}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {fullscreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-screen">
                        <Image
                            src={fullscreenImage}
                            alt="Fullscreen"
                            layout="fill"
                            objectFit="contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-70 text-2xl p-2"
                            onClick={handleCloseFullscreen}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ImageGallery;