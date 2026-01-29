import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Player from "@vimeo/player";
import { AuthContext } from '../context/AuthContext'
import { ProgressContext } from "../context/ProgressContext";
import { Play, Pause, Search, RotateCcw, Lock, Maximize, Minimize, Volume2, VolumeX, ChevronLeft, ArrowLeft } from 'lucide-react';
import squareLock from '../assets/square-lock-02.png';
import './css/faq.css';



const normalizeVideoId = (id) => {
  if (!id) return '';
  let str = String(id).trim();

  // Handle Vimeo
  const vimeoMatch = str.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) return vimeoMatch[1];

  return str;
};

const getVideoThumbnail = (videoID) => {
  if (!videoID) return null;
  let str = String(videoID).trim();

  // Vimeo
  const vimeoMatch = str.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeoMatch) return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;

  // Direct ID fallback (if numeric, assume Vimeo)
  if (/^\d+$/.test(str)) return `https://vumbnail.com/${str}.jpg`;

  return null;
};

const SectionVideos = () => {
  const [section, setSection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLastSection, setIsLastSection] = useState(false);
  const [unlockedIndices, setUnlockedIndices] = useState([0]);
  const [assessmentPassed, setAssessmentPassed] = useState(false);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const isSeekingRef = useRef(false);
  const vimeoHostRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [error, setError] = useState(null);

  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)
  const { notifyProgressChanged } = useContext(ProgressContext)

  // Refs for stable access inside event listeners
  const sectionRef = useRef(section);
  const selectedVideoRef = useRef(selectedVideo);

  useEffect(() => {
    sectionRef.current = section;
    selectedVideoRef.current = selectedVideo;
  }, [section, selectedVideo]);

  const playerRef = useRef(null);
  const videoContainerRef = useRef(null);

  //fetch section + progress
  useEffect(() => {
    const fetchData = async () => {
      // DEBUG: Check localStorage directly
      const storageToken = localStorage.getItem('token');
      console.log("SectionVideos: Checking token", { contextToken: !!token, storageToken: !!storageToken });

      if (!token && !storageToken) {
        console.log("SectionVideos: No token found in context or storage.");
        // We wait a tiny bit to see if context updates, otherwise we show error
        setTimeout(() => {
          if (!token && !localStorage.getItem('token')) {
            setLoading(false);
            setError("You must be logged in to view this course.");
          }
        }, 1500);
        return;
      }

      const activeToken = token || storageToken;

      const isNewSection = !section || String(section._id) !== String(sectionId);
      if (isNewSection) {
        setLoading(true);
      }

      setError(null);
      console.log("SectionVideos: Starting fetchData", { sectionId, courseId, hasToken: !!activeToken });

      try {
        const sectionRes = await axios.get(
          `http://localhost:5000/api/sections/${sectionId}`,
          { headers: { Authorization: `Bearer ${activeToken}` } }
        );
        const data = sectionRes.data;
        console.log("SectionVideos: Fetched section data:", data);

        if (!data) throw new Error("Section data is empty");

        setSection(data);
        const units = data.units || [];
        setVideos(units);

        if (units.length === 0) {
          console.warn("SectionVideos: This section has no units/videos.");
        }

        // Fetch progress independently
        try {
          const progressRes = await axios.get(
            `http://localhost:5000/api/progress/${courseId}/${data._id}`,
            { headers: { Authorization: `Bearer ${activeToken}` } }
          );
          const completed = progressRes.data?.completedVideos || [];
          console.log("SectionVideos: Fetched progress:", completed);
          setCompletedVideos(completed);

          if (units.length) {
            // Unlocked indices: index 0 is always unlocked.
            // Any index 'i' is unlocked if the previous index 'i-1' is in completed videos.
            const initialUnlocked = [0];
            units.forEach((v, i) => {
              const normalizedId = normalizeVideoId(v.videoID);
              if (completed.some(id => normalizeVideoId(id) === normalizedId)) {
                if (i + 1 < units.length) {
                  initialUnlocked.push(i + 1);
                }
              }
            });
            setUnlockedIndices([...new Set(initialUnlocked)]);

            // Update selectedVideo if it's not set OR if we just changed sections
            if (!selectedVideo || isNewSection) {
              const firstUnwatched =
                units.find(
                  v => !completed.some(id => normalizeVideoId(id) === normalizeVideoId(v.videoID))
                ) || units[0];
              setSelectedVideo(firstUnwatched);
            }
          }
        } catch (progErr) {
          console.error("SectionVideos: Error fetching progress", progErr);
          setCompletedVideos([]);
          if (units.length && !selectedVideo) setSelectedVideo(units[0]);
        }

        // Fetch the course to get ordered sections and check if this is the last one
        try {
          const courseRes = await axios.get(
            `http://localhost:5000/api/courses/${courseId}`,
            { headers: { Authorization: `Bearer ${activeToken}` } }
          );
          const orderedSections = courseRes.data?.sections || [];
          const currentIdx = orderedSections.findIndex(s => String(s._id || s) === String(sectionId));
          setIsLastSection(currentIdx !== -1 && currentIdx === orderedSections.length - 1);
        } catch (sectionErr) {
          console.error("SectionVideos: Error fetching course for session ordering", sectionErr);
          setIsLastSection(false);
        }

      } catch (err) {
        console.error("SectionVideos: Error fetching section/progress", err);
        if (err.response?.status === 401) {
          setError("Your session has expired or you are unauthorized. Please log in again.");
        } else {
          setError(err.response?.data?.error || err.message || "Failed to load section content");
        }
      } finally {
        setLoading(false);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId, courseId, token]);


  // 🚀 Player Setup (Vimeo + YouTube)
  useEffect(() => {
    if (!selectedVideo) return;

    const vidId = normalizeVideoId(selectedVideo.videoID);

    console.log("SectionVideos: Setting up player for", { id: vidId, type: 'Vimeo' });

    // Reset states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    isSeekingRef.current = false;
    setShowPopup(false);

    // Destroy existing players
    if (playerRef.current) {
      if (typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = null;
    }

    // Vimeo Player
    if (vimeoHostRef.current) {
      vimeoHostRef.current.innerHTML = ''; // Clean container
      const player = new Player(vimeoHostRef.current, {
        id: vidId,
        responsive: true,
        controls: false,
        title: false,
        byline: false,
        portrait: false,
        muted: false
      });

      playerRef.current = player;

      player.on("play", () => setIsPlaying(true));
      player.on("playing", () => setIsPlaying(true));
      player.on("pause", () => setIsPlaying(false));

      player.on("timeupdate", (data) => {
        if (!isSeekingRef.current) {
          if (data.seconds !== undefined) setCurrentTime(data.seconds);
        }
        if (data.duration) setDuration(data.duration);
      });

      player.on("loaded", async () => {
        try {
          const d = await player.getDuration();
          setDuration(d);
        } catch (e) { }
      });

      player.on("durationchange", (data) => {
        if (data.duration) setDuration(data.duration);
      });

      player.on("seeking", () => {
        isSeekingRef.current = true;
      });

      player.on("seeked", () => {
        isSeekingRef.current = false;
      });

      player.on("ended", () => {
        setIsPlaying(false);
        markAsWatched(); // Fire and forget - don't block UI
        setShowPopup(true);
      });

      player.getDuration().then((d) => setDuration(d)).catch(() => { });

      // Initialize volume
      player.setVolume(isMuted ? 0 : volume).catch(() => { });
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [selectedVideo?.videoID, loading]);

  // Smooth Progress Update Interval (Supports both)
  useEffect(() => {
    let interval;
    if (isPlaying && !showPopup) {
      interval = setInterval(async () => {
        if (!playerRef.current || isSeekingRef.current) return;

        try {
          // Check for Vimeo first (async)
          if (typeof playerRef.current.getCurrentTime === 'function') {
            const time = await playerRef.current.getCurrentTime();
            // Test if it returned a promise or a value
            setCurrentTime(typeof time === 'number' ? time : 0);
          }
        } catch (e) {
          // Fallback or skip if not ready
        }
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, showPopup]);




  const markAsWatched = async () => {
    const currentSection = sectionRef.current;
    const currentVideo = selectedVideoRef.current;

    if (!currentVideo || !currentSection) return;

    const normalizedId = normalizeVideoId(currentVideo.videoID);

    // 1. Optimistic Local Update - ensures sidebar and "Play Next" logic reflect completion instantly
    setCompletedVideos(prev => {
      if (prev.some(id => normalizeVideoId(id) === normalizedId)) return prev;
      const newCompleted = [...prev, normalizedId];
      console.log("SectionVideos: Optimistically updated completed videos:", newCompleted);
      return newCompleted;
    });

    try {
      // 2. Persist to Backend
      await axios.post(
        "http://localhost:5000/api/progress/watch-video",
        {
          courseId,
          sectionId: currentSection._id,
          videoId: currentVideo.videoID
        },
        {
          headers: { Authorization: `Bearer ${token || localStorage.getItem('token')}` }
        }
      );

      notifyProgressChanged();
    } catch (err) {
      console.error("SectionVideos: Error marking video as watched in backend", err);
    }
  };



  const handlePlayAgain = async () => {
    if (playerRef.current) {
      if (typeof playerRef.current.setCurrentTime === 'function') {
        await playerRef.current.setCurrentTime(0);
        playerRef.current.play();
      }
      setIsPlaying(true);
      setCurrentTime(0);
    }
    setShowPopup(false);
  };

  const handlePlayNext = async () => {
    try {
      // Ensure current video completion is registered if it hasn't been already
      const normalizedId = normalizeVideoId(selectedVideo.videoID);
      if (!completedVideos.some(id => normalizeVideoId(id) === normalizedId)) {
        await markAsWatched();
      }

      notifyProgressChanged();

      // Find and select next video
      const currentIndex = videos.indexOf(selectedVideo);
      const nextIndex = currentIndex + 1;
      const nextVideo = videos[nextIndex];

      if (nextVideo) {
        // Unlock the next video ONLY when Play Next is clicked
        setUnlockedIndices(prev => [...new Set([...prev, nextIndex])]);
        setSelectedVideo(nextVideo);
        setShowPopup(false);
      } else {
        // Last video finished
        setShowPopup(true);
      }
    } catch (error) {
      console.error("SectionVideos: Error in handlePlayNext:", error);
    }
  };

  const handleUnlockAssessment = async () => {
    try {
      notifyProgressChanged();

      // Fetch all sections to find the next one
      const sectionsRes = await axios.get(
        `http://localhost:5000/api/sections/by-course?courseId=${courseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allSections = sectionsRes.data || [];
      const currentIdx = allSections.findIndex(s => String(s._id) === String(sectionId));

      if (currentIdx !== -1 && currentIdx < allSections.length - 1) {
        const nextSection = allSections[currentIdx + 1];
        navigate(`/courses/${courseId}/sections/${nextSection._id}`);
      } else {
        // Fallback to course section page if it's the last section
        navigate(`/course-section/${courseId}`);
      }
    } catch (err) {
      console.error("Error navigating to next session", err);
      navigate(`/course-section/${courseId}`);
    }
  };

  const handleTakeAssessment = () => {
    notifyProgressChanged();
    // Navigate with a state flag to open the assessment popup automatically
    navigate(`/course-section/${courseId}`, { state: { openAssessment: true } });
  };

  const isVideoLocked = (video, idx) => {
    return !unlockedIndices.includes(idx);
  };


  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (playerRef.current) {
      playerRef.current.setVolume(newMuted ? 0 : volume).catch(() => { });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume).catch(() => { });
    }
  };

  // Custom Controls Handlers
  const togglePlay = () => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.pause().catch(() => { });
      setIsPlaying(false);
    } else {
      playerRef.current.play().catch(err => console.error("Play failed", err));
      setIsPlaying(true);

      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
    }
  };

  const startRewatch = async () => {
    if (playerRef.current) {
      if (typeof playerRef.current.setCurrentTime === 'function') {
        await playerRef.current.setCurrentTime(0);
        playerRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    isSeekingRef.current = true;
    if (playerRef.current) {
      if (typeof playerRef.current.setCurrentTime === 'function') {
        playerRef.current.setCurrentTime(time).catch(() => { });
      }
    }
  };

  const onSeekMouseDown = () => {
    isSeekingRef.current = true;
    setIsSeeking(true);
  };
  const onSeekMouseUp = () => {
    setIsSeeking(false);
    // isSeekingRef will be reset by 'seeked' event from player
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

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-[#040508]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FFB700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading Content...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#040508] p-5 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-8 max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-[#FFB700] text-black font-bold rounded-xl hover:bg-[#E68900] transition-all"
        >
          Try Again
        </button>
      </div>
    );

  const currentVideoIndex = videos.indexOf(selectedVideo);

  return (
    <div className="min-h-screen bg-[#040508] text-white font-['Poppins'] pb-10">
      {/* Header Section */}
      <div className="px-6 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/course-section/${courseId}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-[#FFB700] transition-colors self-start mb-1 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Course</span>
            </button>

            <div className="flex items-end gap-6">
              <h1 className="text-2xl font-bold tracking-wide">
                {section?.sectionName || 'Section Name'}
              </h1>
              <span className="text-lg text-gray-400 font-medium mb-0.5">
                {currentVideoIndex !== -1 ? currentVideoIndex + 1 : 0} /{' '}
                {videos.length}
              </span>
            </div>
          </div>

          <div className="relative w-full md:w-[350px]">
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1A1A1A] text-white pl-10 pr-4 py-2.5 rounded-[12px] border border-[#333] focus:border-[#FFB700] outline-none text-sm transition-all"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-12 flex flex-col-reverse lg:flex-row gap-8 items-start">
        {/* Left: Video List (Sidebar) */}
        <div className="w-full lg:w-[380px] flex flex-col gap-4 max-h-[calc(100vh-180px)] overflow-y-auto pr-2 custom-scrollbar">
          {videos
            .filter((video) =>
              video.unitName?.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((video) => {
              // Use indexOf for exact object reference to handle duplicates correctly
              const idx = videos.indexOf(video);
              const locked = isVideoLocked(video, idx);
              // Use object reference comparison for absolute uniqueness in the UI
              const isSelected = selectedVideo === video;

              return (
                <div
                  key={`${video.videoID}-${idx}`}
                  onClick={() => !locked && setSelectedVideo(video)}
                  className={`relative flex gap-4 p-3 rounded-[16px] border transition-all cursor-pointer group overflow-hidden
                        ${isSelected
                      ? 'bg-[#1A1A1A] border-[#FFB700] shadow-[0_0_15px_rgba(255,157,0,0.1)]'
                      : 'bg-[#0A0A0A] border-[#333] hover:border-gray-500'
                    }
                        ${locked ? 'cursor-not-allowed' : ''}
                      `}
                >
                  {/* Video Thumbnail */}
                  <div className="relative w-[120px] h-[75px] bg-gray-800 rounded-[10px] overflow-hidden flex-shrink-0 group-hover:shadow-[0_0_10px_rgba(255,157,0,0.2)] transition-all">
                    {getVideoThumbnail(video.videoID) ? (
                      <img
                        src={getVideoThumbnail(video.videoID)}
                        alt={video.unitName}
                        className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                    )}

                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isSelected
                        ? 'bg-[#FFB700]/20'
                        : 'bg-black/40 group-hover:bg-black/20'
                        }`}
                    >
                      {locked ? (
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md border border-[#FFB700]/40 shadow-[0_0_15px_rgba(0,0,0,0.4)] transition-all group-hover:scale-110">
                          <Lock size={14} className="text-[#FFB700] drop-shadow-[0_0_5px_rgba(255,157,0,0.4)]" />
                        </div>
                      ) : (
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 ${isSelected
                            ? 'bg-[#FFB700] border-none'
                            : 'bg-black/40 group-hover:scale-110 transition-transform'
                            }`}
                        >
                          <Play
                            size={14}
                            className={`fill-current ${isSelected ? 'text-black' : 'text-white'
                              }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <h4
                      className={`text-sm font-semibold mb-1 truncate transition-colors ${isSelected
                        ? 'text-[#FFB700]'
                        : 'text-white group-hover:text-[#FFB700]'
                        }`}
                    >
                      {video.unitName}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {video.unitDescription ||
                        'Introduction Video for the section of course'}
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
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
                className={`relative w-full aspect-video bg-black rounded-[20px] overflow-hidden border border-[#222] shadow-2xl group/player ${isPlaying && !showControls ? 'cursor-none' : ''
                  }`}
              >
                <div ref={vimeoHostRef} className="w-full h-full"></div>

                {/* Center Play Button Overlay (visible when paused and not ending) */}
                {!isPlaying && !showPopup && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 cursor-pointer group-hover/player:bg-black/40 transition-all text-white"
                  >
                    <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-white flex items-center justify-center pl-1 bg-black/40 backdrop-blur-sm hover:scale-110 transition-transform">
                      <Play size={24} className="sm:hidden fill-white" />
                      <Play size={40} className="hidden sm:block fill-white" />
                    </div>
                  </div>
                )}

                {/* Clickable Area for Play/Pause when playing */}
                {isPlaying && !showPopup && (
                  <div
                    className="absolute inset-0 z-10"
                    onClick={togglePlay}
                  ></div>
                )}

                {/* Custom Control Bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-t from-black/90 to-transparent transition-opacity duration-300 ${!isPlaying || showControls
                    ? 'opacity-100'
                    : 'opacity-0 overlay-shown'
                    }`}
                >
                  {/* Progress Bar */}
                  <input
                    type="range"
                    min="0"
                    step="any"
                    max={duration || 0}
                    value={currentTime}
                    onInput={handleSeek}
                    onMouseDown={onSeekMouseDown}
                    onMouseUp={onSeekMouseUp}
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#FFB700] mb-4 hover:h-1.5 transition-all"
                    style={{
                      background: `linear-gradient(to right, #FFB700 ${duration > 0 ? (currentTime / duration) * 100 : 0
                        }%, rgba(255, 255, 255, 0.1) ${duration > 0 ? (currentTime / duration) * 100 : 0
                        }%)`
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Play/Pause Small */}
                      <button
                        onClick={togglePlay}
                        className="hover:text-[#FFB700] transition-colors"
                      >
                        {isPlaying ? (
                          <Pause size={24} className="fill-current" />
                        ) : (
                          <Play size={24} className="fill-current" />
                        )}
                      </button>

                      {/* Rewatch */}
                      <button
                        onClick={startRewatch}
                        className="hover:text-[#FFB700] transition-colors"
                        title="Rewatch"
                      >
                        <RotateCcw size={20} />
                      </button>

                      {/* Time */}
                      <span className="text-sm font-medium text-gray-200">
                        {formatTime(currentTime)}{' '}
                        <span className="text-gray-500 mx-1">/</span>{' '}
                        {formatTime(duration)}
                      </span>

                      {/* Volume Control */}
                      <div
                        className="flex items-center gap-2 relative group/volume"
                        onMouseEnter={() => setShowVolumeSlider(true)}
                        onMouseLeave={() => setShowVolumeSlider(false)}
                      >
                        <button
                          onClick={toggleMute}
                          className="hover:text-[#FFB700] transition-colors"
                        >
                          {isMuted || volume === 0 ? (
                            <VolumeX size={20} />
                          ) : (
                            <Volume2 size={20} />
                          )}
                        </button>

                        <div className={`flex items-center transition-all duration-300 ${showVolumeSlider ? 'w-20 opacity-100 ml-1' : 'w-0 opacity-0 overflow-hidden'}`}>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-[#FFB700] bg-white/20"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={toggleFullScreen}
                      className="hover:text-[#FFB700] transition-colors"
                    >
                      {isFullScreen ? (
                        <Minimize size={24} />
                      ) : (
                        <Maximize size={24} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Popup Overlay within the video area if ended */}
                {showPopup && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center animate-in fade-in duration-500">
                    <div className="text-center p-4 md:p-8 max-w-lg w-full">
                      <p className="roboto text-white font-semibold text-[16px] md:text-[22px] leading-[22px] md:leading-[30px] tracking-normal text-center max-w-[340px] mx-auto mb-6 md:mb-8">
                        Would you like to continue to the next video or watch this one once more?
                      </p>

                      <div className="flex flex-row items-center justify-center gap-2 md:gap-4 w-full">
                        <button
                          onClick={handlePlayAgain}
                          className="flex items-center justify-center gap-1.5 md:gap-2 flex-1 max-w-[140px] md:max-w-none px-2 md:px-6 py-2.5 rounded-[12px] border border-white/40 bg-white/5 hover:bg-white/10 transition-all text-[11px] md:text-sm font-semibold text-white whitespace-nowrap"
                        >
                          <RotateCcw size={14} className="md:w-[18px] md:h-[18px]" /> Play Again
                        </button>
                        {(() => {
                          const isLastVideo =
                            videos.indexOf(selectedVideo) === videos.length - 1;
                          if (isLastVideo) {
                            return (
                              <div className="flex flex-row items-center justify-center gap-2 md:gap-4 flex-1">
                                {isLastSection ? (
                                  assessmentPassed ? (
                                    <button
                                      className="flex items-center justify-center gap-1.5 md:gap-2 w-full px-2 md:px-8 py-2.5 rounded-[12px] bg-green-600 text-white font-bold text-[11px] md:text-sm transition-all shadow-lg whitespace-nowrap cursor-default opacity-80"
                                    >
                                      Assessment Passed
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleTakeAssessment}
                                      className="flex items-center justify-center gap-1.5 md:gap-2 w-full px-2 md:px-8 py-2.5 rounded-[12px] bg-[#FFB700] hover:bg-[#E68900] text-black font-bold text-[11px] md:text-sm transition-all shadow-[0_4px_20px_rgba(255,157,0,0.3)] whitespace-nowrap"
                                    >
                                      Unlock Assessment
                                    </button>
                                  )
                                ) : (
                                  <button
                                    onClick={handleUnlockAssessment}
                                    className="flex items-center justify-center gap-1.5 md:gap-2 w-full px-2 md:px-8 py-2.5 rounded-[12px] bg-[#FFB700] hover:bg-[#E68900] text-black font-bold text-[11px] md:text-sm transition-all shadow-[0_4px_20px_rgba(255,157,0,0.3)] whitespace-nowrap"
                                  >
                                    Go to Next Session
                                  </button>
                                )}
                              </div>
                            );
                          }
                          return (
                            <button
                              onClick={handlePlayNext}
                              className="flex items-center justify-center gap-1.5 md:gap-2 flex-1 max-w-[140px] md:max-w-none px-2 md:px-8 py-2.5 rounded-[12px] bg-[#FFB700] hover:bg-[#E68900] text-black font-bold text-[11px] md:text-sm transition-all shadow-[0_4px_20px_rgba(255,157,0,0.3)] whitespace-nowrap"
                            >
                              <Play size={14} className="fill-black md:w-[18px] md:h-[18px]" /> Play Next
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Metadata */}
              <div className="px-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedVideo.unitName}
                </h2>
                <p className="text-gray-400 leading-relaxed text-sm max-w-3xl">
                  {selectedVideo.unitDescription ||
                    'No description available for this video.'}
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
    </div >
  );
};

export default SectionVideos;
