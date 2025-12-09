import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Career Compass</h1>
      <p>Your AI-powered job & career assistant.</p>
      <Link to='/login'>Login</Link> | <Link to='/register'>Register</Link>
    </div>
  );
}
