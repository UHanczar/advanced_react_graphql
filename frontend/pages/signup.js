import SignupUser from '../components/SignupUser';
import SigninUser from '../components/SigninUser';
import styled from 'styled-components';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const Signup = props => (
  <Columns>
    <SignupUser />
    <SigninUser />
  </Columns>
);

export default Signup;
