import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { currentUser, hasUserSetupData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (hasUserSetupData()) {
        navigate("/dashboard");
      } else {
        navigate("/setup");
      }
    } else {
      navigate("/auth");
    }
  }, [currentUser, hasUserSetupData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Home;
