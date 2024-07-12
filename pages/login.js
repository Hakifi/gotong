import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../authentication/AuthContext";
import crypto from "crypto";
import Swal from 'sweetalert2';
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";

const Login = ({ error }) => {

    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router]);

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // Handle successful Google sign-in (redirect, state update, etc.)
        } catch (error) {
            console.error("Error signing in with Google:", error);
            // Handle error (display error message, retry, etc.)
        }
    };



    const handleLoginDefault = async (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        let password = e.target.password.value;

        password = crypto.createHash('sha256').update(password).digest('hex');

        try {
            const res = await axios.post("/api/Login", {
                email,
                password,
            });

            Swal.fire({
                icon: 'success',
                title: 'Login Success',
                showConfirmButton: false,
                timer: 1000
            }).then(() => {
                window.location.href = '/';
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Invalid username or password',
            });
        }

    }

    return (
        <div class="font-sans min-h-screen bg-white ">
            {!user && (<div class="grid lg:grid-cols-2 md:grid-cols-2 items-center gap-4">
                <div class="max-md:order-1 h-screen ">
                    <img src="https://is3.cloudhost.id/gotong-garuda-hack/gotong-garuda-hack/images/photo-1670631167436-a847c4f48a7c.webp" class="p-2 w-full h-full object-cover rounded-3xl" alt="login-image" />
                </div>

                <form class="max-w-xl w-full p-6 mx-auto" method="post" onSubmit={handleLoginDefault}>
                    <div class="mb-8">
                        <h3 class="text-gray-800 text-4xl font-extrabold text-center">Welcome Back!</h3>
                    </div>

                    <div>
                        <div class="relative flex items-center">
                            <input id="email"
                                name="email"
                                type="email"
                                autoComplete="email" required class="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-[#27374D]" placeholder="Enter Email" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 682.667 682.667">
                                <defs>
                                    <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                        <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                    </clipPath>
                                </defs>
                                <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                    <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                                    <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                                </g>
                            </svg>
                        </div>
                    </div>

                    <div class="mt-2">
                        <div class="relative flex items-center">
                            <input id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password" required class="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-md outline-[#27374D]" placeholder="Enter Password" />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                            </svg>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-4 mt-2">
                        <div class="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                            <label for="remember-me" class="ml-2 block text-sm text-gray-800">
                                Remember me
                            </label>
                        </div>
                        <div>
                            <a href="#" class="text-[#526D82] font-semibold text-sm hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                    </div>

                    <div class="mt-12">
                        <button type="submit" class="w-full py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-[#526D82] hover:bg-[#27374D] focus:outline-none">
                            Login
                        </button>
                    </div>

                    <div class="my-6 flex items-center gap-4">
                        <hr class="w-full border-gray-300" />
                        <p class="text-sm text-gray-800 text-center">or</p>
                        <hr class="w-full border-gray-300" />
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        type="button" class="w-full flex items-center justify-center gap-4 py-2.5 px-4 text-sm tracking-wide text-gray-800 border border-gray-300 rounded-md bg-transparent hover:bg-gray-50 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" class="inline" viewBox="0 0 512 512">
                            <path fill="#fbbd00"
                                d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                                data-original="#fbbd00" />
                            <path fill="#0f9d58"
                                d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                                data-original="#0f9d58" />
                            <path fill="#31aa52"
                                d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                                data-original="#31aa52" />
                            <path fill="#3c79e6"
                                d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                                data-original="#3c79e6" />
                            <path fill="#cf2d48"
                                d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                                data-original="#cf2d48" />
                            <path fill="#eb4132"
                                d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                                data-original="#eb4132" />
                        </svg>
                        Continue with google
                    </button>
                    <p class="text-gray-800 text-sm mt-6 text-center">Don't have an account? <a href="/register" class="text-[#526D82] font-semibold hover:underline whitespace-nowrap">Register here</a></p>
                </form>
            </div>)}
        </div>
    );


};


export default Login;

export async function getServerSideProps() {

    return {
        props: {
            error: false,
        },
    };

}