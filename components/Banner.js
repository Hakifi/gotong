import axios from "axios";

const Banner = ({ }) => {
    return (
        <div>
            <div class="p-8 relative font-sans before:absolute before:w-full before:h-full before:inset-0 before:bg-black before:opacity-50">
                <img src="https://images.unsplash.com/photo-1495653797063-114787b77b23?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Banner Image" class="absolute inset-0 w-full h-full object-cover rounded-lg" />

                <div class="min-h-[350px] relative h-full max-w-6xl mx-auto flex flex-col justify-center items-center text-center text-white p-6">
                    <h2 class="sm:text-4xl text-2xl font-bold mb-6">Let's Help Each Other</h2>
                    <p class="sm:text-lg text-base text-center text-gray-200">help as many people as possible in a different and fun way</p>

                    <button type="button" class="mt-12 bg-transparent text-white text-base py-3 px-6 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300">
                        Explore
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Banner;
