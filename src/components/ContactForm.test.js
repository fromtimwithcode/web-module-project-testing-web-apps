import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);

    const contactHeader = screen.getByText(/contact form/i);

    expect(contactHeader).toBeInTheDocument();
    expect(contactHeader).toBeTruthy();
    expect(contactHeader).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstname = screen.getByLabelText(/first name*/i);
    userEvent.type(firstname, 'abcd');

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render (<ContactForm/>);

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render (<ContactForm/>);

    const firstname = screen.getByLabelText(/first name*/i);
    userEvent.type(firstname, 'timothy');

    const lastname = screen.getByLabelText(/last name*/i);
    userEvent.type(lastname, 'marchant');

    const button = screen.getByRole('button');
    userEvent.click(button);

    const error = await screen.getAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, "fromtimwithcode@gmail");

    const error = await screen.findByText(/email must be a valid email address/i);
    expect(error).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    const error = await screen.findByText(/lastName is a required field/i);
    expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>);

    const firstname = screen.getByLabelText(/first name*/i);
    userEvent.type(firstname, 'timothy');

    const lastname = screen.getByLabelText(/last name*/i);
    userEvent.type(lastname, 'marchant');

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, 'fromtimwithcode@gmail.com');

    const submitBtn = screen.getByRole('button');
    userEvent.click(submitBtn);

    await waitFor(() => {
        const first = screen.queryByText(/timothy/i);
        const last = screen.queryByText(/marchant/i);
        const mail = screen.queryByText(/fromtimwithcode@gmail.com/i);
        const mess = screen.queryByTestId('messageDisplay');

        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(mail).toBeInTheDocument();
        expect(mess).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstname = screen.getByLabelText(/first name*/i);
    userEvent.type(firstname, 'timothy');

    const lastname = screen.getByLabelText(/last name*/i);
    userEvent.type(lastname, 'marchant');

    const email = screen.getByLabelText(/email*/i);
    userEvent.type(email, 'fromtimwithcode@gmail.com');

    const message = screen.getByLabelText(/message/i);
    userEvent.type(message, 'message');

    const submitBtn = await screen.findByRole('button');
    userEvent.click(submitBtn);

    await waitFor(() => {
        const first = screen.queryByText(/timothy/i);
        const last = screen.queryByText(/marchant/i);
        const mail = screen.queryByText(/fromtimwithcode@gmail.com/i);
        const mess = screen.queryByTestId(/message/i);

        expect(first).toBeInTheDocument();
        expect(last).toBeInTheDocument();
        expect(mail).toBeInTheDocument();
        expect(mess).toBeInTheDocument();
    });
});