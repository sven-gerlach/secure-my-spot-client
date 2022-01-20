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

export {
  FormStyled,
  ButtonStyled,
  H2Styled,
}
