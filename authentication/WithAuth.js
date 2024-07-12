import { useAuth } from "./AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
    return (props) => {
        const { user } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push("/login");
            }
        }, [user, router]);

        if (!user) {
            return null; // or a loading indicator
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuth;
