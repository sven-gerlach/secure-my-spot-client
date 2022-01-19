import styled from "styled-components";
import * as colorThemes from "../../utils/themes/colorThemes"


const DivTableStyled = styled.div`
  background-color: rgba(0,0,0,0.1);
  padding: 10px;
  border-radius: 0.25rem;
`

const TbodyStyled = styled.tbody`
  color: ${colorThemes.blackCoral};
  td:first-child {
    font-weight: bold;
  }
`

export {
  DivTableStyled,
  TbodyStyled,
}
