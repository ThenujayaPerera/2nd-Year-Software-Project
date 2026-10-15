import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * Ensures that whenever a user navigates between routes/pages,
 * the viewport immediately scrolls to the top of the page.
 * Solves the issue where navigating from footer links or bottom-of-page CTAs
 * causes the destination page to mount already scrolled down to the footer.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instant scroll to the absolute top of the page
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    // Fallback for document scrolling elements
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search]);

  return null;
}
