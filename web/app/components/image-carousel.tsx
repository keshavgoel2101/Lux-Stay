import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
  fallback?: React.ReactNode;
  showThumbnails?: boolean;
  showDots?: boolean;
}

export function ImageCarousel({
  images,
  alt,
  className,
  aspectRatio = "video",
  fallback,
  showThumbnails = false,
  showDots = true,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const hasImages = images && images.length > 0;
  const hasMultipleImages = hasImages && images.length > 1;

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsLoading(true);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  };

  const goToIndex = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(index);
    setIsLoading(true);
  };

  const aspectRatioClass = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  }[aspectRatio];

  if (!hasImages) {
    return (
      <div className={cn(aspectRatioClass, "bg-muted relative", className)}>
        {fallback || (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-muted-foreground">No images</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Main image */}
      <div className={cn(aspectRatioClass, "bg-muted relative overflow-hidden")}>
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse z-10" />
        )}
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Navigation arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full bg-background/80 hover:bg-background"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 rounded-full bg-background/80 hover:bg-background"
              onClick={goToNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image counter badge */}
        {hasMultipleImages && (
          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-1 rounded-md font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}

        {/* Dots indicator */}
        {showDots && hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToIndex(e, index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && hasMultipleImages && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={(e) => goToIndex(e, index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <img
                src={image}
                alt={`${alt} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
