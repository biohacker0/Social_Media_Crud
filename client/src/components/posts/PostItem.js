import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { deletePost, addLike, removeLike } from "../../actions/post";
const PostItem = ({ post, deletePost, addLike, removeLike, showActions }) => {
  return (
    <Fragment>
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to="profile.html">
            <img className="round-img" src={post.avatar} alt="" />
            <h4>{post.name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{post.text}</p>
          <p className="post-date">Posted on {post.date}</p>
          {showActions && (
            <Fragment>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => addLike(post._id)}
              >
                <i className="fas fa-thumbs-up"></i>
                <span>{post.likes.length}</span>
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => removeLike(post._id)}
              >
                <i className="fas fa-thumbs-down"></i>
              </button>
              <Link to={`/posts/${post._id}`} className="btn btn-primary">
                Discussion{" "}
                <span className="comment-count">{post.comments.length}</span>
              </Link>
              <button
                type="submit"
                className="btn btn-danger"
                onClick={() => deletePost(post._id)}
              >
                <i className="fas fa-times"></i>
              </button>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

PostItem.defaultProps = {
  showActions: true,
};

export default connect(null, { deletePost, addLike, removeLike })(PostItem);
