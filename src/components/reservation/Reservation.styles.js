import styled from "styled-components";
import * as colorThemes from "../../utils/themes/colorThemes"


const DivTableStyled = styled.div`
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
