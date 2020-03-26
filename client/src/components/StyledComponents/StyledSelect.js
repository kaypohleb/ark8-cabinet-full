import styled from 'styled-components';
export const StyledSelect = styled.select`
  height: 35px;
  background: #1d1d1d;
  color: gray;
  padding-left: 5px;
  font-size: 14px;
  border: none;
  margin-left: 10px;
  &:focus{
    border-color: gray;
    outline:none;
}
  option {
    color: white;
    background: #1d1d1d;
    display: flex;
    white-space: pre;
    min-height: 20px;
    padding: 0px 2px 1px;
  }
`;

