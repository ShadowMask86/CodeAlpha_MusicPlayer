// Music Player State
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let currentVolume = 0.7;
let isMuted = false;

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressDot = document.getElementById('progressDot');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const volumeProgress = document.getElementById('volumeProgress');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumImage = document.getElementById('albumImage');
const albumArt = document.getElementById('albumArt');
const playlist = document.getElementById('playlist');
const playlistPanel = document.getElementById('playlistPanel');
const playlistToggle = document.getElementById('playlistToggle');
const closePlaylist = document.getElementById('closePlaylist');
const clearPlaylist = document.getElementById('clearPlaylist');
const fileInput = document.getElementById('fileInput');
const equalizer = document.getElementById('equalizer');

// Sample Songs Database (You can replace with your own)
let songs = [
    {
        title: "Chill Vibes",
        artist: "Demo Artist 1",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Replace with your audio files
        cover: "https://via.placeholder.com/300x300/ff6b6b/ffffff?text=♪+1"
    },
    {
        title: "Summer Beats",
        artist: "Demo Artist 2", 
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Replace with your audio files
        cover: "https://via.placeholder.com/300x300/4ecdc4/ffffff?text=♪+2"
    },
    {
        title: "Night Dreams",
        artist: "Demo Artist 3",
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Replace with your audio files
        cover: "https://via.placeholder.com/300x300/45b7d1/ffffff?text=♪+3"
    }
];

// Initialize Music Player
function initializePlayer() {
    loadSong(currentSongIndex);
    updatePlaylist();
    updateVolumeDisplay();
    audioPlayer.volume = currentVolume;
    
    console.log('🎵 Music Player initialized!');
}

// 1. SONG LOADING AND INFO UPDATE
function loadSong(index) {
    if (index < 0 || index >= songs.length) return;
    
    const song = songs[index];
    currentSongIndex = index;
    
    // Update audio source
    audioPlayer.src = song.src;
    
    // Update display info
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumImage.src = song.cover;
    
    // Reset progress
    progressBar.style.width = '0%';
    progressDot.style.left = '0%';
    currentTimeSpan.textContent = '0:00';
    
    // Update playlist active state
    updatePlaylistActiveState();
    
    // Reset album art rotation
    albumArt.classList.remove('playing');
}

// 2. PLAY/PAUSE FUNCTIONALITY
function togglePlayPause() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    audioPlayer.play().then(() => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        albumArt.classList.add('playing');
        equalizer.classList.add('active');
    }).catch(error => {
        console.error('Error playing audio:', error);
        showNotification('Error playing audio');
    });
}

function pauseMusic() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    albumArt.classList.remove('playing');
    equalizer.classList.remove('active');
}

// 3. NAVIGATION CONTROLS
function previousSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playMusic();
}

function nextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    }
    loadSong(currentSongIndex);
    if (isPlaying) playMusic();
}

// 4. SHUFFLE AND REPEAT
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
    showNotification(isShuffled ? 'Shuffle ON' : 'Shuffle OFF');
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    repeatBtn.classList.toggle('active', repeatMode > 0);
    
    const repeatModes = ['Repeat OFF', 'Repeat All', 'Repeat One'];
    const icons = ['fas fa-redo', 'fas fa-redo', 'fas fa-redo-alt'];
    
    repeatBtn.innerHTML = `<i class="${icons[repeatMode]}"></i>`;
    showNotification(repeatModes[repeatMode]);
}

// 5. PROGRESS BAR FUNCTIONALITY
function updateProgress() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = progress + '%';
        progressDot.style.left = progress + '%';
        
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        totalTimeSpan.textContent = formatTime(audioPlayer.duration);
    }
}

function setProgress(e) {
    const containerWidth = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration) {
        audioPlayer.currentTime = (clickX / containerWidth) * duration;
    }
}

