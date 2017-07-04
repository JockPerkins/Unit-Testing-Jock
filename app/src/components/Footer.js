import React from 'react';
import FooterStore from '../stores/FooterStore';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = FooterStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    FooterStore.listen(this.onChange);
  }

  componentWillUnmount() {
    FooterStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }


  render() {
    return (
      <div id="footer">
        <div className="container">
          <ul className="footer-menu">
            <li>Social Link</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Footer;
