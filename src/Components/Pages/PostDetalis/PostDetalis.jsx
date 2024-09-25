import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./PostDetalis.css";




function PostDetails() {
  const { postId } = useParams(); // Get postId from URL
  const [postDetails, setPostDetails] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    body: "",
  });

  useEffect(() => {
    // Fetch post details and comments
    const fetchPostDetails = async () => {
      try {
        const postResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts/${postId}`
        );
        const commentsResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
        );
        setPostDetails(postResponse.data);
        setComments(commentsResponse.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load post details or comments.");
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.name && newComment.email && newComment.body) {
      setComments([...comments, newComment]);
      setNewComment({ name: "", email: "", body: "" });
      toast.success("Your comment has been added successfully");
    } else {
      toast.error("All fields are required for adding a comment.");
    }
  };

  return (
    <div className="post-details-container">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="container">
          {postDetails && (
            <>
              <h2>{postDetails.title}</h2>
              <p>{postDetails.body}</p>
              <div className="comments-section">
                <h4>Comments</h4>
                {comments.map((comment) => (
                  <div className="comment" key={comment.id}>
                    <h5>{comment.name}</h5>
                    <p>{comment.body}</p>
                    <small>{comment.email}</small>
                  </div>
                ))}
              </div>

              <div className="add-comment-form">
                <h4>Add a Comment</h4>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Your Name"
                  value={newComment.name}
                  onChange={(e) =>
                    setNewComment({ ...newComment, name: e.target.value })
                  }
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Your Email"
                  value={newComment.email}
                  onChange={(e) =>
                    setNewComment({ ...newComment, email: e.target.value })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Your Comment"
                  rows="4"
                  value={newComment.body}
                  onChange={(e) =>
                    setNewComment({ ...newComment, body: e.target.value })
                  }
                />
                <button className="btn btn-success" onClick={handleAddComment}>
                  Add Comment
                </button>
              </div>
            </>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default PostDetails;
