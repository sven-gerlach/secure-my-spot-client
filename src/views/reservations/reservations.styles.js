import styled from "styled-components";
import { Button, Form } from "react-bootstrap";
import * as colorThemes from "../../utils/themes/colorThemes"


const FormStyled = styled(Form)`
  margin-top: 20px;
`

const ButtonStyled = styled(Button)`
  margin-top: 20px;
  min-width: 100px;
`

const H2Styled = styled.h2`
  margin-top: 30px;
  color: ${colorThemes.blackCoral};
`

const H3Styled = styled.h3`
  margin-top: 30px;
`

const DivStyled = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 30px;
  
  button {
    flex: 1 1 0;
  }
`

export {
  FormStyled,
  ButtonStyled,
  H2Styled,
  H3Styled,
  DivStyled,
}
