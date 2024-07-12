import {useEffect} from 'react'
import { animateScroll as scroll } from 'react-scroll';

export const ScrollToTopOnMount = () => {
    useEffect(() => {
        scroll.scrollToTop();
      }, []);
      return null;
}

  