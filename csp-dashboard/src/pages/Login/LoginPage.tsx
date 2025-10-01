import './Login.css';

import { TapestryButton } from '@avantfinco/tapestry';
import { Logo, Mosaic } from '@avantfinco/tapestry/icons';
import { Agent } from '@avantfinco/tapestry/illustrations';

export function LoginPage() {
  const handleClick = () => {
    window.location.href = 'http://localhost:9292/agent/sign_in';
  };
  return (
    <div className="container">
      <Agent width="100px" className="logo" />
      <Logo width="200px" />
      <hgroup>
        <h1>Avant Customer Service Portal</h1>
        <p>You need to sign in before continuing.</p>
      </hgroup>
      <TapestryButton label="log in with Okta" size="large" onClick={handleClick} />
      <div className="decorations">
        <Mosaic width="400px" />
      </div>
    </div>
  );
}
