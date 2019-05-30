import React from 'react';


class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false,
            loading: false,
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ submitted: true });
        const { username, password } = this.state;
        if(password === 'test' && username === 'test') {
            let path = `/main`;
            this.props.history.push(path);
        } else {
            this.setState({error: 'Invalid username or password'});
        }
    }

    render() {
        const { username, password, submitted, loading, error } = this.state;
        return (
            <div className="container login">
                <div className="col-md-6 offset-3 login-form">
                    <h1 className="pt-3 pb-3">Login</h1>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                            <label htmlFor="username">Username</label>
                            <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                            {submitted && !username &&
                            <div className="help-block">Username is required</div>
                            }
                        </div>
                        <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                            {submitted && !password &&
                            <div className="help-block">Password is required</div>
                            }
                        </div>
                        <div className="form-group">
                            <button className="btn btn-secondary mt-3" disabled={loading}>Login</button>
                            {loading}
                        </div>
                        {error &&
                        <div className={'alert alert-danger'}>{error}</div>
                        }
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
