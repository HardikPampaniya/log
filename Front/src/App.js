import React, { useState } from 'react';
import axios from 'axios';
import VendorSelector from './components/VendorSelector';
import LogViewer from './components/LogViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [selectedVendor, setSelectedVendor] = useState('');

    const handleSelect = (vendor) => {
        setSelectedVendor(vendor);
    };

    const handleSubmit = () => {
        axios.post('http://localhost:5000/api/files/upload', { vendor: selectedVendor })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error uploading the file!', error);
            });
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <VendorSelector onSelect={handleSelect} />
                    <button className="btn btn-primary mt-3" onClick={handleSubmit}>Submit</button>
                </div>
            </div>
            <div className="mt-5">
                <LogViewer />
            </div>
        </div>
    );
}

export default App;
