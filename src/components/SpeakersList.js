import Speaker from './Speaker';
import ReactPlaceHolder from 'react-placeholder';
import useRequestDelay, {REQUEST_STATUS} from '../hooks/useRequestDelay';
import {data} from '../../SpeakerData';
import { SpeakerFilterContext } from '../contexts/SpeakerFilterContext'; 
import { useContext } from 'react';

function SpeakersList() {
    const {
        data: speakersData, 
        requestStatus,
        error,
        updateRecord
    } = useRequestDelay(2000, data );
    
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
                <div className='row'>
                    {
                        speakersData
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
                                    onFavoriteToggle={(doneCallback) => {
                                        updateRecord({
                                            ...speaker,
                                            favorite: !speaker.favorite,
                                        }, doneCallback); 
                                    }} />
                            );
                        })
                    }
                </div>
            </ReactPlaceHolder>
        </div>
    );

}

export default SpeakersList;