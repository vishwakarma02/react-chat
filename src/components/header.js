import React from 'react';

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
        return <>
            <header className="chatroom">
                <div>
                    🍀Dhaniya Chat
                    <span className={this.state.online ? "network-indicator online" : "network-indicator offline"}></span>
                </div>
                {this.props.children}
            </header>
        </>
    }
}

export default Header;