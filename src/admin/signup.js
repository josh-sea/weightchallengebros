import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Icon, Message, Segment } from 'semantic-ui-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database} from './auth';
import { set, ref } from 'firebase/database';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Create a new user entry in Firebase Realtime Database
            set(ref(database, `users/${user.uid}`), {
                email: user.email,
                name,
                metadata: user.metadata
                // Additional user data can be set here
            });
            navigate('/home', { state: { userEmail: user.email } }); // Navigate to the Home component with email as a prop
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
                    Sign Up
                </Header>
                <Form size='large' onSubmit={handleSignUp} error={!!error}>
                    <Segment stacked>
                        <Form.Input 
                            fluid 
                            icon='user' 
                            placeholder='Name' 
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required 
                        />
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
                            Sign Up
                        </Button>
                        {error && <Message error header='Signup Failed' content={error} />}
                    </Segment>
                </Form>
                <Segment basic>
                <Button color='pink' size='small' onClick={()=>navigate('/login')}>
                            login
                </Button>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default SignUp;
