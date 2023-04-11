import React from 'react'
import { playlistState } from '../atoms/playlistAtoms'
import { useRecoilValue } from 'recoil';
import Song from './Song';

function Songs() {

    const playlist = useRecoilValue(playlistState);

  return (
    <div className='text-white px-8 flex flex-col space-y-1 pb-28 text-sm'>
        {playlist?.tracks.items.map((track, i) => (
            <Song key={track.track.id} track={track} order={i}/>
        ))}
    </div>
  )
}

export default Songs