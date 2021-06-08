import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { getPosts, sendPost } from "../../actions/post";
import PostItem from "./PostItem";
const Posts = ({ getPosts, posts, sendPost }) => {
  useEffect(() => getPosts(), [getPosts]);

  const [formData, setFormData] = useState("");

  const { text } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    sendPost({ text });
  };

  return (
    <Fragment>
      {" "}
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome to the community!
      </p>
      <div className="post-form">
        <div className="bg-primary p">
          <h3>Say Something...</h3>
        </div>
        <form className="form my-1" onSubmit={(e) => onSubmit(e)}>
          <textarea
            name="text"
            cols="30"
            rows="5"
            placeholder="Create a post"
            onChange={(e) => onChange(e)}
            value={text}
            required
          ></textarea>
          <input type="submit" className="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
      <div className="posts">
        {posts.map((post, index) => (
          <PostItem key={index} post={post} />
        ))}
      </div>
    </Fragment>
  );
};
const mapStateToProps = (state) => ({
  posts: state.post.posts,
});

export default connect(mapStateToProps, { getPosts, sendPost })(Posts);
