import styled from "styled-components";

// import themes
import * as colorThemes from "../../utils/themes/colorThemes"

const Div = styled.div`
  background-color: rgba(0,0,0,0.1);
  padding: 10px;
  border-radius: 0.25rem;
  p {
    color: ${colorThemes.blackCoral};
  }
`

const P = styled.p`
  color: ${colorThemes.ghostWhite}
`

export {
  Div,
  P
}
