import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { connect } from "react-redux";
import { removeComment } from "../../actions/post";

const CommentItem = ({
  postId,
  comment: { _id, name, text, avatar, date, user },
  register,
  removeComment,
}) => {
  return (
    <Fragment>
      {" "}
      <div className="post bg-white p-1 my-1">
        <div>
          <Link to="profile.html">
            <img className="round-img" src={avatar} alt="" />
            <h4>{name}</h4>
          </Link>
        </div>
        <div>
          <p className="my-1">{text}</p>
          <p className="post-date">
            Posted on <Moment format="YYYY/MM/DD">{date}</Moment>{" "}
          </p>
        </div>

        {!register.loading && user === register.user._id && (
          <button
            onClick={() => removeComment(postId, _id)}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </Fragment>
  );
};

CommentItem.propTypes = {
  removeComment: PropTypes.func.isRequired,
  register: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  register: state.register,
});
export default connect(mapStateToProps, { removeComment })(CommentItem);
