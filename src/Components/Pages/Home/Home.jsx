
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts, addPost, updatePost, deletePost } from "../../../APIs/postsApis";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faAdd } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import UpdateModal from "./UpdateModal";
import { Link } from "react-router-dom";

function Home() {
  const allPosts = useSelector((state) => state.postsData.posts);
  const loading = useSelector((state) => state.postsData.setLoading);
  const dispatch = useDispatch();
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
  });
  const [show, setShow] = useState(false);
  const [currentPost, setCurrentPost] = useState({
    title: "",
    body: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleCloseModal = () => setShow(false);

  const validatePost = (post) => {
    const { title, body } = post;
    if (title.length < 10 || title.length > 150) {
      toast.error("Title must be between 10 and 150 characters");
      return false;
    }
    if (body.length < 50 || body.length > 300) {
      toast.error("Body must be between 50 and 300 characters");
      return false;
    }
    return true;
  };

  const handleAddPost = () => {
    if (validatePost(newPost)) {
      setIsSubmitting(true);
      dispatch(addPost(newPost)).then(() => {
        setNewPost({ title: "", body: "" });
        setIsSubmitting(false);
        toast.success("Your post has been added successfully");
      }).catch(() => {
        setIsSubmitting(false);
      });
    }
  };

  const handleShowModal = (post) => {
    setShow(true);
    setCurrentPost(post);
  };

  const handleUpdatePost = () => {
    const updatedPostData = { title: currentPost.title, body: currentPost.body };
    if (validatePost(updatedPostData)) {
      setIsSubmitting(true);
      dispatch(updatePost({ id: currentPost.id, updatedData: updatedPostData })).finally(() => {
        handleCloseModal();
        setIsSubmitting(false);
        toast.success("Your post has been updated successfully");
      });
    }
  };

  const handleDeletePost = (id) => {
    dispatch(deletePost(id)).then(() => {
      toast.success("The post has been deleted successfully");
    });
  };

  const isAddPostButtonDisabled = () => {
    return !(newPost.title.length >= 10 && newPost.title.length <= 150 && 
             newPost.body.length >= 50 && newPost.body.length <= 300);
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="posts-container">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                {allPosts.map((post) => (
                  <div className="card post-item" key={post.id}>
                    <div className="card-body">
                      <Link to={`/post/${post.id}`}>
                        <h5>
                          {post.id} - {post.title}
                        </h5>
                      </Link>
                      <p className="card-text">{post.body}</p>
                      <div className="postControlButtons">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleShowModal(post)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Update
                        </button>
                        <button className="btn btn-danger" onClick={() => handleDeletePost(post.id)}>
                          <FontAwesomeIcon icon={faTrashAlt} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-lg-4">
                <div className="add-post-form">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Body"
                    rows="4"
                    value={newPost.body}
                    onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                  />
                  <button
                    className="btn btn-success"
                    onClick={handleAddPost}
                    disabled={isSubmitting || isAddPostButtonDisabled()} // Disable if submitting or validation fails
                  >
                    <FontAwesomeIcon icon={faAdd} /> Add Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <UpdateModal
        show={show}
        handleCloseModal={handleCloseModal}
        currentPost={currentPost}
        handleChangedData={setCurrentPost}
        handleUpdatePost={handleUpdatePost}
      />
      <ToastContainer />
    </>
  );
}

export default Home;
