import React, { useEffect, useState } from 'react'
import {ArrowLeftOnRectangleIcon, HeartIcon, HomeIcon, PlusCircleIcon, RssIcon} from '@heroicons/react/24/outline';
import {MagnifyingGlassIcon} from '@heroicons/react/24/outline';
import {BuildingLibraryIcon} from '@heroicons/react/24/outline';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilState } from 'recoil';
import { playListIdState } from '../atoms/playlistAtoms';


export default function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlayLists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playListIdState);

    console.log(`Current Playlist ${playlistId}`);

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlayLists(data.body.items);
            })
        }
    }, [session, spotifyApi]);
    
  return (
    <div className='text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide text-xs lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'>
        <div className='space-y-4'>
            <button className='flex items-center space-x-2 hover:text-white' onClick={() => signOut()}>
                <ArrowLeftOnRectangleIcon className='w-5 h-5'/>
                <p>Logout</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <HomeIcon className='w-5 h-5'/>
                <p>Home</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <MagnifyingGlassIcon className='w-5 h-5'/>
                <p>Search</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <BuildingLibraryIcon className='w-5 h-5'/>
                <p>Your Library</p>
            </button>
            <hr className='border-t-[0.1px] border-gray-900'/>


            <button className='flex items-center space-x-2 hover:text-white'>
                <PlusCircleIcon className='w-5 h-5'/>
                <p>Create Playlist</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <RssIcon className='w-5 h-5'/>
                <p>Your Episodes</p>
            </button>
            <button className='flex items-center space-x-2 hover:text-white'>
                <HeartIcon className='w-5 h-5'/>
                <p>Liked Songs</p>
            </button>
            
            <hr className='border-t-[0.1px] border-gray-900'/>

            {/* Playlists */}
            {playlists.map((playlist) => (
                <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white'>{playlist.name}</p>
            ))}

        </div>
    </div>
  );
}

