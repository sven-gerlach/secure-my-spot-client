import styled from "styled-components";

const Div = styled("div")`
  height: 100%;
  
  @media only screen and (max-width: 600px) {
    & {
      width: 100%;
    }
  }

  @media only screen and (min-width: 601px) {
    & {
      width: 70%;
    }
  }

  @media only screen and (min-width: 1100px) {
    & {
      width: 50%;
    }
  }
`


export default Div
