import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const VendorSelector = ({ onSelect }) => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/files/vendors')
            .then(response => {
                setVendors(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the vendors!', error);
            });
    }, []);

    return (
        <div>
            <select className="form-select" onChange={(e) => onSelect(e.target.value)}>
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                ))}
            </select>
        </div>
    );
};

export default VendorSelector;
