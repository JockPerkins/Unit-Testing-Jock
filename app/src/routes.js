import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import App from './App';

import Home from './components/Home';

export default (
  <Router>
    <App>
      <Route exact={true} path="/" component={Home} />
    </App>
  </Router>
);
