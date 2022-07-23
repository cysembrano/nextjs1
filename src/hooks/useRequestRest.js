import { useState, useEffect } from 'react';
import axios from 'axios';

export const REQUEST_STATUS = {
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILURE: 'failure'
};

const restUrl = 'api/speakers';

function useRequestRest() {
    const [data, setData] = useState([]);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState("");
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    //useEffect is a function that runs after the component renders
    useEffect(() => {
        const delayFunc = async () => {
            try {
                const result = await axios.get(restUrl);
                //throw "had error";
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setData(result.data);
            } catch (e) {
                setRequestStatus(REQUEST_STATUS.FAILURE);
                setError(e);
            }

        }
        delayFunc();

    }, []);

    function updateRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.map(function (rec) {
            return rec.id ===   record.id ? record : rec;
        });

        const delayFunction = async () => {
            try {
                setData(newRecords);
                await axios.put(`${restUrl}/${record.id}`,record);
                if (doneCallback) {
                    doneCallback();
                }

            } catch (e) {
                console.error("error thrown in delayFunction", e);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        };
        delayFunction();
    }

    function insertRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = [record, ...data];

        const delayFunction = async () => {
            try {
                setData(newRecords);
                await axios.post(`${restUrl}/99999`,record);
                if (doneCallback) {
                    doneCallback();
                }

            } catch (e) {
                console.error("error thrown in delayFunction", e);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        };
        delayFunction();
    }

    function deleteRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.filter((rec) => {
            return rec.id != record.id;
        });

        const delayFunction = async () => {
            try {
                setData(newRecords);
                await axios.delete(`${restUrl}/${record.id}`,record);
                if (doneCallback) {
                    doneCallback();
                }

            } catch (e) {
                console.error("error thrown in delayFunction", e);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        };
        delayFunction();
    }

    return {
        data,
        requestStatus,
        error,
        updateRecord,
        insertRecord,
        deleteRecord
    };
}

export default useRequestRest;