import React, { useState } from "react";
import "../button.scss";
import "../nav.scss";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Nav = () => {

    const navigate = useNavigate()
    const { loading, handleLogout } = useAuth()
    const [error, setError] = useState("")

    const handleLogoutClick = async () => {
      setError("")
      const result = await handleLogout()
      if (result.success) {
        window.location.assign("/login")
      } else {
        setError(result.message)
      }
    }

  return (
    <nav className="nav-bar">
      <p>Insta</p>
      <div>
        <button onClick={()=>{

          navigate("/create-post")


        }} className="button primary-button">New Post</button>{" "}
        <button onClick={handleLogoutClick} disabled={loading} className="button primary-button">
          {loading ? "Logging out..." : "Logout"}
        </button>
        {error && <span className="nav-error">{error}</span>}
      </div>
    </nav>
  );
};

export default Nav;
