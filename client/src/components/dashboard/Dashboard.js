import React, { Fragment, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getProfile, deleteAccount } from "../../actions/profile";
import DashboardActions from "./DashboardActions";

import Education from "./Education";

const Dashboard = ({
  profile: { profile },
  getProfile,
  deleteAccount,
  history,
  register: { user, loading },
}) => {
  useEffect(() => getProfile(), [getProfile]);

  return (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile ? (
        <Fragment>
          <DashboardActions />
          <Education education={profile.education} />
        </Fragment>
      ) : (
        <Fragment>
          <p>You have not yet setup your profile,please add some info</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}

      <div className="my-2">
        <button className="btn btn-danger" onClick={() => deleteAccount()}>
          <i className="fas fa-user-minus"></i>
          Delete My Account
        </button>
      </div>
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  profile: state.profile,
  register: state.register,
});

export default connect(mapStatetoProps, { getProfile, deleteAccount })(
  withRouter(Dashboard)
);
