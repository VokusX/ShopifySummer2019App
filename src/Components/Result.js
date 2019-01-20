// David Voicu, 2019
// This is file stores the Result container that gets displayed to the user with the info from the API

import React, { Component } from "react";
import "./Results.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faSearch } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";

library.add(faStar);
library.add(faSearch);

class Result extends Component {
  getFavouriteButtonColor() {
    const { isFavourited } = this.props;
    if (isFavourited) {
      return "#23975e";
    } else return "#bdbdbd";
  }

  render() {
    const { title, body, onClick } = this.props;
    return (
      <div className="resultTile">
        <div className="favStar">
          <FontAwesomeIcon
            size="1x"
            icon="star"
            color={this.getFavouriteButtonColor()}
            onClick={onClick}
          />
        </div>
        <div className="resultTitle">{title}</div>
        <div className="resultBody">{parse(parse(body))}</div>
      </div>
    );
  }
}

export default Result;
