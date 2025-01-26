import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UserProfilePage } from './UserProfilePage';
import { MemoryRouter } from 'react-router-dom';

describe('UserProfilePage', () => {
    beforeEach(() => {
        // Mock fetch global to simulate API calls
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders loading spinner initially', () => {
        (fetch as jest.Mock).mockImplementation(() =>
            new Promise(() => { }) // Simulate pending fetch
        );

        render(
            <MemoryRouter>
                <UserProfilePage />
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renders user profile form after fetching data', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                username: 'testuser',
                email: 'test@example.com',
            }),
        });

        render(
            <MemoryRouter>
                <UserProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('Username')).toHaveValue('testuser');
            expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
        });
    });

    test('shows error message when API fetch fails', async () => {
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch user data'));

        render(
            <MemoryRouter>
                <UserProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('An error occurred while fetching user data.')).toBeInTheDocument();
        });
    });

    test('updates form data and submits successfully', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    username: 'testuser',
                    email: 'test@example.com',
                }),
            })
            .mockResolvedValueOnce({
                ok: true,
            });

        render(
            <MemoryRouter>
                <UserProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('Username')).toHaveValue('testuser');
        });

        // Update form fields
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'currentpass' } });
        fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'newpass' } });

        expect(screen.getByLabelText('Username')).toHaveValue('newuser');
        expect(screen.getByLabelText('Email')).toHaveValue('new@example.com');

        // Submit the form
        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(screen.getByText('User data updated successfully!')).toBeInTheDocument();
        });
    });

    test('shows error message on failed update', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    username: 'testuser',
                    email: 'test@example.com',
                }),
            })
            .mockRejectedValueOnce(new Error('Failed to update user data'));

        render(
            <MemoryRouter>
                <UserProfilePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('Username')).toHaveValue('testuser');
        });

        // Update form fields
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
        fireEvent.click(screen.getByText('Save Changes'));

        await waitFor(() => {
            expect(screen.getByText('An error occurred while updating user data.')).toBeInTheDocument();
        });
    });

    test('logs out user when Logout button is clicked', () => {
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
        const navigateMock = jest.fn();

        jest.mock('react-router-dom', () => ({
            ...jest.requireActual('react-router-dom'),
            useNavigate: () => navigateMock,
        }));

        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                username: 'testuser',
                email: 'test@example.com',
            }),
        });

        render(
            <MemoryRouter>
                <UserProfilePage />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Logout'));

        expect(removeItemSpy).toHaveBeenCalledWith('authToken');
        expect(navigateMock).toHaveBeenCalledWith('/login');
    });
});
