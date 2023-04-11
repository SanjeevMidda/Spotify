import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react'
import React, { useState, useEffect } from 'react'
import { shuffle } from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playListIdState, playlistState } from '../atoms/playlistAtoms';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import Song from './Song';

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]

function Center() {

  const { data: session } = useSession();   
  const [color,setColor] = useState(null);
  const playlistId = useRecoilValue(playListIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
            setPlaylist(data.body);
    })
    .catch(error => console.log("Something went wrong", error));
  }, [spotifyApi, playlistId]);

  console.log(playlist);

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
        <header className='absolute top-5 right-8'>
            <div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 bg-black text-white'>
                <img className = 'rounded-full w-10 h-10' src={session?.user.image} alt=''></img>
                <h2>{session?.user.name}</h2>
                <ChevronDoubleDownIcon />
            </div>
        </header>

        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className = 'h-44 w-44 shadow-2xl' src={playlist?.images?.[0].url} alt="image" />
            <div>
                <p>PLAYLIST</p>
                <h1 className='text-2xl md:text-3xl xl:text-5xl'>{playlist?.name}</h1>
            </div>
        </section>

        <div>
            <Songs />
        </div>
    </div>
  );
}

export default Center