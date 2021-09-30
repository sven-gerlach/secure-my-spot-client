import React, { Component } from "react";
import { H1 } from "./pageTitle.styles";

/** Class representing a page title.
 * @param {attribute} titleText - The title of the H1 element.
 * */
class PageTitle extends Component {
  render() {
    return (
      <H1>{this.props.titleText}</H1>
    )
  }
}

export default PageTitle
