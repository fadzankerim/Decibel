
export interface Song{
    _id: string;
    title: string;
    artist: string;
    albumId: string | null;
    imageUrl: string;
    audioUrl: string;
    duration: number;
    createdAt: String;
    updatedAt: String;
}

export interface Album{
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    releaseYear: number;
    songs: Song[];
}

export interface Stats{
    totalSongs: number;
    totalUsers: number;
    totalAlbums: number;
    uniqueArtists: number;
}

export interface Message{
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface User{
    _id: string;
    fullName: string;
    imageUrl: string;
    clerkId: string;
}