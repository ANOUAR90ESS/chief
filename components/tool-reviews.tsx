'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import ReviewForm from './review-form';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    display_name: string;
  } | null;
}

interface ToolReviewsProps {
  toolId: string;
  initialReviews: Review[];
}

export default function ToolReviews({ toolId, initialReviews }: ToolReviewsProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const handleReviewSubmitted = () => {
    // Refresh the page data
    router.refresh();
    setShowForm(false);
  };

  return (
    <div className="bg-background border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Reviews ({initialReviews.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
        >
          {showForm ? 'Cancel' : 'Write Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <ReviewForm toolId={toolId} onReviewSubmitted={handleReviewSubmitted} />
      )}

      {/* Reviews List */}
      {initialReviews.length > 0 ? (
        <div className="space-y-4">
          {initialReviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4 last:border-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-secondary'
                      }`}
                    />
                  ))}
                  <span className="font-semibold ml-1">{review.rating}/5</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-semibold">
                  {review.user?.display_name || 'Anonymous'}
                </p>
                <span className="text-secondary">•</span>
                <p className="text-sm text-secondary">
                  {new Date(review.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {review.comment && (
                <p className="text-secondary leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-secondary mb-4">No reviews yet</p>
          <p className="text-sm text-secondary">Be the first to review this tool!</p>
        </div>
      )}
    </div>
  );
}
