const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const db = require('../db');

const getVendorFiles = (req, res) => {
    const vendorDirs = fs.readdirSync(path.join(__dirname, '../logs'));
    res.json(vendorDirs);
};

const uploadVendorFile = (req, res) => {
    const vendor = req.body.vendor;
    const vendorDir = path.join(__dirname, `../logs/${vendor}`);

    try {
        const files = fs.readdirSync(vendorDir);
        const excelFile = files.find(file => file.endsWith('.xlsx'));

        if (!excelFile) {
            return res.status(400).json({ error: 'No Excel file found in vendor directory.' });
        }

        const filePath = path.join(vendorDir, excelFile);
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        let index = 0;
        let successCount = 0;
        let failureCount = 0;
        let updateCount = 0;
        let skipCount = 0;

        const processRow = () => {
            if (index < data.length) {
                const row = data[index];
                const standardizedRow = {
                    product_id: row['Product ID'] || row['product_id'] || null,
                    product_name: row['Product Name'] || row['product_name'] || null,
                    quantity: row['Quantity'] || row['quantity'] || null,
                    price: row['Price'] || row['price'] || null
                };

                if (!standardizedRow.product_id || !standardizedRow.product_name || !standardizedRow.quantity || !standardizedRow.price) {
                    const log = { vendor, status: 'failure', data: standardizedRow, error: 'Missing data in one or more fields', timestamp: new Date() };
                    req.io.emit('log', log);
                    failureCount++;
                } else {
                    const ongoingLog = { vendor, status: 'ongoing', data: standardizedRow, timestamp: new Date() };
                    req.io.emit('log', ongoingLog);

                    db.query('SELECT * FROM products WHERE product_id = ?', [standardizedRow.product_id], (err, results) => {
                        if (err) {
                            const log = { vendor, status: 'failure', data: standardizedRow, error: err.message, timestamp: new Date() };
                            req.io.emit('log', log);
                            failureCount++;
                        } else if (results.length > 0) {
                            const existingRecord = results[0];
                            if (existingRecord.product_name === standardizedRow.product_name &&
                                existingRecord.quantity === standardizedRow.quantity &&
                                existingRecord.price === standardizedRow.price) {
                                const log = { vendor, status: 'skip', data: standardizedRow, error: 'Data already exists and is unchanged', timestamp: new Date() };
                                req.io.emit('log', log);
                            } else {
                                db.query('UPDATE products SET product_name = ?, quantity = ?, price = ? WHERE product_id = ?', [standardizedRow.product_name, standardizedRow.quantity, standardizedRow.price, standardizedRow.product_id], (err, result) => {
                                    if (err) {
                                        const log = { vendor, status: 'failure', data: standardizedRow, error: err.message, timestamp: new Date() };
                                        req.io.emit('log', log);
                                        failureCount++;
                                    } else {
                                        const successLog = { vendor, status: 'update', data: standardizedRow, message: 'Record updated', timestamp: new Date() };
                                        req.io.emit('log', successLog);
                                        updateCount++;
                                    }
                                });
                            }
                        } else {
                            db.query('INSERT INTO products (product_id, product_name, quantity, price) VALUES (?, ?, ?, ?)', [standardizedRow.product_id, standardizedRow.product_name, standardizedRow.quantity, standardizedRow.price], (err, result) => {
                                if (err) {
                                    const log = { vendor, status: 'failure', data: standardizedRow, error: err.message, timestamp: new Date() };
                                    req.io.emit('log', log);
                                    failureCount++;
                                } else {
                                    const successLog = { vendor, status: 'success', data: standardizedRow, timestamp: new Date() };
                                    req.io.emit('log', successLog);
                                    successCount++;
                                }
                            });
                        }
                    });
                }
                index++;
                setTimeout(processRow, 500);
            } else {
                const successLog = {
                    vendor,
                    status: 'success',
                    message: `${vendor} data successfully submitted. ${successCount} rows inserted, ${updateCount} rows updated, ${skipCount} rows skipped.`,
                    timestamp: new Date()
                };
                req.io.emit('log', successLog);
                res.json({ message: 'File processing completed' });
            }
        };

        processRow();

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while uploading the file.' });
    }
};


module.exports = {
    getVendorFiles,
    uploadVendorFile
};
