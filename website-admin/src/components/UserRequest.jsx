import React from 'react';

const UserRequest = () => {
    const handleApprove = (id) => {
        console.log(`Approved request with ID: ${id}`);
    };

    const handleReject = (id) => {
        console.log(`Rejected request with ID: ${id}`);
    };

    const sampleRequests = [
        { id: 1, name: 'John Doe', request: 'Request to update profile' },
        { id: 2, name: 'Jane Smith', request: 'Request to delete account' },
    ];

    return (
        <div>
            <h1>User Requests</h1>
            <ul>
                {sampleRequests.map((request) => (
                    <li key={request.id}>
                        <p>
                            <strong>{request.name}</strong>: {request.request}
                        </p>
                        <button onClick={() => handleApprove(request.id)}>Approve</button>
                        <button onClick={() => handleReject(request.id)}>Reject</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserRequest;