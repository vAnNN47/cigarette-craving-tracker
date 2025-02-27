import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Login from "../components/AuthForms/Login";
import Register from "../components/AuthForms/Register";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { currentUser, hasUserSetupData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (hasUserSetupData()) {
        navigate("/dashboard");
      } else {
        navigate("/setup");
      }
    }
  }, [currentUser, hasUserSetupData, navigate]);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            Quit Smoking Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Track your cravings and see your progress
          </p>
        </div>

        {showLogin ? (
          <Login onSwitchToRegister={toggleForm} />
        ) : (
          <Register onSwitchToLogin={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default Auth;
