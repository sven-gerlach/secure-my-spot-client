import styled from "styled-components";

// import assets
import companyLogo from '../assets/img/car_grey.png'

// import themes
import * as theme from '../utils/themes/colorThemes'

const AppBackground = styled.div`
  width: 100vw;
  height: 100vh;
  background-attachment: fixed;
  background-origin: border-box;
  background-image: url(${companyLogo});
  background-color: ${theme.blueYonder};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`

export { AppBackground }
