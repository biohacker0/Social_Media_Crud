import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getProfiles } from "../../actions/profile";

import ProfileItem from "./ProfileItem";

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  const [search, setSearch] = useState("");

  const filteredProfiles = profiles.filter((item) =>
    item.user.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => getProfiles(), [getProfiles]);

  return (
    <Fragment>
      <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i>Browse and connect with
        developers
      </p>
      <div className="profiles">
        <input
          type="search"
          className="search-bar"
          placeholder=" Search Profiles"
          onChange={(e) => setSearch(e.target.value)}
        />

        {profiles.length > 0 ? (
          filteredProfiles.map((profile) => (
            <ProfileItem key={profile._id} profile={profile} />
          ))
        ) : (
          <h4>No profiles found ...</h4>
        )}
      </div>
    </Fragment>
  );
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
