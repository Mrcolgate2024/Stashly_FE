import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow-sm" {...props} />
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-50" {...props} />
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="divide-y divide-gray-200" {...props} />
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-gray-50" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
        ),
        td: ({ node, children, ...props }) => {
          // Check if content is a number with % or possibly a numeric value
          let content = '';
          if (children && Array.isArray(children)) {
            content = children.join('').trim();
          } else if (typeof children === 'string') {
            content = children.trim();
          }
          
          // Apply color styling based on content
          let className = "px-4 py-3 text-sm text-gray-900 whitespace-nowrap";
          
          if (content) {
            // Handle percentage values
            if (content.endsWith('%')) {
              const value = parseFloat(content);
              if (!isNaN(value)) {
                if (value > 0) {
                  className += " text-[#0078ff] font-medium"; // Blue for positive values
                } else if (value < 0) {
                  className += " text-[#e74c3c] font-medium"; // Red for negative values
                }
              }
            } 
            // Handle numeric values without % sign
            else {
              const value = parseFloat(content);
              if (!isNaN(value)) {
                if (value > 0) {
                  className += " text-[#0078ff] font-medium"; // Blue for positive values
                } else if (value < 0) {
                  className += " text-[#e74c3c] font-medium"; // Red for negative values
                }
              }
            }
          }
          
          return <td className={className} {...props}>{children}</td>;
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );
}; 