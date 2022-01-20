import styled from "styled-components";
import { Spinner } from "react-bootstrap";

const MapDiv = styled.div`
  width: 100%;
  height: 70%;
  border-radius: 0.25rem;
`

const SpinnerStyled = styled(Spinner)`
  position: absolute;
  top: 47vh;
  left: 45vw;
  z-index: 2000;
`

export {
  MapDiv,
  SpinnerStyled,
}
