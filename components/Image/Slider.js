import { useState, useEffect } from 'react';

const Slider = ({ data }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fullscreenPreview, setFullscreenPreview] = useState(null);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    const getAdjacentIndex = (offset) => {
        return (currentIndex + offset + data.length) % data.length;
    };

    const openFullscreenPreview = (index) => {
        setFullscreenPreview(data[index]);
    };

    const closeFullscreenPreview = () => {
        setFullscreenPreview(null);
    };

    return (
        <>
            <div className="flex items-center justify-center w-full h-full mx-auto">
                {/* Previous preview */}
                <div
                    className="hidden md:block w-1/3 h-64 mr-2 overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => openFullscreenPreview(getAdjacentIndex(-1))}
                >
                    <img
                        src={data[getAdjacentIndex(-1)].image}
                        alt="Previous"
                        className="w-full h-full object-cover opacity-50 hover:opacity-75 transition-opacity"
                    />
                </div>
                {/* Main slider */}
                <div className="relative w-full md:w-5/6 overflow-hidden rounded-lg">
                    <div
                        className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="w-full flex-shrink-0 relative"
                            >
                                <img src={item.image} alt={item.title} className="w-full h-96 object-cover" onClick={() => openFullscreenPreview(index)} />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-filter text-white p-4">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-sm">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2"
                    >
                        &gt;
                    </button>
                </div>
                {/* Next preview */}
                <div
                    className="hidden md:block w-1/3 h-64 ml-2 overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => openFullscreenPreview(getAdjacentIndex(1))}
                >
                    <img
                        src={data[getAdjacentIndex(1)].image}
                        alt="Next"
                        className="w-full h-full object-cover opacity-50 hover:opacity-75 transition-opacity"
                    />
                </div>
            </div>

            {/* Fullscreen Preview */}
            {fullscreenPreview && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                    onClick={closeFullscreenPreview}
                >
                    <div className="relative w-full h-full">
                        <img
                            src={fullscreenPreview.image}
                            alt={fullscreenPreview.title}
                            className="object-contain h-full mx-auto"
                        />
                        <button
                            onClick={closeFullscreenPreview}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            &times;
                        </button>
                    </div>
                </div >
            )}

        </>
    );
};

export default Slider;