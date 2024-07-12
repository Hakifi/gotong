import { useAuth } from "../authentication/AuthContext";

const Footer = () => {

    const { user } = useAuth();

    return (
        <div className="mt-32">
            <footer class="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 font-sans tracking-wide">
                <div class="py-12 px-12">
                    <div class="flex flex-wrap items-center sm:justify-between max-sm:flex-col gap-6">
                        <div>
                            <a href='javascript:void(0)'><img src="https://is3.cloudhost.id/gotong-garuda-hack/gotong-garuda-hack/images/go-tong.svg" alt="logo" class='w-20' /></a>
                        </div>

                        <ul class="flex items-center justify-center flex-wrap gap-y-2 md:justify-end space-x-6">
                            <li><a href="/" class="text-gray-300 hover:underline text-base">Home</a></li>
                            <li><a href="/activity/add" class="text-gray-300 hover:underline text-base">Request Gotong</a></li>
                            <li><a href="/model-citizen" class="text-gray-300 hover:underline text-base">Gotong Leaderboard</a></li>
                            {user && (
                                <li><a href="contribution" class="text-gray-300 hover:underline text-base">View Contribution</a></li>
                            )}
                        </ul>
                    </div>

                    <hr class="my-6 border-gray-500" />

                    <p class='text-center text-gray-300 text-base'>Copyright © 2024<a href='https://github.com/Hakifi'
                        target='_blank' class="hover:underline mx-1">Hakifi</a>All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );

}

export default Footer;