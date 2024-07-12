

const UserCard = ({ userData }) => {
    return (
        <div class="md:px-10 px-4 py-6 font-[sans-serif]">
            <div class="container mx-auto">
                <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">

                    {userData.map((user) => (
                        <div class="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden mt-4">
                            <div class="relative h-48">
                                <img class="w-full h-full object-cover" src={user.profile_picture ? user.profile_picture : "https://is3.cloudhost.id/gotong-garuda-hack/svg/person-svgrepo-com.svg"} alt="Profile Picture" />
                                <div class="absolute bottom-2 right-2 bg-white text-xs font-semibold px-2 py-1 rounded">
                                    {user.tier_name}
                                </div>
                            </div>
                            <div class="p-6">
                                <h2 class="text-xl font-bold text-gray-900 mb-2">{user.name.length > 15 ? user.name.substring(0, 20) + '...' : user.name}</h2>
                                <p class="text-gray-600 text-sm mb-4">{user.username}</p>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-500">Tier:</span>
                                    <span class="text-sm text-gray-500">{user.tier_name}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

export default UserCard;

