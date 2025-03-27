import React, { useState } from 'react';

const RatingComment = ({ rating, onReplySubmit }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!replyText.trim()) {
      setError('Please enter a reply');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to submit a reply');
      }

      const response = await fetch('/api/ratings/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating_id: rating.id,
          user_id: rating.user_id, // This should be the current user's ID
          reply_text: replyText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit reply');
      }

      setReplyText('');
      setIsReplying(false);
      if (onReplySubmit) {
        onReplySubmit(data.reply);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-start space-x-4">
        <img
          src={rating.profile_picture || 'https://via.placeholder.com/40?text=U'}
          alt={rating.user_name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{rating.user_name}</h4>
            <div className="flex items-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <span key={index} className={index < rating.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 mt-1">{rating.comment}</p>
          <div className="mt-2 text-sm text-gray-500">
            <span>{new Date(rating.created_at).toLocaleDateString()}</span>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="ml-4 text-black hover:text-gray-700"
            >
              Reply
            </button>
          </div>

          {/* Replies Section */}
          {rating.replies && rating.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {rating.replies.map((reply) => (
                <div key={reply.id} className="flex items-start space-x-3 pl-4 border-l-2 border-gray-100">
                  <img
                    src={reply.profile_picture || 'https://via.placeholder.com/32?text=U'}
                    alt={reply.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{reply.name}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{reply.reply_text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-4">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                rows="2"
                placeholder="Write a reply..."
              />
              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingComment;