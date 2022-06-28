import { useState, useEffect } from 'react';

export const REQUEST_STATUS = {
    LOADING: 'loading',
    SUCCESS: 'success',
    FAILURE: 'failure'
};

function useRequestDelay(delayTime = 1000, initialData = []) {
    const [data, setData] = useState(initialData);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.LOADING);
    const [error, setError] = useState("");
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    //useEffect is a function that runs after the component renders
    useEffect(() => {
        const delayFunc = async () => {
            try {
                await delay(delayTime);
                //throw "had error";
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setData(data);
            } catch (e) {
                setRequestStatus(REQUEST_STATUS.FAILURE);
                setError(e);
            }

        }
        delayFunc();

    }, []);

    function updateRecord(recordUpdated, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.map(function (rec) {
            return rec.id === recordUpdated.id ? recordUpdated : rec;
        });

        const delayFunction = async () => {
            try {
                setData(newRecords);
                await delay(delayTime);
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
        updateRecord
    };
}

export default useRequestDelay;