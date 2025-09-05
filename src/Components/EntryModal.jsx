import React, { useEffect, useState } from "react";

// Simple date formatter
const formatDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]}`;
};

const formatDay = (date) => {
  return `Day ${date.getDate()}`;
};

// Mock useSwipeable hook
const useSwipeable = (handlers) => {
  return {
    onTouchStart: (e) => {
      const startX = e.touches[0].clientX;
      const handleTouchEnd = (endE) => {
        const endX = endE.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) handlers.onSwipedLeft?.();
          else handlers.onSwipedRight?.();
        }
        e.target.removeEventListener('touchend', handleTouchEnd);
      };
      e.target.addEventListener('touchend', handleTouchEnd);
    }
  };
};

export default function EntryModal({ entries = [], initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => setIndex(initialIndex), [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entries.length, onClose]);

  const paginate = (dir) => {
    setIndex((i) => {
      let next = i + dir;
      if (next < 0) return 0;
      if (next >= entries.length) return entries.length - 1;
      return next;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    trackMouse: true,
  });

  // Mock entries for demonstration
  const mockEntries = [
    {
      _parsed: new Date('2024-08-05'),
      rating: 4,
      imgUrl: 'https://images.unsplash.com/photo-1494790108755-2616c830588c?w=400&h=700&fit=crop',
      categories: ['W', 'DC'],
      description: "Finally tried the coconut oil deep conditioning treatment. My hair feels incredibly soft and manageable. Noticed significantly less breakage during combing."
    },
    {
      _parsed: new Date('2024-12-09'),
      rating: 5,
      imgUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=700&fit=crop',
      categories: ['W', 'DC'],
      description: "Amazing results with the new protein treatment!"
    },
    {
      _parsed: new Date('2024-12-21'),
      rating: 4,
      imgUrl: 'https://images.unsplash.com/photo-1595475884562-58c0f300ea13?w=400&h=700&fit=crop',
      categories: ['S', 'D'],
      description: "This haircut is everything! Love how it frames my face."
    }
  ];

  const displayEntries = entries.length > 0 ? entries : mockEntries;
  if (!displayEntries.length) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      
      <div className="carousel" {...swipeHandlers}>
        {/* Single close button outside and above the carousel */}
        
<button 
          className="modal-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✕
        </button>
        {displayEntries.map((entry, i) => {
          let cardClass = "modal-card";
          if (i === index) {
            cardClass += " active";
          } else if (i === index - 1) {
            cardClass += " prev";
          } else if (i === index + 1) {
            cardClass += " next";
          } else if (i < index) {
            cardClass += " hidden-left";
          } else {
            cardClass += " hidden-right";
          }

          return (
            <div 
              key={i} 
              className={cardClass}
              onClick={() => {
                if (i !== index) {
                  setIndex(i);
                }
              }}
            >
              {/* Image - takes most of the space */}
              <div className="modal-image-container">
                <img 
                  src={entry.imgUrl || entry.image} 
                  alt=""
                  className="modal-image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616c830588c?w=400&h=700&fit=crop';
                  }}
                />
              </div>

              {/* Content section with date, day, rating, and tags in one line */}
              <div className="modal-content">
                <div className="modal-info-line">
                  <div className="modal-date-section">
                    <span className="modal-date">{formatDate(entry._parsed)}</span>
                    <span className="modal-day">{formatDay(entry._parsed)}</span>
                  </div>
                  
                  <div className="modal-rating-tags">
                    {/* Rating */}
                    <div className="modal-rating">
                      <div className="stars">
                        {'★'.repeat(Math.floor(entry.rating))}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {entry.categories && entry.categories.length > 0 && (
                      <div className="modal-tags">
                        {entry.categories.map((category, j) => (
                          <div key={j} className={`modal-tag ${category}`}>
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="modal-description">{entry.description}</p>
                
                {/* Page Indicator */}
                <div className="page-indicator">
                  {i + 1} / {displayEntries.length}
                </div>
              </div>

              {/* View Full Post - only on active card */}
              {i === index && (
                <div className="modal-footer">
                  <button className="view-full-post">
                    View Full Post
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}