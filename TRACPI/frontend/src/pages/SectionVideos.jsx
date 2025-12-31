import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Player from "@vimeo/player";
import { AuthContext } from '../context/AuthContext'
import { ProgressContext } from "../context/ProgressContext";
import { Play, Pause, Search, RotateCcw, Lock, Maximize, Minimize } from 'lucide-react';
import squareLock from '../assets/square-lock-02.png';

const SectionVideos = () => {
  const [section, setSection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)
  const { notifyProgressChanged } = useContext(ProgressContext)

  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);

  //fetch section + progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionRes = await axios.get(`http://localhost:5000/api/sections/${sectionId}`);
        const progressRes = await axios.get(
          `http://localhost:5000/api/progress/${courseId}/${sectionId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = sectionRes.data;
        const completed = progressRes.data?.completedVideos || [];

        setSection(data);
        setCompletedVideos(completed);
        setVideos(data?.units || []);

        if (data.units?.length) {
          const firstUnwatched =
            data.units.find(v => !completed.includes(v.videoID)) || data.units[0];
          setSelectedVideo(firstUnwatched);
        }
      } catch (err) {
        console.error("Error fetching section/progress", err);
      } finally {
        setLoading(false);
      }
    };

    if (sectionId && token) fetchData();
  }, [sectionId, courseId, token]);


  // 🚀 Vimeo Player Setup (Responsive)
  useEffect(() => {
    if (!selectedVideo) return;

    // Reset states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setShowPopup(false);

    if (playerRef.current) {
      playerRef.current.destroy();
    }

    const player = new Player("vimeo-player", {
      id: selectedVideo.videoID,
      responsive: true,
      controls: false, // Try to hide default controls to show ours
      title: false,
      byline: false,
      portrait: false
    });

    playerRef.current = player;

    player.on("play", () => setIsPlaying(true));
    player.on("pause", () => setIsPlaying(false));
    player.on("timeupdate", (data) => setCurrentTime(data.seconds));
    player.on("loaded", () => {
      player.getDuration().then((d) => setDuration(d));
    });

    // Also fetch duration just in case loaded already fired or if it helps
    player.getDuration().then((d) => setDuration(d)).catch(() => { });

    player.on("ended", () => {
      setIsPlaying(false);
      setShowPopup(true)
    });

    return () => player.destroy();
  }, [selectedVideo]);


  const handlePlayAgain = async () => {
    if (playerRef.current) {
      await playerRef.current.setCurrentTime(0);
      playerRef.current.play();
      setIsPlaying(true);
    }
    setShowPopup(false);
  };

  const handlePlayNext = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/progress/watch-video",
        { courseId, sectionId, videoId: selectedVideo.videoID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notifyProgressChanged();

      const updated = [...completedVideos, selectedVideo.videoID];
      setCompletedVideos(updated);

      const nextIndex =
        videos.findIndex(v => v.videoID === selectedVideo.videoID) + 1;

      const nextVideo = videos[nextIndex];
      if (nextVideo) setSelectedVideo(nextVideo);

      setShowPopup(false);
    } catch {
      console.log("Error");
    }
  };

  const handleUnlockAssessment = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/progress/watch-video",
        { courseId, sectionId, videoId: selectedVideo.videoID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notifyProgressChanged();
      navigate(`/course-section/${courseId}`);
    } catch {
      console.log("Error unlocking assessment");
    }
  };

  const isVideoLocked = (video, idx) => {
    if (idx === 0) return false;
    return !videos.slice(0, idx).every(v => completedVideos.includes(v.videoID));
  };

  // Custom Controls Handlers
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const startRewatch = async () => {
    if (playerRef.current) {
      await playerRef.current.setCurrentTime(0);
      playerRef.current.play();
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current) {
      playerRef.current.setCurrentTime(time);
    }
  };

  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => {
        setIsFullScreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullScreen(false);
      });
    }
  };

  // Sync fullscreen state with browser events (esc key etc)
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Loading...
      </div>
    );

  const currentVideoIndex = videos.findIndex(v => v.videoID === selectedVideo?.videoID);

  return (
    <div className="min-h-screen bg-[#040508] text-white font-['Poppins'] pb-10">
      {/* Header Section */}
      <div className="px-6 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-end gap-6">
            <h1 className="text-2xl font-bold tracking-wide">{section?.sectionName || "Section Name"}</h1>
            <span className="text-lg text-gray-400 font-medium mb-0.5">
              {currentVideoIndex !== -1 ? currentVideoIndex + 1 : 0} / {videos.length}
            </span>
          </div>

          <div className="relative w-full md:w-[350px]">
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-[#1A1A1A] text-white pl-10 pr-4 py-2.5 rounded-[12px] border border-[#333] focus:border-[#FF9D00] outline-none text-sm transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-12 flex flex-col-reverse lg:flex-row gap-8 items-start">

        {/* Left: Video List (Sidebar) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
          {videos.map((video, idx) => {
            const locked = isVideoLocked(video, idx);
            const isSelected = selectedVideo?.videoID === video.videoID;

            return (
              <div
                key={video.videoID}
                onClick={() => !locked && setSelectedVideo(video)}
                className={`flex gap-4 p-3 rounded-[16px] border transition-all cursor-pointer group
                    ${isSelected
                    ? 'bg-[#1A1A1A] border-[#FF9D00] shadow-[0_0_15px_rgba(255,157,0,0.1)]'
                    : 'bg-[#0A0A0A] border-[#333] hover:border-gray-500'
                  }
                    ${locked ? 'opacity-60 grayscale cursor-not-allowed' : ''}
                  `}
              >
                {/* Thumbnail Placeholder */}
                <div className="relative w-[120px] h-[75px] bg-gray-800 rounded-[8px] overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                    {locked ? <Lock size={20} className="text-gray-500" /> : <Play size={24} className={`fill-current ${isSelected ? 'text-[#FF9D00]' : 'text-gray-400 group-hover:text-white'}`} />}
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold mb-1 truncate ${isSelected ? 'text-[#FF9D00]' : 'text-white'}`}>
                    {video.unitName}
                  </h4>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {video.unitDescription || "Introduction Video for the section of course"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Video Player Area */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {selectedVideo ? (
            <>
              {/* Video Container */}
              <div
                ref={videoContainerRef}
                className="relative w-full aspect-video bg-black rounded-[20px] overflow-hidden border border-[#222] shadow-2xl group/player"
              >
                <div id="vimeo-player" className="w-full h-full pointer-events-none"></div>

                {/* Center Play Button Overlay (visible when paused and not ending) */}
                {!isPlaying && !showPopup && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 cursor-pointer group-hover/player:bg-black/40 transition-all"
                  >
                    <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center pl-1 bg-black/40 backdrop-blur-sm hover:scale-110 transition-transform">
                      <Play size={40} className="fill-white text-white" />
                    </div>
                  </div>
                )}

                {/* Clickable Area for Play/Pause when playing */}
                {isPlaying && !showPopup && (
                  <div className="absolute inset-0 z-10" onClick={togglePlay}></div>
                )}

                {/* Custom Control Bar */}
                <div className={`absolute bottom-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${!isPlaying ? 'opacity-100' : 'opacity-0 group-hover/player:opacity-100'}`}>

                  {/* Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#FF9D00] mb-4 hover:h-1.5 transition-all"
                    style={{
                      background: `linear-gradient(to right, #FF9D00 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%)`
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Play/Pause Small */}
                      <button onClick={togglePlay} className="hover:text-[#FF9D00] transition-colors">
                        {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
                      </button>

                      {/* Rewatch */}
                      <button onClick={startRewatch} className="hover:text-[#FF9D00] transition-colors" title="Rewatch">
                        <RotateCcw size={20} />
                      </button>

                      {/* Time */}
                      <span className="text-sm font-medium text-gray-200">
                        {formatTime(currentTime)} <span className="text-gray-500 mx-1">/</span> {formatTime(duration)}
                      </span>
                    </div>

                    {/* Fullscreen */}
                    <button onClick={toggleFullScreen} className="hover:text-[#FF9D00] transition-colors">
                      {isFullScreen ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>
                  </div>
                </div>


                {/* Popup Overlay within the video area if ended */}
                {showPopup && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="text-center p-8 max-w-md w-full">
                      {(() => {
                        const isLast = videos.findIndex(v => v.videoID === selectedVideo?.videoID) === videos.length - 1;
                        return (
                          <>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              {isLast ? "Section Completed!" : "Video Completed"}
                            </h3>
                            <p className="text-gray-300 mb-8 text-sm">
                              {isLast ? "You have finished this section. Ready for the assessment?" : "Would you like to continue to the next video?"}
                            </p>

                            <div className="flex gap-4 justify-center">
                              <button
                                onClick={handlePlayAgain}
                                className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm font-medium"
                              >
                                <RotateCcw size={16} /> Watch Again
                              </button>

                              {isLast ? (
                                <button
                                  onClick={handleUnlockAssessment}
                                  className="px-8 py-3 rounded-full bg-[#FF9D00] hover:bg-[#E68900] text-black font-bold text-sm transition-colors shadow-lg shadow-orange-500/20"
                                >
                                  Unlock Assessment
                                </button>
                              ) : (
                                <button
                                  onClick={handlePlayNext}
                                  className="px-8 py-3 rounded-full bg-[#FF9D00] hover:bg-[#E68900] text-black font-bold text-sm transition-colors shadow-lg shadow-orange-500/20"
                                >
                                  Next Video
                                </button>
                              )}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Metadata */}
              <div className="px-1">
                <h2 className="text-2xl font-bold text-white mb-2">{selectedVideo.unitName}</h2>
                <p className="text-gray-400 leading-relaxed text-sm max-w-3xl">
                  {selectedVideo.unitDescription || "No description available for this video."}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full aspect-video bg-[#111] rounded-[20px] flex items-center justify-center border border-[#222]">
              <p className="text-gray-500">Select a video to start watching</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SectionVideos;
