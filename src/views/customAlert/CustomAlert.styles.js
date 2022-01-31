import styled from "styled-components";
import { Alert } from "react-bootstrap";


const AlertStyled = styled(Alert)`
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  margin-bottom: 0;
`

export {
  AlertStyled
}
