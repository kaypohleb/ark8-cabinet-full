import {motion} from 'framer-motion';
import styled from 'styled-components';
export const StyledButton = styled(motion.div)`
  display: inline-block;
  border-radius: 3px;
  padding: 1rem 0;
  margin: 0.5rem 1rem;
  width: 11rem;
  background: white;
  color: black;
  cursor: pointer;
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


