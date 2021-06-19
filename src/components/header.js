import React from 'react';

import { connect } from 'react-redux';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            online: false
        }
    }

    componentDidMount() {
        if (navigator.onLine) {
            this.setState({online: true});
        } else {
            this.setState({online: false});
        }
        window.addEventListener('offline', () => this.setState({ online: false }));
        window.addEventListener('online', () => this.setState({ online: true }));
    }

    SignOut = () => {
        return (
            this.props.auth.currentUser && <button className="auth-button" onClick={() => this.props.auth.signOut()}>Sign Out</button>
        );
    };

    render() {
        return <React.Fragment>
            <header className="chatroom">
                <div>
                    🍀Dhaniya Chat
                    <span className={this.state.online ? "network-indicator online" : "network-indicator offline"}></span>
                </div>
                {this.props.children}
            </header>
        </React.Fragment>
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return state;
}

export default connect(mapStateToProps)(Header);
