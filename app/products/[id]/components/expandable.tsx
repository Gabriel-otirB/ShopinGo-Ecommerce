import { useEffect, useRef, useState } from 'react';

const ExpandableDescription = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lineHeight = parseFloat(getComputedStyle(el).lineHeight || '0');
    const maxHeight = lineHeight * 3;
    if (el.scrollHeight > maxHeight) {
      setShowToggle(true);
    }
  }, [text]);

  return (
    <div>
      <p
        ref={ref}
        className={`text-gray-700 dark:text-gray-300 text-base transition-all duration-200 ${
          isExpanded ? '' : 'line-clamp-3'
        }`}
      >
        {text}
      </p>
      {showToggle && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-blue-600 dark:text-blue-400 text-sm underline cursor-pointer"
        >
          {isExpanded ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  );
};

export default ExpandableDescription;