// 6. VOLUME CONTROL
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    currentVolume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    const volumePercent = currentVolume * 100;
    volumeProgress.style.width = volumePercent + '%';
    volumeSlider.value = volumePercent;
    
    // Update volume icon
    const volumeIcon = volumeBtn.querySelector('i');
    if (isMuted || currentVolume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (currentVolume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

function toggleMute() {
    isMuted = !isMuted;
    audioPlayer.muted = isMuted;
    
    if (isMuted) {
        volumeProgress.style.width = '0%';
    } else {
        volumeProgress.style.width = (currentVolume * 100) + '%';
    }
    
    updateVolumeDisplay();
}

// 7. PLAYLIST FUNCTIONALITY
function updatePlaylist() {
    playlist.innerHTML = '';
    
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        if (index === currentSongIndex) {
            li.classList.add('active');
        }
        
        li.innerHTML = `
            <div class="playlist-item-number">${index + 1}</div>
            <div class="playlist-item-info">
                <div class="playlist-item-title">${song.title}</div>
                <div class="playlist-item-artist">${song.artist}</div>
            </div>
            <div class="playlist-item-duration">3:45</div>
        `;
        
        li.addEventListener('click', () => {
            loadSong(index);
            playMusic();
            closePlaylistPanel();
        });
        
        playlist.appendChild(li);
    });
}

function updatePlaylistActiveState() {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

function openPlaylistPanel() {
    playlistPanel.classList.add('open');
}

function closePlaylistPanel() {
    playlistPanel.classList.remove('open');
}

function clearPlaylistItems() {
    if (confirm('Are you sure you want to clear the entire playlist?')) {
        songs = [];
        currentSongIndex = 0;
        pauseMusic();
        songTitle.textContent = 'No songs';
        artistName.textContent = 'Add songs to playlist';
        albumImage.src = 'https://via.placeholder.com/300x300/667eea/ffffff?text=♪';
        updatePlaylist();
        showNotification('Playlist cleared');
    }
}

// 8. FILE UPLOAD FUNCTIONALITY
function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        if (file.type.startsWith('audio/')) {
            const url = URL.createObjectURL(file);
            const song = {
                title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                artist: 'Local File',
                src: url,
                cover: 'https://via.placeholder.com/300x300/667eea/ffffff?text=♪'
            };
            
            songs.push(song);
        }
    });
    
    updatePlaylist();
    showNotification(`${files.length} songs added to playlist`);
    
    // If no song is currently loaded, load the first uploaded song
    if (songs.length === files.length) {
        loadSong(0);
    }
}

// 9. UTILITY FUNCTIONS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 0.9rem;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// 10. EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    // Control buttons
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressContainer.addEventListener('click', setProgress);
    
    // Volume controls
    volumeSlider.addEventListener('input', updateVolume);
    volumeBtn.addEventListener('click', toggleMute);
    
    // Playlist controls
    playlistToggle.addEventListener('click', openPlaylistPanel);
    closePlaylist.addEventListener('click', closePlaylistPanel);
    clearPlaylist.addEventListener('click', clearPlaylistItems);
    fileInput.addEventListener('change', handleFileUpload);
    
    // Audio player events
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('loadedmetadata', function() {
        totalTimeSpan.textContent = formatTime(audioPlayer.duration);
    });
    
    audioPlayer.addEventListener('ended', function() {
        if (repeatMode === 2) { // Repeat one
            audioPlayer.currentTime = 0;
            playMusic();
        } else if (repeatMode === 1 || currentSongIndex < songs.length - 1) { // Repeat all or not last song
            nextSong();
        } else {
            pauseMusic();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.target.tagName.toLowerCase() !== 'input') {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    previousSong();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSong();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
                    updateVolume();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
                    updateVolume();
                    break;
                case 'm':
                    toggleMute();
                    break;
                case 's':
                    toggleShuffle();
                    break;
                case 'r':
                    toggleRepeat();
                    break;
                case 'p':
                    openPlaylistPanel();
                    break;
            }
        }
    });
    
    // Close playlist when clicking outside
    document.addEventListener('click', function(e) {
        if (!playlistPanel.contains(e.target) && !playlistToggle.contains(e.target)) {
            closePlaylistPanel();
        }
    });
    
    // Initialize the player
    initializePlayer();
});