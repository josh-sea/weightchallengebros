import React, { useState } from 'react';
import { Form, Button, Message, FormGroup, FormField, FormButton, Input, Segment } from 'semantic-ui-react';
import { ref, update } from 'firebase/database';
import { auth, database } from '../admin/auth';

const WeightSubmission = () => {
    const [weight, setWeight] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateWeight = (weight) => {
        return !isNaN(weight) && weight > 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateWeight(weight)) {
            setError('Please enter a valid weight as a decimal number.');
            return;
        }

        const currentUser = auth.currentUser;
        if (currentUser) {
            const weightsRef = ref(database, `users/${currentUser.uid}/weights`);
            const newWeightEntry = {};
            newWeightEntry[Date.now()] = parseFloat(weight);
            update(weightsRef, newWeightEntry)
                .then(() => {
                    setWeight('');
                    setSuccess(true);
                })
                .catch((error) => {
                    setError(error.message);
                });
        } else {
            setError('No authenticated user found.');
        }
    };

    return (

        <Form onSubmit={handleSubmit} success={success} error={!!error}>
            {success && <Message success header="Success" content="Weight recorded successfully." />}
            {error && <Message error header="Error" content={error} />}
            <FormGroup>
                <FormField
                    type="text"
                    placeholder="Enter Weight (e.g., 190)"
                    control={Input}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />
                <FormButton type="submit">Submit Weight</FormButton>
            </FormGroup>
        </Form>

    );
};

export default WeightSubmission;
