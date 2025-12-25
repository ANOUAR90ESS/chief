'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ReviewFormProps {
  toolId: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ toolId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('Please sign in to submit a review');
        setIsSubmitting(false);
        return;
      }

      // Submit the review
      const { error: submitError } = await supabase
        .from('reviews')
        .insert({
          tool_id: toolId,
          user_id: user.id,
          rating: rating,
          comment: comment.trim() || null,
        });

      if (submitError) {
        // Check if user already reviewed this tool
        if (submitError.code === '23505') {
          setError('You have already reviewed this tool');
        } else {
          setError('Failed to submit review. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      setSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);

      // Call the callback to refresh the page
      if (onReviewSubmitted) {
        setTimeout(() => {
          onReviewSubmitted();
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary/5 border border-border rounded-xl p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-secondary'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 font-semibold text-lg">{rating}/5</span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Your Review (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this tool..."
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:border-primary resize-none"
            maxLength={500}
          />
          <p className="text-sm text-secondary mt-1">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-500/10 border border-green-500/50 text-green-500 rounded-lg text-sm">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
