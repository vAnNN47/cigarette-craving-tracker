import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import UserInfoForm from "../components/AuthForms/UserInfoForm";
import { useTheme } from "../hooks/useTheme";

const UserSetup = () => {
  const { currentUser, hasUserSetupData } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    } else if (hasUserSetupData()) {
      navigate("/dashboard");
    }
  }, [currentUser, hasUserSetupData, navigate]);

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        darkMode ? "bg-gray-900" : "bg-gray-100"
      } p-4 transition-colors duration-200`}
    >
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            }`}
          >
            Quit Smoking Tracker
          </h1>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mt-2`}>
            Tell us about your smoking habits to track your progress
          </p>
        </div>

        <UserInfoForm />
      </div>
    </div>
  );
};

export default UserSetup;
