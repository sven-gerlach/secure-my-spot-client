import styled from "styled-components";


const DivStyled = styled.div`
  display: flex;
  align-content: space-between;
  gap: 20px;
  margin: 10px 0;
  
  button {
    flex: 1 1 0;
  }
`

const ContainerDiv = styled.div`
  background-color: rgba(0,0,0,0.1);
  padding: 10px;
  border-radius: 0.25rem;
  margin: 20px 0;
`

export {
  DivStyled,
  ContainerDiv
}
