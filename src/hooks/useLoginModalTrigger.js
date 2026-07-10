import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export const useLoginModalTrigger = (setShowLoginModal) => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.showLogin) {
            setShowLoginModal(true);
            // Clear the state so it doesn't reopen on reload
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname, setShowLoginModal]);
};
