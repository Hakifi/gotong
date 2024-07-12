import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../authentication/AuthContext";
import withAuth from "../../authentication/WithAuth"
import Navbar from "../../components/Navbar";
import Select from 'react-select';
import SelectLocation from "../../components/Map/SelectLocation";
import getCityByCoordinates from "../../utils/GetCity";
import axios from "axios";
import ImageUploadGallery from "../../components/Image/ImageUploadGallery";
import CreatableSelect from 'react-select/creatable';
import { useRouter } from "next/router";
import Footer from "../../components/Footer";


const Add = ({ error, firstStageType }) => {
    // default
    const { user } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(1);

    // data
    const filesRef = useRef({});
    const dataRef = useRef({
        activity_name: '',
        activity_type: '',
        date_action: '',
        description: '',
        location: {
            address: '',
            city: '',
            latitude: '',
            longitude: ''
        },
        contact_person: {
            telephone: '',
            instagram: ''
        }
    });
    const subPlanRef = useRef([]);

    // styling
    const reactSelectStyle = {
        control: (provided) => ({
            ...provided,
            borderColor: '#e5e7eb',
            '&:hover': {
                borderColor: '#d1d5db',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#e5e7eb' : null,
            color: state.isSelected ? 'white' : 'black',
        }),
    };

    const StickyBar = () => {
        const [, updateNow] = useState({});

        return (
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 p-8 z-40">
                <div className="container mx-auto flex justify-between">
                    <div className="flex items-center">

                    </div>
                    <div className="flex justify-end items-center">
                        <button
                            className={`${step == 1 ? "hidden" : "block"} bg-gray-300 text-white font-semibold px-4 py-2 rounded-md mr-4`}
                            onClick={() => setStep(step - 1)}
                            disabled={step === 1}
                        >
                            Back
                        </button>
                        <button
                            className={`bg-blue-500 text-white font-semibold px-4 py-2 transition-colors rounded-md ${step === 3 ? "hover:bg-green-200" : "hover:bg-blue-700"}`}
                            onClick={async () => {
                                if (step == 1) {
                                    if (dataRef.current.activity_name == '' || dataRef.current.activity_type == '' || dataRef.current.date_action == '' || dataRef.current.description == '' || dataRef.current.location.address == '' || dataRef.current.location.city == '' || dataRef.current.location.latitude == '' || dataRef.current.location.longitude == '' || dataRef.current.contact_person.telephone == '') {
                                        alert('Please fill in all the fields');
                                        return;
                                    }

                                    if (filesRef.current.image == undefined) {
                                        alert('Please upload at least one image');
                                        return;
                                    }

                                    setStep(step + 1);

                                }

                                if (step == 2) {
                                    dataRef.current = { ...dataRef.current, plan: subPlanRef.current, image: filesRef.current.image };
                                    console.log(dataRef.current);

                                    setStep(step + 1);
                                }

                                if (step === 3) {
                                    try {
                                        const formData = new FormData();

                                        Object.keys(dataRef.current).forEach(key => {

                                            if (key === `location`) {
                                                formData.append('address', dataRef.current.location.address);
                                                formData.append('city', dataRef.current.location.city);
                                                formData.append('latitude', dataRef.current.location.latitude);
                                                formData.append('longitude', dataRef.current.location.longitude);
                                            } else if (key === 'contact_person') {
                                                formData.append('telephone', dataRef.current.contact_person.telephone);
                                                formData.append('instagram', dataRef.current.contact_person.instagram);
                                            }

                                            if (key === 'plan') {
                                                formData.append('plan', JSON.stringify(dataRef.current.plan));



                                            } else if (key === 'image') {
                                                // Append each image file separately
                                                dataRef.current.image.forEach((file, index) => {
                                                    formData.append(`image`, file);
                                                });
                                            } else {
                                                formData.append(key, dataRef.current[key]);
                                            }
                                        });

                                        const res = await axios.post('http://localhost:8592/api/v1/postActivity', formData, {
                                            headers: {
                                                'Content-Type': 'multipart/form-data',
                                                'x-api-key': user.api_key
                                            }
                                        });

                                        if (res.status === 200) {
                                            alert('Activity added successfully');
                                            router.push('/');
                                        }


                                        // Handle response here
                                    } catch (error) {
                                        // Handle error here
                                        console.error('Error uploading data:', error);
                                    }
                                }

                            }}
                        >
                            {step === 3 ? "Finish" : "Next"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const FirstStep = ({ typeSelection, filesRef }) => {

        const [coordinate, setCoordinate] = useState(null);
        const [detailData, setDetailData] = useState(dataRef.current);
        const [type, setType] = useState([]);

        useEffect(() => {
            typeSelection.map((type) => {
                setType(prevType => [...prevType, { value: type.activity_type_id, label: type.activity_type_name, type: type.urgen ? 'urgent' : 'not_urgent' }]);
            });
        }, [typeSelection]);

        const handleChange = (e) => {

            const { name, value } = e.target;

            if (name === 'date_action') {
                const date = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (date < today) {
                    alert('Date must be greater than today');
                    return;
                }

            }

            if (name === "whatsapp") {
                setDetailData(prevData => ({
                    ...prevData,
                    contact_person: {
                        ...prevData.contact_person,
                        telephone: value
                    }
                }));
                console.log(detailData);
                return;
            }

            if (name === "instagram") {
                setDetailData(prevData => ({
                    ...prevData,
                    contact_person: {
                        ...prevData.contact_person,
                        instagram: value
                    }
                }));
                console.log(detailData);
                return;
            }


            setDetailData(prevData => {
                const updatedData = { ...prevData, [name]: value };
                dataRef.current = updatedData;
                return updatedData;
            });
            console.log(filesRef.current);
            console.log(detailData);
        }


        const handleLocationSelect = async (location) => {
            setCoordinate(location);
            setDetailData(prevData => ({
                ...prevData,
                location: {
                    ...prevData.location,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    address: location.address,
                    city: location.city
                }
            }));
            console.log(detailData);
            return;

        };

        return (
            <div>
                <h1 className="text-3xl font-semibold text-black mt-2">What kind of Gotong are we talking?</h1>
                <p className="text-gray-500 mt-1 font-light">Fill in the details so we can gotong royong to help you.</p>
                <hr className="my-2" />
                <form className="space-y-4" method="POST">
                    <div className="col mb-2">
                        <ImageUploadGallery filesRefs={filesRef} category={"image"} />
                        <hr className="my-2" />
                        <label className="block text-sm font-medium text-gray-700 mt-2">Activity Name</label>
                        <input
                            type="text"
                            maxLength={100}
                            id="activity_name"
                            value={detailData.activity_name}
                            name="activity_name"
                            onChange={handleChange}
                            placeholder="Gotong together for"
                            className="text-black font-semibold text-4xl block w-full mt-1 p-2"
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="col">
                            <label className="block text-sm font-medium text-gray-700 mt-2">Type</label>
                            <Select
                                styles={reactSelectStyle}
                                options={type}
                                value={detailData.activity_type == '' ? null : type.find(t => t.value === detailData.activity_type)}
                                onChange={(selectedOption) => {
                                    const { value } = selectedOption;
                                    setDetailData(prevData => {
                                        const updatedData = { ...prevData, activity_type: value };
                                        dataRef.current = updatedData;
                                        return updatedData;
                                    });
                                }}
                                required={true}
                                className="text-sm mt-2"
                                placeholder="Type of Activity"
                            />
                        </div>
                        <div className="col">
                            <label className="block text-sm font-medium text-gray-700 mt-2">Date of Activity</label>
                            <input
                                type="date"
                                id="date_action"
                                name="date_action"
                                value={detailData.date_action}
                                onChange={handleChange}
                                required
                                className="block w-full mt-1 p-2 border border-gray-300 text-black rounded-md"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-2xl font-medium text-gray-700 mt-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={detailData.description}
                            onChange={handleChange}
                            required
                            className="block w-full mt-1 p-2 border border-gray-300 text-black rounded-md"
                        ></textarea>
                    </div>
                    <div className="mt-4">
                        <label className="block text-2xl font-medium text-gray-700 mt-2">Contact Info</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col">
                                <label className="block text-sm font-medium text-gray-700 mt-2">Phone</label>
                                <input
                                    type="number"
                                    id="whatsapp"
                                    value={detailData.contact_person.telephone}
                                    onChange={handleChange}
                                    name="whatsapp"
                                    required
                                    className="block w-full mt-1 p-2 border border-gray-300 text-black rounded-md"
                                />
                            </div>
                            <div className="col">
                                <label className="block text-sm font-medium text-gray-700 mt-2">Instagram</label>
                                <input
                                    type="text"
                                    id="instagram"
                                    value={detailData.contact_person.instagram}
                                    onChange={handleChange}
                                    name="instagram"
                                    className="block w-full mt-1 p-2 border border-gray-300 text-black rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 mb-32">
                        <h2 className="text-2xl font-medium text-gray-700 mt-2 mb-2">Location</h2>
                        <p className="text-md font-normal text-gray-500">You have to use your GPS, this is to avoid spam data.</p>
                        <SelectLocation onSelect={handleLocationSelect} />
                        {coordinate && (
                            <p>coordinate.address</p>
                        )}
                    </div>

                </form>
            </div>
        );
    };

    const SecondStep = () => {
        const [planData, setPlanData] = useState(subPlanRef.current);
        const [subPlanOptions, setSubPlanOptions] = useState([]);
        const [selectedPlan, setSelectedPlan] = useState(null);

        const nameRef = useRef(null);
        const descriptionRef = useRef(null);
        const dateRef = useRef(null);
        const timeRef = useRef(null);

        useEffect(() => {
            if (planData.length > 0) {
                setSubPlanOptions(planData.map(plan => ({ value: plan.id, label: plan.name })));
            }
        }, [planData]);

        const handlePlanChange = (newValue) => {
            setSelectedPlan(newValue);
            if (newValue && newValue.__isNew__) {
                const newPlan = {
                    id: planData.length + 1,
                    name: newValue.value,
                    description: '',
                    date: '',
                    time: ''
                };
                subPlanRef.current.push(newPlan);
                setPlanData([...subPlanRef.current]);
                setSelectedPlan({ value: newPlan.id, label: newPlan.name });
            }
            // Load existing plan data if selected
            if (newValue && !newValue.__isNew__) {
                const plan = subPlanRef.current.find(p => p.id === newValue.value);
                if (plan) {
                    nameRef.current.value = plan.name;
                    descriptionRef.current.value = plan.description;
                    dateRef.current.value = plan.date;
                    timeRef.current.value = plan.time;
                }
            }
        };

        const handleInputChange = () => {
            if (selectedPlan) {
                const updatedPlan = subPlanRef.current.find(p => p.id === selectedPlan.value);
                if (updatedPlan) {
                    updatedPlan.name = nameRef.current.value;
                    updatedPlan.description = descriptionRef.current.value;
                    updatedPlan.date = dateRef.current.value;
                    updatedPlan.time = timeRef.current.value;
                    setPlanData([...subPlanRef.current]);
                }
            }
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log(JSON.stringify(subPlanRef.current, null, 2));
        };

        return (
            <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-semibold text-gray-800 mb-4">Plans</h1>
                <hr className="my-4 border-gray-200" />
                <form onSubmit={handleSubmit} className="space-y-4" method="POST">
                    <CreatableSelect
                        styles={reactSelectStyle}
                        className="text-sm"
                        placeholder="Select or type to add Plans"
                        isClearable
                        formatCreateLabel={(inputValue) => `Add "${inputValue}" to the activity plan!`}
                        onChange={handlePlanChange}
                        options={subPlanOptions}
                        value={selectedPlan}
                    />
                    <input
                        ref={nameRef}
                        type="text"
                        name="name"
                        placeholder="Plan Name"
                        className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={handleInputChange}
                    />
                    <textarea
                        ref={descriptionRef}
                        name="description"
                        placeholder="Plan Description"
                        className="text-black w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                        onChange={handleInputChange}
                    ></textarea>
                    <div className="flex space-x-4">
                        <input
                            ref={dateRef}
                            type="date"
                            className="text-black flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                        <input
                            ref={timeRef}
                            type="time"
                            className="text-black flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={handleInputChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Save Plans
                    </button>
                </form>
            </div>
        );
    };

    const ThirdStep = () => {
        const [fullData] = useState(dataRef.current);

        return (
            <div className="mx-auto p-6 bg-white shadow-md rounded-lg mb-24 mt-2">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Confirmation</h1>
                <hr className="mb-6" />

                <div className="space-y-4">
                    <div>
                        <h2 className="text-2xl font-semibold text-black">{fullData.activity_name}</h2>
                        <p className="text-gray-600 font-normal">{fullData.description}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Date</h3>
                        <p className="text-gray-600">{fullData.date_action}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Location</h3>
                        <p className="text-gray-600">{fullData.location.address}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Contact</h3>
                        <p className="text-gray-600">Phone: {fullData.contact_person.telephone}</p>
                        <p className="text-gray-600">Instagram: {fullData.contact_person.instagram}</p>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700">Plan</h3>
                        {fullData.plan.map((item) => (
                            <div key={item.id} className="mt-2">
                                <p className="text-lg font-semibold text-black">{item.name}</p>
                                <p className="text-gray-600">{item.description}</p>
                                <p className="text-gray-600">{item.date} at {item.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="bg-white min-h-screen mx-auto">
            <Navbar user={user} />
            <StickyBar />
            <div className="w-full h-1 bg-blue-300 rounded-full">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${step * 33}%` }}></div>
            </div>
            <div className="p-8">
                <h1 className="text-xl font-light text-gray-500">Step {step} of 3</h1>
                {step === 1 && (<FirstStep typeSelection={firstStageType} filesRef={filesRef} />)}
                {step === 2 && (<SecondStep />)}
                {step === 3 && (<ThirdStep />)}
            </div>
            <Footer />
        </div>
    )

}

export default withAuth(Add);

export async function getServerSideProps() {

    const apiUrl = process.env.API_URL;
    const getFirstStageType = await axios.get(`${apiUrl}/getActivityTypeSelect`);
    const firstStageType = getFirstStageType.data;


    return {
        props: {
            error: false,
            firstStageType: firstStageType ? firstStageType : []
        },
    };
}