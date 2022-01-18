import styled from "styled-components";
import { Navbar } from "react-bootstrap";
import * as colorThemes from "../../utils/themes/colorThemes"


const NavbarBrand = styled(Navbar.Brand)`
  color: ${colorThemes.blackCoral} !important;
  font-weight: bold;
`

const NavbarCollapse = styled(Navbar.Collapse)`
  a {
    color: ${colorThemes.blackCoral} !important;
  }
`

export {
  NavbarBrand,
  NavbarCollapse,
}
