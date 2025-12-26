// Refactored Video Section Component with Auth Header + Backend Sync
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from '../context/AuthContext'
import { ProgressContext } from "../context/ProgressContext";

const SectionVideos = () => {
  const [section, setSection] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const { courseId, sectionId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext)
  const { notifyProgressChanged } = useContext(ProgressContext)

  const videoRef = useRef(null);

  //fetch section and progress data
  useEffect(() => {
  const fetchSectionAndProgress = async () => {
      try {
        const sectionRes = await axios.get(`http://localhost:5000/api/sections/${sectionId}`);
        console.log(sectionRes.data)
        const progressRes = await axios.get(
          `http://localhost:5000/api/progress/${courseId}/${sectionId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const sectionData = sectionRes.data;
        const completed = progressRes.data?.completedVideos || [];
  
        setSection(sectionData);
        setCompletedVideos(completed);
  
        if (sectionData.units && sectionData.units.length > 0) {
          setVideos(sectionData.units);
          // Select first unwatched video, or first video
          const firstUnwatched = sectionData.units.find(v => !completed.includes(v.videoID)) || sectionData.units[0];
          setSelectedVideo(firstUnwatched);
        } else {
          setVideos([]);
          setSelectedVideo(null);
        }
      } catch (error) {
        console.error("Error fetching section/progress:", error);
        setVideos([]);
        setSelectedVideo(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (sectionId && token) {
      fetchSectionAndProgress();
    }
  }, [sectionId, courseId, token]);
  

    // handle video end
      const handleVideoEnd = () => {
        setShowPopup(true);
      };

    // handle play again
    const handlePlayAgain = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
      setShowPopup(false);
    };

    // handle play next
    const handlePlayNext = async () => {
      try {
        await axios.post(
          'http://localhost:5000/api/progress/watch-video',
          { courseId, sectionId, videoId: selectedVideo.videoID },
          {headers:{Authorization: `Bearer ${token}`}}
        );
        notifyProgressChanged();
        const updatedCompleted = [...completedVideos, selectedVideo.videoID];
        setCompletedVideos(updatedCompleted)
        // find next video
        const nextIndex = videos.findIndex(v => v.videoID === selectedVideo.videoID) + 1;
        const nextVideo = videos[nextIndex];
        setSelectedVideo(nextVideo || selectedVideo) // stay on same if no next
        setShowPopup(false)
      } catch (error) {
        console.error("Error marking video as watched")
      }
    };

  // handle unlock assessment
    const handleUnlockAssessment = async () => {
      try {
        await axios.post(
          'http://localhost:5000/api/progress/watch-video',
          { courseId, sectionId, videoId: selectedVideo.videoID },
          { headers: { Authorization: `Bearer ${token}` } }
        );
          notifyProgressChanged();
        setCompletedVideos([...completedVideos, selectedVideo.videoID]);
        setShowPopup(false);
        navigate(`/course-section/${courseId}`);
      } catch (error) {
        console.error("Error marking last video as watched");
        // Optionally, show an error message to the user
      }
    };
  // Only unlock the first video, and then unlock next if previous is completed
    const isVideoLocked = (video, idx) => {
      if (idx === 0) return false; // First video always unlocked
      // Only unlock if ALL previous videos are completed
      return !videos.slice(0, idx).every(v => completedVideos.includes(v.videoID));
    };


   
    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;


  return (
    <>
    <div className="text-white px-4 sm:px-6 lg:px-12">
      {/* Search */}
      <div className="flex justify-center px-5 sm:justify-between sm:items-center sm:py-4 mb-5 sm:mb-0">
      <h4 className="">{section?.sectionName}</h4>
        <div className="relative w-full sm:w-[368px]">
          <i className="fa fa-search text-[#B3B6B6] text-[18px] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
          <input
            type="search"
            placeholder="Search..."
            className="rounded-[15px] w-full pl-10 py-1.5 text-3 font-medium bg-transparent text-white border roboto"
          />
        </div>
      </div>


          

         
    </div>

    <div className="px-10 sm:flex sm:flex-row-reverse gap-5 sm:items-start">
      {selectedVideo ? (
        <div className=" flex flex-col gap-5">
        <video 
        ref={(videoRef)}
        src={selectedVideo.videoID} 
        onEnded={handleVideoEnd}
        className="w-[330px] h-[219px] border sm:w-[980px] sm:h-[480px]"
        controls></video>
        <div>
          <h3 className="font-semibold text-[20px] text-white">{selectedVideo.unitName}</h3>
          <p>{selectedVideo.unitDescription}</p>
        </div>
      </div>
      ): (
        <p>No video selected</p>
      )}

      {/* popup button */}
       {/* Popup: Assessment */}
         
            {/* <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 p-6 rounded-lg text-center w-[90%] max-w-md">
              <p className="mb-4">Ready to take the assessment or review the section?</p>
              <div className="flex justify-center gap-4">
                <button  className="px-6 py-2 border rounded-full">
                  Watch Again
                </button>
                <button
                  
                  className="px-6 py-2 border bg-[#FF9D00] text-white rounded-full"
                >
                  Unlock Assessment
                </button>
              </div>
            </div> */}
          
        {/* </div> */}
      {/* </div> */}
      {showPopup && (
        <div className="absolute inset-0 bg-opacity-50 flex  justify-end items-center  rounded">
          <div className=" p-6 rounded shadow-md text-center space-y-4  bg-black/90 w-[330px] h-[219px]  sm:w-[880px] sm:h-[460px]
          flex justify-center items-center">
            {(() => {
              const isLastVideo = videos.findIndex(v => v.videoID === selectedVideo?.videoID) === videos.length -1;
              if(isLastVideo) {
                return(
                  <>
                    
                    <div className="w-[429px] h-[135px] ">
                    <p className="roboto font-semibold text-white text-[22px] text-center">
                      Are you ready to start the assessment, or would you prefer to go over this section once more?</p>
                    <div className="mt-5 flex gap-5">
                    <button
                    onClick={handlePlayAgain}
                    className="text-white border border-white w-[208px] h-[45px] rounded-[40px] py-3 px-7.5 roboto font-semibold text-[18px] text-center cursor-pointer"
                    >Watch again</button>
                    <button
                    className="text-white bg-[#FF9D00] border border-[#FF9D00] w-[262px] h-[45px] rounded-[40px] py-3 px-7.5 roboto font-semibold text-[18px] text-center cursor-pointer"
                    onClick={handleUnlockAssessment}>Unlock Assessment</button>
                    </div>

                 </div>
                 </>
                );
              } else {
                return (
                  <>
                  <div className="w-[429px] h-[135px] ">
                  <p
                  className="roboto font-semibold text-white text-[22px] text-center"
                  >Would you like to continue to the next video or watch this one once more?</p>
                  <div className="mt-5 flex gap-5">
                  <button
                  onClick={handlePlayAgain} 
                  className="text-white border border-white w-[208px] h-[45px] rounded-[40px] py-3 px-7.5 roboto font-semibold text-[18px] text-center cursor-pointer">
                    Play Again</button>
                  <button 
                  className="text-white bg-[#FF9D00] border border-[#FF9D00] w-[208px] h-[45px] rounded-[40px] py-3 px-7.5 roboto font-semibold text-[18px] text-center cursor-pointer"
                  onClick={handlePlayNext}>Play Next</button>
                  </div>
                  </div>
                  </>
                )
              }
            })()}
          </div>
        </div>
      )}
        

        {/* unit list */}
        <div className="mt-5 sm:mt-0">
          <div>
            {videos.length === 0 ? (
              <div>No videos found for this section.</div>
            ) : (
              <ul className="flex flex-col gap-5">
                {videos.map((video, idx) => {
                  const isLocked = isVideoLocked(video, idx);
                  return (<li 
                  key={`${video.videoID}-${idx}`}
                  onClick={() => !isLocked && setSelectedVideo(video)}
                  className={`flex flex-row justify-between items-center gap-3 p-2 border rounded-[12px] cursor-pointer bg-black ${
                    selectedVideo?.videoID === video.videoID ? '' : ''
                  } ${isLocked ? 'pointer-events-none filter blur-sm opacity-60' : ''}`}
                      style={{ filter: isLocked ? 'blur(1px)' : 'none', opacity: isLocked ? 0.6 : 1 }}>
                    <div className="w-[128px] h-[77px] border rounded-[7px]"></div>
                    <div>
                      <h4 className="font-semibold text-[17px]">{video.unitName}</h4>
                      <p className="font-medium text-[13px]">{video.unitDescription}</p>
                    </div>
                  </li>
                  )})}
              </ul>
            )}
          </div>
        </div>
       
    </div>
    
    </>
  );
};

export default SectionVideos;
