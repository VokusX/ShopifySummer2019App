// David Voicu, 2019
// This is the main file in charge of handling all of the logic and processes for the app.

import React, { Component } from "react";
import "./waste.css";

//import Font Awesome so that we can get the search icon and the favourites icon
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

//add them to the library so that we can call them later
library.add(faStar);
library.add(faSearch);

class Waste extends Component {
  //start by defining some variables in the constructor for the component
  constructor(props) {
    super(props);

    this.state = {
      //keyword will store the user's input from the search bar
      keyword: "",
      //the raw JSON from the API
      apiData: [],
      //favourites that the user chooses
      fav: []
    };
  }

  //componentDidMount() is invoked once the component is initialized, but before its rendered, so we should make our API call here
  //the function takes the data from the API and converts it to a JSON object to be put into the array we created
  componentDidMount() {
    fetch(
      "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000"
    )
      .then(res => res.json())
      .then(rawData => this.setState({ rawData }));
  }

  render() {
    return (
      <div className="wasteApp">
        <div className="header">
          <h1>Toronto Waste Lookup</h1>
        </div>
      </div>
    );
  }
}

export default Waste;
