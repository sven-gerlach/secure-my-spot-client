import styled from "styled-components";
import * as colorThemes from "../../../utils/themes/colorThemes"


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

const DivFormsStyled = styled.div`
  margin: 20px 0;
`

const DivButtonsStyled = styled.div`
  display: flex;
  align-content: space-between;
  gap: 20px;
  & button {
    flex: 1 1 0;
  }
`

export {
  TbodyStyled,
  DivTableStyled,
  DivFormsStyled,
  DivButtonsStyled,
}
