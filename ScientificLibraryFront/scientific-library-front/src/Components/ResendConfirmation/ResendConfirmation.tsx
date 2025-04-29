import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/api";

interface ResendConfirmationProps {
  email: string;
  clientUri: string;
}

const ResendConfirmation: React.FC<ResendConfirmationProps> = ({
  email,
  clientUri,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/api/auth/resend-confirmation",
        {
          email,
          clientUri,
        }
      );
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleResend}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
    >
      {loading ? "Resending..." : "Resend Confirmation Email"}
    </button>
  );
};

export default ResendConfirmation;
