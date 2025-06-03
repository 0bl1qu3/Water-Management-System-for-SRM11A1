import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Adjust the import path if needed

const Reports = () => {
  // State for form inputs
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  // State for the list of posts
  const [posts, setPosts] = useState([]);

  // Fetch posts from Supabase when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts: ", error);
        return;
      }
      setPosts(data);
    };

    fetchPosts();

    // Optional: Set up a real-time subscription (if needed)
    const subscription = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => fetchPosts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !image) {
      alert("Please fill in all fields and upload an image.");
      return;
    }

    try {
      // Upload image to Supabase Storage
      const fileName = `${Date.now()}_${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, image);

      if (uploadError) {
        console.error("Error uploading image: ", uploadError);
        alert("Failed to upload image. Please try again.");
        return;
      }

      // Get the public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Add post to Supabase database
      const { error: insertError } = await supabase.from("posts").insert([
        {
          title,
          description,
          location,
          image_url: imageUrl,
        },
      ]);

      if (insertError) {
        console.error("Error adding post: ", insertError);
        alert("Failed to add post. Please try again.");
        return;
      }

      // Reset the form
      setTitle("");
      setDescription("");
      setLocation("");
      setImage(null);
    } catch (error) {
      console.error("Error: ", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add a New Report</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the title"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter the description"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter the location"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {image && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Report
          </button>
        </div>
      </div>

      {/* Posts List Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Reports</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600">No reports yet. Add one above!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow flex space-x-4">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                <p className="text-gray-600 mt-1">{post.description}</p>
                <p className="text-gray-500 mt-1">
                  <span className="font-medium">Location:</span> {post.location}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;