import Speaker from './Speaker';
import ReactPlaceHolder from 'react-placeholder';
import { SpeakerFilterContext } from '../contexts/SpeakerFilterContext'; 
import { useContext } from 'react';
import SpeakerAdd from './SpeakerAdd';
import useRequestRest, {REQUEST_STATUS} from '../hooks/useRequestRest';

function SpeakersList() {
    const {
        data, 
        requestStatus,
        error,
        updateRecord,
        insertRecord,
        deleteRecord
    } = useRequestRest();
    
    const { searchQuery, eventYear } = useContext(SpeakerFilterContext);

    if (requestStatus === REQUEST_STATUS.FAILURE) {
        return (
            <div className='text-danger'>
                ERROR: <b>loading speaker data: {error}</b>
            </div>
        );
    }

    //if (isLoading === true) return <div>Loading...</div>;

    return (
        <div className='container speakers-list'>
            <ReactPlaceHolder
                type="media"
                rows={15}
                className='speakersList-placeholder'
                ready={requestStatus === REQUEST_STATUS.SUCCESS}
            >
                <SpeakerAdd eventYear={eventYear} insertRecord={insertRecord} />
                <div className='row'>
                    {
                        data
                        .filter((speaker) => {
                            return(
                                speaker.last.toLowerCase().includes(searchQuery) ||
                                speaker.first.toLowerCase().includes(searchQuery)
                            );
                        })
                        .filter((speaker) => {
                            return speaker.sessions.find((session) => {
                                return session.eventYear == eventYear        
                            });
                        })
                        .map((speaker) => {
                            return (
                                <Speaker key={speaker.id} speaker={speaker} 
                                updateRecord={updateRecord}
                                insertRecord={insertRecord}
                                deleteRecord={deleteRecord}/>
                            );
                        })
                    }
                </div>
            </ReactPlaceHolder>
        </div>
    );

}

export default SpeakersList;