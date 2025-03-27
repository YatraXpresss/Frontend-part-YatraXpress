import React, { useState } from 'react';

const RideRating = ({ rideId, userId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const MAX_COMMENT_LENGTH = 500;
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment && comment.length > MAX_COMMENT_LENGTH) {
      setCommentError(`Comment must not exceed ${MAX_COMMENT_LENGTH} characters`);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please login to submit a rating');
      }

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ride_id: rideId,
          user_id: userId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit rating');
      }

      setSuccess(true);
      if (onRatingSubmit) {
        onRatingSubmit(data.rating);
      }
    } catch (err) {
      setError(err.message);
      console.error('Rating submission error:', err);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 p-4 rounded-lg text-green-700 text-center">
        Thank you for your rating!
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Rate Your Ride</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (Optional)
          </label>
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setCommentError('');
              }}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black ${commentError ? 'border-red-500' : 'border-gray-300'}`}
              rows="3"
              placeholder="Share your experience..."
              maxLength={MAX_COMMENT_LENGTH}
            />
            <div className="flex justify-between items-center mt-1">
              <span className={`text-xs ${comment.length > MAX_COMMENT_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                {comment.length}/{MAX_COMMENT_LENGTH} characters
              </span>
              {commentError && <span className="text-red-500 text-xs">{commentError}</span>}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
        >
          Submit Rating
        </button>
      </form>
    </div>
  );
};

export default RideRating;