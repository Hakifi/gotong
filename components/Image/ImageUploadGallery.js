import { useState, useEffect } from 'react';

const ImageUploadGallery = ({ filesRefs, category }) => {
    const [files, setFiles] = useState(filesRefs.current || {});
    const [preview, setPreview] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [fullscreenImage, setFullscreenImage] = useState(null);

    useEffect(() => {
        if (filesRefs && filesRefs.current) {
            const currentFiles = filesRefs.current[category] || [];
            if (Array.isArray(currentFiles)) {
                const previewUrls = currentFiles.map(file => URL.createObjectURL(file));
                setPreview(previewUrls);
            }
        }
    }, [filesRefs, category]);

    const removeImage = (index) => {
        setFiles(prevFiles => {
            const newFiles = {
                ...prevFiles,
                [category]: (prevFiles[category] || []).filter((_, i) => i !== index),
            }
            if (filesRefs && filesRefs.current) {
                filesRefs.current = newFiles;
            }
            return newFiles;
        });
        setPreview(prevPreview => prevPreview.filter((_, i) => i !== index));
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file.size > 5000000) {
            alert('File size too large. Please upload a file smaller than 5MB.');
            return;
        }

        if (file) {
            setFiles(prevFiles => {
                const newFiles = {
                    ...prevFiles,
                    [category]: [...(prevFiles[category] || []), file],
                }
                if (filesRefs && filesRefs.current) {
                    filesRefs.current = newFiles;
                }
                return newFiles;
            });
            setSelectedImage(URL.createObjectURL(file));
            setPreview(prevPreview => [...prevPreview, URL.createObjectURL(file)]);
        }
    }

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const handleMainImageClick = () => {
        setFullscreenImage(selectedImage);
    };

    const handleCloseFullscreen = () => {
        setFullscreenImage(null);
    };

    useEffect(() => {
        return () => {
            preview.forEach(previewURL => URL.revokeObjectURL(previewURL));
        }
    }, [preview]);
    return (
        <div className="h-full mx-auto bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="grid grid-cols-2 gap-4 h-80">
                <div className="relative">
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Main preview"
                            className="w-full object-contain rounded-lg shadow-md h-80 cursor-pointer"
                            onClick={handleMainImageClick}
                        />
                    )}
                </div>
                <div className="container h-80">
                    <div className="container overflow-y-auto hide-scrollbar h-2/3 mb-4">
                        {preview.map((image, index) => (
                            <div key={index} className="relative mb-2 group">
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full object-contain rounded-lg shadow-md h-40 p-2 cursor-pointer"
                                    onClick={() => handleImageClick(image)}
                                />
                                <button
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(index)}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="container h-1/3 text-center items-center justify-center">
                        <input
                            type="file"
                            accept='image/*'
                            onChange={handleImageUpload}
                            className="w-full p-2 border border-gray-300 rounded-lg file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                </div>
            </div>
            {fullscreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-screen">
                        <img
                            src={fullscreenImage}
                            alt="Fullscreen"
                            className="max-w-full max-h-screen object-contain"
                        />
                        <button
                            className="absolute top-4 right-4 text-white bg-black bg-opacity-70 text-2xl"
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

export default ImageUploadGallery;