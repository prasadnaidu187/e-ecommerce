import { useEffect, useState } from "react";
import { getProfile } from "../services/api";

function Profile() {

    const [profile, setProfile] = useState<any>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const loadProfile = async () => {

            try {

                const data = await getProfile();

                console.log("Profile data:", data);

                setProfile(data);

            } catch (error) {

                if (error instanceof Error) {
                    setMessage(error.message);
                } else {
                    setMessage("Failed to load profile");
                }
            }
        };

        loadProfile();

    }, []);

    return (
        <div>

            <h1>My Profile</h1>

            {message && (
                <p>{message}</p>
            )}

            {profile && (
                <div>

                    <p>
                        <strong>ID:</strong>{" "}
                        {profile.id}
                    </p>

                    <p>
                        <strong>Name:</strong>{" "}
                        {profile.name}
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {profile.email}
                    </p>

                </div>
            )}

        </div>
    );
}

export default Profile;

