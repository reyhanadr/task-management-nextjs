'use client';

interface CommentContentProps {
  content: string;
}

export default function CommentContent({ content }: CommentContentProps) {
  return (
    <div className="pl-11"> {/* Aligned with avatar */}
      <p className="text-gray-700 whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}
