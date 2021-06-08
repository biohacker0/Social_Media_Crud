import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/auth";
import PropTypes from "prop-types";
const Navbar = ({ register: { isAuthenticated, loading }, logout }) => {
  const apiLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user" />{" "}
          <span className="hide=sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt" />{" "}
          <span className="hide=sm"> LOG OUT</span>
        </a>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> College Connector
        </Link>
      </h1>
      {!loading && (
        <Fragment>{isAuthenticated ? apiLinks : guestLinks}</Fragment>
      )}
    </nav>
  );
};
Navbar.protoTypes = {
  logout: PropTypes.func.isRequired,
  register: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  register: state.register,
});
export default connect(mapStateToProps, { logout })(Navbar);
