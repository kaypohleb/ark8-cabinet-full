import {motion} from 'framer-motion';
import styled from 'styled-components';
export const StyledButton = styled(motion.div)`
  display: inline-block;
  border-radius: 30%;
  padding: 14px 40px;
	border-radius: 50px;
  margin: 0.5rem 1rem;
  width: 20rem;
  background: #DFEE0C;
  color: black;
  cursor: pointer;
  text-align:center;
`
export const StyledMobileButton = styled(motion.div)`
  display: inline-block;
  border-radius: 30%;
  padding: 14px 40px;
	border-radius: 50px;
  margin: 0.5rem 1rem;
  background: #DFEE0C;
  color: black;
  cursor: pointer;
  text-align: center;
`

export const StyledTransparentButton = styled(motion.button)`
  background-color: transparent;
  color:white;
  margin: 0.5rem 1rem;
  width:11rem;
  font: inherit;
  border-radius:8px;
  padding: 1rem 0;
  cursor: pointer;
  border: 1px solid white;
`


