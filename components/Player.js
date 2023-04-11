import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import { isPlayingState, currentTrackIdState } from '../atoms/songAtom';
import useSongInfo from '../hooks/useSongInfo';
import useSpotify from '../hooks/useSpotify'
import { ArrowLongLeftIcon, ArrowLongRightIcon, PauseIcon, PlayIcon, SpeakerWaveIcon } from '@heroicons/react/24/outline';
import { debounce } from 'lodash';


function Player() {

    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(isPlayingState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now playoing", data.body?.item);
                setCurrentIdTrack(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    };

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false)
            }else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }

    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackId, spotifyApi, session]);


    useEffect(() => {
        if(volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500, [])
    );

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-900 text-white text-xs md:text-base flex justify-around border-solid border-red-600 border-4'>
        <div className='flex items-center space-x-4 border-solid border-red-600 border-4'>
            <img className = 'hidden md:inline h-10 w-10' src={songInfo?.album.images?.[0]?.url} alt='' />

            </div>
                <h3>{songInfo?.name}</h3>
                <p>{songInfo?.artists?.[0]?.name}</p>
            <div>
        </div>


        <div className='flex items-center border-solid border-red-600 border-4'>
            <ArrowLongLeftIcon className='button'/>

            {isPlaying ? (
                <PauseIcon onClick={handlePlayPause} className='w-7 h-7'/>
            ): (
                <PlayIcon onClick={handlePlayPause} className='w-7 h-7'/>
            )}

            <ArrowLongRightIcon className='button'/>
        </div>

        <div className='flex items-center md:space-x-4 border-solid border-red-600 border-4'>
            <SpeakerWaveIcon className='button'/>
            <input className = 'w-14 md:w-28' type="range" value={volume} min={0} max={100} onChange={e => setVolume(Number(e.target.value))}/>
        </div>
    </div>
  );
}

export default Player

// grid grid-cols-3