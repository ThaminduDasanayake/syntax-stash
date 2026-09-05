"use client";

import { memo, useState } from "react";

import { AuthModal } from "@/components/auth-modal";
import { ResourceCardView } from "@/components/resource-card-view";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSession } from "@/lib/auth-client";
import { slugifyAuthor } from "@/lib/authors";
import { getGitHubStars } from "@/lib/github";
import { ResourceCardProps } from "@/types";

function ResourceCardComponent({
  isBookmarked: propIsBookmarked,
  onCardClick,
  onToggleBookmark: propOnToggleBookmark,
  resource,
}: ResourceCardProps) {
  const stars = getGitHubStars(resource.gitHubLink);
  const { data: session } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isBookmarked: hookIsBookmarked, toggleBookmark: hookToggleBookmark } = useBookmarks();
  const bookmarked = propIsBookmarked !== undefined ? propIsBookmarked : hookIsBookmarked(resource);
  const toggle = propOnToggleBookmark || hookToggleBookmark;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      setAuthModalOpen(true);
      return;
    }
    toggle(resource);
  };

  return (
    <>
      {authModalOpen && <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />}
      <ResourceCardView
        author={resource.author}
        authorHref={(name) => `/authors/${slugifyAuthor(name)}`}
        category={resource.category}
        description={resource.description}
        favicon={resource.favicon}
        iconClassName={resource.className}
        isBookmarked={bookmarked}
        onBookmarkClick={handleBookmarkClick}
        onCardClick={onCardClick ? () => onCardClick(resource) : undefined}
        stars={stars}
        subtitle={resource.subtitle}
        title={resource.title}
        url={resource.url}
      />
    </>
  );
}

export const ResourceCard = memo(ResourceCardComponent);
export default ResourceCard;
