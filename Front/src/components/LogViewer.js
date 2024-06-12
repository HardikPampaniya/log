import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io('http://localhost:5000');

const LogViewer = () => {
    const [logs, setLogs] = useState({});
    const [viewingVendor, setViewingVendor] = useState(null);
    const [activeLog, setActiveLog] = useState('ongoing');

    useEffect(() => {
        const fetchLogsFromStorage = () => {
            const storedLogs = localStorage.getItem('logs');
            if (storedLogs) {
                setLogs(JSON.parse(storedLogs));
            }
        };

        socket.on('initialLogs', (initialLogs) => {
            setLogs(initialLogs);
        });

        socket.on('log', (message) => {
            setLogs((prevLogs) => {
                const newLogs = { ...prevLogs };

                if (!newLogs[message.vendor]) {
                    newLogs[message.vendor] = { success: [], failure: [], ongoing: [], update: [] };
                }

                const vendorLogs = newLogs[message.vendor];

                const updateLogs = (statusArray, message) => {
                    if (message.data && message.data.product_id) {
                        const existingLogIndex = statusArray.findIndex(log => log.data && log.data.product_id === message.data.product_id);
                        if (existingLogIndex === -1) {
                            statusArray.push(message);
                        } else {
                            statusArray[existingLogIndex] = message;
                        }
                    }
                };

                if (message.status === 'ongoing') {
                    updateLogs(vendorLogs.ongoing, message);
                } else if (message.status === 'success') {
                    updateLogs(vendorLogs.success, message);
                    vendorLogs.ongoing = vendorLogs.ongoing.filter(log => log.data.product_id !== message.data.product_id);
                } else if (message.status === 'update') {
                    updateLogs(vendorLogs.update, message);
                    vendorLogs.ongoing = vendorLogs.ongoing.filter(log => log.data.product_id !== message.data.product_id);
                } else if (message.status === 'failure' || message.status === 'skip') {
                    updateLogs(vendorLogs.failure, message);
                    vendorLogs.ongoing = vendorLogs.ongoing.filter(log => log.data.product_id !== message.data.product_id);
                }

                localStorage.setItem('logs', JSON.stringify(newLogs));
                return newLogs;
            });
        });

        fetchLogsFromStorage();

        return () => {
            socket.off('log');
            socket.off('initialLogs');
        };
    }, []);

    const renderLogs = (vendorLogs) => {
        let logList = [];
        if (activeLog === 'success') {
            logList = vendorLogs.ongoing;
        } else if (activeLog === 'failure') {
            logList = vendorLogs.failure;
        } else if (activeLog === 'ongoing') {
            logList = vendorLogs.success;
        }

        return logList.map((log, index) => (
            <div key={index} className="card mb-3">
                <div className="card-body">
                    {log.vendor && log.data && log.data.product_name && log.status && log.timestamp &&
                        `${log.vendor} - ${log.data.product_name} - ${log.status} - ${new Date(log.timestamp).toLocaleString()} ${log.message ? '- ' + log.message : ''}`}
                    {log.error && <div className="text-danger">Error: {log.error}</div>}
                </div>
            </div>
        ));
    };

    const renderVendorButtons = () => {
        return Object.keys(logs).map((vendor) => (
            <div key={vendor} className="mb-2">
                <button className="btn btn-outline-primary" onClick={() => setViewingVendor(vendor)}>{vendor}</button>
            </div>
        ));
    };

    return (
        <div className="container">
            <div className="btn-group mb-3" role="group" aria-label="Log status">
                <button className="btn btn-secondary" onClick={() => setActiveLog('ongoing')}>Ongoing</button>
                <button className="btn btn-secondary" onClick={() => setActiveLog('failure')}>Failure</button>
                <button className="btn btn-secondary" onClick={() => setActiveLog('success')}>Success</button>
            </div>
            <div>{renderVendorButtons()}</div>
            {viewingVendor && logs[viewingVendor] && (
                <div>
                    <h3>Logs for {viewingVendor}</h3>
                    {renderLogs(logs[viewingVendor])}
                </div>
            )}
        </div>
    );
};

export default LogViewer;
