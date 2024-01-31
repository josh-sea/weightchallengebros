import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home'); // Navigate to the Home component on successful login
        } catch (error) {
            setError(error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450, padding:50 }}>
                <Header as='h2' color='pink' textAlign='center'>
                    Login Mother Fuckers
                </Header>
                <Form size='large' onSubmit={handleLogin} error={!!error}>
                    <Segment stacked>
                        <Form.Input 
                            fluid 
                            icon='user' 
                            placeholder='E-mail address' 
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                        <Form.Input
                            fluid
                            icon={
                                <Icon 
                                    name={showPassword ? 'unlock' : 'lock'} 
                                    link 
                                    onClick={togglePasswordVisibility} 
                                />
                            }
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button color='pink' fluid size='large' type='submit'>
                            Login
                        </Button>
                        {error && <Message error header='Login Failed' content={error} />}
                    </Segment>
                </Form>
                <Segment basic>
                <Button color='pink' size='small' onClick={()=>navigate('/signup')}>
                            signup
                </Button>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default Login;
