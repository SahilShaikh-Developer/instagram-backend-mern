import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register } from "../services/auth.api";

function getAuthErrorMessage(err) {
  if (err?.response?.data?.message) {
    return err.response.data.message;
  }
  if (!err?.response && (err?.request || err?.code === "ERR_NETWORK")) {
    return "Cannot reach the server. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function useAuth() {
  const context = useContext(AuthContext);

  const { user, setuser, loading, setloading, authChecked } = context;

  const runAuthAction = async (requestFn) => {
    setloading(true);
    try {
      const response = await requestFn();
      setuser(response.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: getAuthErrorMessage(err) };
    } finally {
      setloading(false);
    }
  };

  const handleLogin = (username, password) =>
    runAuthAction(() => login(username, password));

  const handleRegister = (username, email, password) =>
    runAuthAction(() => register(username, email, password));

  return{
    user,loading,authChecked,handleLogin,handleRegister
  }
}
