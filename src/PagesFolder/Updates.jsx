import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";

const Updates = () => {
  // State for the list of updates
  const [updates, setUpdates] = useState([]);
  // State for the selected update (for the modal)
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  // State for comments mapped by update ID
  const [commentsById, setCommentsById] = useState({});
  // State for the new comment input
  const [newComment, setNewComment] = useState("");
  // State to control comment input focus
  const [commentFocus, setCommentFocus] = useState(false);

  // Fetches updates from Supabase when the component mounts
  useEffect(() => {
    const fetchUpdates = async () => {
      const { data, error } = await supabase
        .from("updates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching updates: ", error);
        return;
      }
      setUpdates(data);
    };

    fetchUpdates();

    // Set up a real-time subscription to the "Updates" table
    const subscription = supabase
      .channel("public:updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "updates" },
        () => fetchUpdates()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Handles liking an update/post
  const handleLike = async (id, currentLikes) => {
    const { error } = await supabase
      .from("updates")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);

    if (error) {
      console.error("Error updating likes: ", error);
      return;
    }

    // Update the local state to reflect the new likes count
    setUpdates((prevUpdates) =>
      prevUpdates.map((update) =>
        update.id === id ? { ...update, likes: update.likes + 1 } : update
      )
    );
  };

  // Switch statement to get status color based on the status value
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "not started":
        return "bg-red-500";
      case "in progress":
        return "bg-orange-500";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  // Handles adding a comment to a post
  const handleAddComment = (e) => {
    if (e.key === "Enter" && newComment.trim() && selectedUpdate) {
      const updateComments = commentsById[selectedUpdate.id] || [];
      setCommentsById({
        ...commentsById,
        [selectedUpdate.id]: [...updateComments, newComment.trim()],
      });
      setNewComment("");
    }
  };

  // Get comments for the current selected update
  const currentComments = selectedUpdate ? commentsById[selectedUpdate.id] || [] : [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Updates List Section, where users will be able to view updates/posts */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Updates</h2>
        {updates.length === 0 ? (
          <p className="text-gray-600">No updates yet.</p>
        ) : (
          updates.map((update) => (
            <div
              key={update.id}
              onClick={() => setSelectedUpdate(update)}
              className="bg-white p-4 rounded-lg shadow flex space-x-4 cursor-pointer hover:bg-gray-50 transition"
            >
              <img
                src={update.image_url}
                alt={update.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{update.title}</h3>
                <p className="text-gray-600 mt-1">{update.description}</p>
                <p className="text-gray-500 mt-1">
                  <span className="font-medium">Location:</span> {update.location}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <span
                    className={`text-white text-sm px-2 py-1 rounded ${getStatusColor(
                      update.status
                    )}`}
                  >
                    {update.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents the modal from opening when clicking the like button
                      handleLike(update.id, update.likes);
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                  >
                    <span className="text-xl">❤️</span>
                    <span>{update.likes}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUpdate(update);
                      setCommentFocus(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    💬 Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for larger view with comments. When user clicks on posts/update */}
      {selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">{selectedUpdate.title}</h2>
              <button
                onClick={() => {
                  setSelectedUpdate(null);
                  setCommentFocus(false);
                }}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedUpdate.image_url}
              alt={selectedUpdate.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
            <p className="text-gray-600 mb-2">{selectedUpdate.description}</p>
            <p className="text-gray-500 mb-2">
              <span className="font-medium">Location:</span> {selectedUpdate.location}
            </p>
            <div className="flex items-center space-x-2 mb-4">
              <span
                className={`text-white text-sm px-2 py-1 rounded ${getStatusColor(
                  selectedUpdate.status
                )}`}
              >
                {selectedUpdate.status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(selectedUpdate.id, selectedUpdate.likes);
                }}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
              >
                <span className="text-xl">❤️</span>
                <span>{selectedUpdate.likes}</span>
              </button>
            </div>
            {/* Comments List, where comments will be shown */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Comments</h3>
              {currentComments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                <ul className="space-y-2">
                  {currentComments.map((comment, index) => (
                    <li key={index} className="text-gray-600 bg-gray-100 p-2 rounded">
                      {comment}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Comment Input, where user can enter another comment */}
            <div className="mt-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleAddComment}
                placeholder="Add a comment (press Enter to submit)"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ref={commentFocus ? (input) => input && input.focus() : null}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Updates;