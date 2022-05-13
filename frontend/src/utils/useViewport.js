import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateViewportDimensions } from "../redux/actions/responsiveActions";

const getCurrentDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

const useViewport = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleWindowResize = () => {
      dispatch(updateViewportDimensions(getCurrentDimensions()));
    };

    window.addEventListener("resize", handleWindowResize);
    dispatch(updateViewportDimensions(getCurrentDimensions()));

    return () => window.removeEventListener("resize", handleWindowResize);
  }, [dispatch]);

  return;
};

export default useViewport;
