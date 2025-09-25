import React, { useEffect, useRef } from "react";

const CommentaryBox = ({ logs }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="commentary-box">
      <div className="commentary-title">Combat Log</div>
      <div ref={scrollRef} style={{ maxHeight: "400px", overflowY: "auto" }}>
        {logs.length === 0 ? (
          <div className="commentary-log">
            No actions yet. Start the game to see combat logs!
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="commentary-log">
              {log.description}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentaryBox;
