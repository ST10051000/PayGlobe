import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Link } from "react-router-dom";



const Dashboard = () => {
    const [customerName, setCustomerName] = useState('');
    const [accountDetails, setAccountDetails] = useState({ accountNumber: '', availableBalance: 0 });
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        // Fetch user data after login
        const fetchUserData = async () => {
            try {
                const res = await axios.get('http://localhost:4000/dashboard'); // Backend endpoint to fetch user details
                setCustomerName(res.data.name);
                setAccountDetails(res.data.bankDetails);
                setTransactions(res.data.transactions);
            } catch (err) {
                console.error('Error fetching data', err);
            }
        };

        fetchUserData();
    }, []);

    const maskAccountNumber = (accountNumber) => {
        return accountNumber.replace(/\d(?=\d{4})/g, "X"); // Mask all but the last 4 digits
    };

    const handlePayAgain = (transactionId) => {
        // Call backend to re-initiate the payment
        axios.post(`http://localhost:4000/pay-again`, { transactionId })
            .then(response => {
                alert("Payment successful");
            })
            .catch(err => {
                console.error('Payment error', err);
            });
    };

    return (
        <div className="dashboard">
            <div className="side-nav">
                <h3>Menu</h3>
                <ul>
                    <li><a href="/transactions">Transactions</a></li>
                    <li><a href="/payments">Payments</a></li>
                </ul>
            </div>
            
            <div className="content">
                <h1>Customer Dashboard</h1>
                <p>Hello, {customerName}</p>

                <div className="banking-details">
                    <h2>Banking Details</h2>
                    <p>Account No: {maskAccountNumber(accountDetails.accountNumber)}</p>
                    <p>Available Balance: ${accountDetails.availableBalance}</p>
                </div>

                <div className="transactions">
                    <h2>Payment Receipts</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{transaction.date}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.amount}</td>
                                    <td>
                                        <button onClick={() => handlePayAgain(transaction.id)}>Pay Again</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
