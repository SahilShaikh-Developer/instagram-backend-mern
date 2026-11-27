import React, { useRef, useState } from "react";
import "../style/createpost.scss";
import { usePost } from "../hooks/use.post";
import {useNavigate} from "react-router"

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const postImageInputFieldRef = useRef(null);

  const navigate = useNavigate()


  const {loading ,handleCreatePost} = usePost()

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const file = postImageInputFieldRef.current.files[0];
    if (!file) {
      setError("Please select an image.");
      return;
    }

    const result = await handleCreatePost(file, caption);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  }

  return (
    <main className="create-post-page">
      <div className="form-container">
        <h1>Create Post</h1>
        <form onSubmit={handleSubmit}>
          <label className="post-image-label" htmlFor="postImage">
            Select Image{" "}
          </label>
          <input ref={postImageInputFieldRef}
            hidden
            type="file"
            name="postImage"
            id="postImage"
            accept="image/*"
          />
          <input required value={caption}
            onChange={(e)=>{
                 setCaption(e.target.value)
            }}
            type="text"
            name="caption"
            id="caption"
            placeholder="Enter Caption"
          />
          <button type="submit" disabled={loading} className="button primary-button">
            {loading ? "Creating..." : "Create Post"}
          </button>
        </form>
        {error && <p className="create-post-error">{error}</p>}
      </div>
    </main>
  );
};

export default CreatePost;
