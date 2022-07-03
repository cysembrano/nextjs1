import { useContext } from 'react';
import { SpeakerContext } from '../contexts/SpeakerContext';

function SpeakerDelete(){
    const { speaker, deleteRecord } = useContext(SpeakerContext);
    return (
        <a href='#' className='remSes'>
            <i onClick={(e)=>{
                e.preventDefault();
                if(window.confirm('wanna delete?')){
                    deleteRecord(speaker);
                }
            }}>
            -
            </i>
        </a>
    );
}

export default SpeakerDelete;